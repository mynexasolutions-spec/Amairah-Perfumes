// Delhivery courier integration. Mirrors the working implementation in the
// Ram Setu project's netlify/functions/delhivery-shipment.js — same base
// URLs, request/response shapes, and field mapping — adapted to plain
// server-side functions instead of a Netlify function handler.

function getConfig() {
  const token = process.env.DELHIVERY_API_TOKEN;
  const pickupLocation = process.env.DELHIVERY_PICKUP_LOCATION;
  const isSandbox = process.env.DELHIVERY_SANDBOX === "true" || process.env.DELHIVERY_SANDBOX === "1";

  if (!token) throw new Error("Delhivery is not configured — DELHIVERY_API_TOKEN is missing.");
  if (!pickupLocation) throw new Error("Delhivery is not configured — DELHIVERY_PICKUP_LOCATION is missing.");

  return {
    token,
    pickupLocation,
    baseUrl: isSandbox ? "https://staging-express.delhivery.com" : "https://track.delhivery.com",
  };
}

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 3000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

// POST /api/cmu/create.json — creates a shipment and returns a waybill
// number. `order` needs { id, order_number, payment_method, total_amount },
// `address` needs { full_name, address_line_1, address_line_2, city, state,
// postal_code, phone }.
export async function createShipment({ order, address, weightKg, lengthCm, widthCm, heightCm }) {
  const { token, pickupLocation, baseUrl } = getConfig();

  const isCod = order.payment_method === "COD";
  const delhiveryData = {
    pickup_location: { name: pickupLocation },
    shipments: [
      {
        name: address.full_name,
        add: [address.address_line_1, address.address_line_2].filter(Boolean).join(", "),
        pin: address.postal_code,
        city: address.city,
        state: address.state,
        phone: address.phone || "9999999999",
        payment_mode: isCod ? "COD" : "Prepaid",
        order: order.order_number,
        cod_amount: isCod ? Math.round(order.total_amount) : 0,
        package_weight: weightKg,
        package_length: lengthCm,
        package_width: widthCm,
        package_height: heightCm,
        product_desc: "Perfumes",
      },
    ],
  };

  const body = new URLSearchParams();
  body.append("format", "json");
  body.append("data", JSON.stringify(delhiveryData));

  const response = await fetchWithTimeout(`${baseUrl}/api/cmu/create.json`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const responseText = await response.text();
  let responseData;
  try {
    responseData = JSON.parse(responseText);
  } catch {
    throw new Error(`Delhivery API returned a non-JSON response (status ${response.status}): ${responseText.slice(0, 150)}`);
  }

  const firstPkg = responseData.packages?.[0];
  const waybill = firstPkg?.waybill;

  if (!response.ok || !waybill || firstPkg?.status === "Fail") {
    const errorMsg =
      firstPkg?.remarks?.[0] ||
      (typeof responseData.error === "string" ? responseData.error : null) ||
      responseData.rmk ||
      responseData.detail ||
      responseData.message ||
      (responseData.packages || []).map((p) => p.remarks?.join(", ")).filter(Boolean).join("; ") ||
      "Failed to create Delhivery shipment (no waybill returned)";
    throw new Error(errorMsg);
  }

  return { waybill, trackingUrl: `https://www.delhivery.com/track/package/${waybill}`, raw: responseData };
}

// GET /api/v1/packages/json/?waybill= — live scan history + status.
export async function trackShipment(waybill) {
  const { token, baseUrl } = getConfig();

  const response = await fetchWithTimeout(`${baseUrl}/api/v1/packages/json/?waybill=${encodeURIComponent(waybill)}`, {
    headers: { Authorization: `Token ${token}` },
  });

  if (!response.ok) throw new Error("Delhivery tracking API call failed.");
  return response.json();
}

// GET /c/api/pin-codes/json/?pincode= — serviceability check.
export async function checkServiceability(pincode) {
  const { token, baseUrl } = getConfig();

  const response = await fetchWithTimeout(`${baseUrl}/c/api/pin-codes/json/?pincode=${encodeURIComponent(pincode)}`, {
    headers: { Authorization: `Token ${token}` },
  });

  if (!response.ok) throw new Error("Delhivery serviceability check failed.");
  return response.json();
}
