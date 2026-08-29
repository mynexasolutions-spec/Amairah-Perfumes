import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createShipment, trackShipment, checkServiceability } from "@/lib/delhivery";
import { DEFAULT_PACKAGE } from "@/lib/constants";
import { cookies } from "next/headers";
import { verifyAdminSessionToken, COOKIE_NAME as ADMIN_COOKIE_NAME } from "@/lib/adminSession";

async function getAuth() {
  // 1. Check custom admin session cookie first
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (adminToken) {
    const adminSession = await verifyAdminSessionToken(adminToken);
    if (adminSession) {
      return {
        user: { id: "admin", email: adminSession.email },
        isAdmin: true,
      };
    }
  }

  // 2. Fallback to Supabase auth for regular customers
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, isAdmin: false };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return { user, isAdmin: profile?.role === "admin" };
}

async function loadOrderForShipping(orderId) {
  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select(
      `id, order_number, user_id, total_amount, payment_method, tracking_number,
       addresses ( full_name, phone, address_line_1, address_line_2, city, state, postal_code ),
       order_items ( quantity, product_variants ( weight_grams ) )`
    )
    .eq("id", orderId)
    .maybeSingle();
  return order;
}

function estimateWeightGrams(order) {
  const itemsWeight = (order.order_items || []).reduce((sum, item) => {
    const unitWeight = item.product_variants?.weight_grams || DEFAULT_PACKAGE.itemWeightGrams;
    return sum + unitWeight * item.quantity;
  }, 0);
  return itemsWeight + DEFAULT_PACKAGE.packagingOverheadGrams;
}

export async function POST(request) {
  const { action, payload } = (await request.json()) || {};
  if (!action) return Response.json({ success: false, error: "action is required." }, { status: 400 });

  try {
    if (action === "check_serviceability") {
      const { pincode } = payload || {};
      if (!pincode) return Response.json({ success: false, error: "pincode is required." }, { status: 400 });

      try {
        const data = await checkServiceability(pincode);
        return Response.json({ success: true, data });
      } catch (err) {
        console.warn("Delhivery checkServiceability failed, falling back to mock check:", err.message);
        
        let district = "Metro City";
        let state = "India";

        // Try local lookup first to have sensible defaults
        const prefix = pincode.slice(0, 2);
        const localMappings = {
          "11": { district: "New Delhi", state: "Delhi" },
          "12": { district: "Gurugram / Faridabad", state: "Haryana" },
          "13": { district: "Karnal / Ambala", state: "Haryana" },
          "14": { district: "Ludhiana / Amritsar", state: "Punjab" },
          "15": { district: "Bathinda / Patiala", state: "Punjab" },
          "16": { district: "Chandigarh", state: "Chandigarh" },
          "17": { district: "Shimla / Solan", state: "Himachal Pradesh" },
          "18": { district: "Jammu / Srinagar", state: "Jammu & Kashmir" },
          "19": { district: "Leh / Ladakh", state: "Ladakh" },
          "20": { district: "Noida / Ghaziabad / Bulandshahr", state: "Uttar Pradesh" },
          "21": { district: "Kanpur / Prayagraj", state: "Uttar Pradesh" },
          "22": { district: "Lucknow / Varanasi", state: "Uttar Pradesh" },
          "23": { district: "Mirzapur / Sonbhadra", state: "Uttar Pradesh" },
          "24": { district: "Dehradun / Moradabad", state: "Uttarakhand / UP" },
          "25": { district: "Meerut / Muzaffarnagar", state: "Uttar Pradesh" },
          "26": { district: "Bareilly / Lakhimpur", state: "Uttar Pradesh" },
          "27": { district: "Gorakhpur / Faizabad", state: "Uttar Pradesh" },
          "28": { district: "Agra / Jhansi", state: "Uttar Pradesh" },
          "30": { district: "Jaipur", state: "Rajasthan" },
          "31": { district: "Udaipur / Ajmer", state: "Rajasthan" },
          "32": { district: "Kota / Bharatpur", state: "Rajasthan" },
          "33": { district: "Bikaner / Jodhpur", state: "Rajasthan" },
          "34": { district: "Barmer / Jaisalmer", state: "Rajasthan" },
          "36": { district: "Rajkot / Junagadh", state: "Gujarat" },
          "37": { district: "Kutch / Gandhidham", state: "Gujarat" },
          "38": { district: "Ahmedabad / Gandhinagar", state: "Gujarat" },
          "39": { district: "Surat / Vadodara", state: "Gujarat" },
          "40": { district: "Mumbai / Thane", state: "Maharashtra" },
          "41": { district: "Pune / Nashik", state: "Maharashtra" },
          "42": { district: "Nashik / Aurangabad", state: "Maharashtra" },
          "43": { district: "Aurangabad / Nanded", state: "Maharashtra" },
          "44": { district: "Nagpur / Amravati", state: "Maharashtra" },
          "45": { district: "Indore / Ujjain", state: "Madhya Pradesh" },
          "46": { district: "Bhopal / Gwalior", state: "Madhya Pradesh" },
          "47": { district: "Gwalior / Chambal", state: "Madhya Pradesh" },
          "48": { district: "Jabalpur / Rewa", state: "Madhya Pradesh" },
          "49": { district: "Raipur / Bilaspur", state: "Chhattisgarh" },
          "50": { district: "Hyderabad", state: "Telangana" },
          "51": { district: "Kurnool / Tirupati", state: "Andhra Pradesh" },
          "52": { district: "Vijayawada / Guntur", state: "Andhra Pradesh" },
          "53": { district: "Visakhapatnam", state: "Andhra Pradesh" },
          "56": { district: "Bengaluru", state: "Karnataka" },
          "57": { district: "Mysuru / Mangaluru", state: "Karnataka" },
          "58": { district: "Hubli / Dharwad", state: "Karnataka" },
          "59": { district: "Belagavi", state: "Karnataka" },
          "60": { district: "Chennai", state: "Tamil Nadu" },
          "61": { district: "Thanjavur / Trichy", state: "Tamil Nadu" },
          "62": { district: "Madurai / Tirunelveli", state: "Tamil Nadu" },
          "63": { district: "Coimbatore / Salem", state: "Tamil Nadu" },
          "64": { district: "Coimbatore", state: "Tamil Nadu" },
          "67": { district: "Kozhikode / Palakkad", state: "Kerala" },
          "68": { district: "Kochi / Kottayam", state: "Kerala" },
          "69": { district: "Thiruvananthapuram", state: "Kerala" },
          "70": { district: "Kolkata", state: "West Bengal" },
          "71": { district: "Durgapur / Asansol", state: "West Bengal" },
          "72": { district: "Kharagpur / Haldia", state: "West Bengal" },
          "73": { district: "Siliguri / Darjeeling", state: "West Bengal" },
          "74": { district: "Nadia / Barasat", state: "West Bengal" },
          "75": { district: "Bhubaneswar / Cuttack", state: "Odisha" },
          "76": { district: "Rourkela / Sambalpur", state: "Odisha" },
          "77": { district: "Sambalpur", state: "Odisha" },
          "78": { district: "Guwahati / Tezpur", state: "Assam" },
          "79": { district: "Shillong / Imphal / Agartala", state: "North East" },
          "80": { district: "Patna / Gaya", state: "Bihar" },
          "81": { district: "Bhagalpur / Munger", state: "Bihar" },
          "82": { district: "Ranchi / Dhanbad", state: "Jharkhand" },
          "83": { district: "Jamshedpur", state: "Jharkhand" },
          "84": { district: "Muzaffarpur / Darbhanga", state: "Bihar" },
          "85": { district: "Purnia / Saharsa", state: "Bihar" }
        };

        if (localMappings[prefix]) {
          district = localMappings[prefix].district;
          state = localMappings[prefix].state;
        }

        try {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), 4000);
          const postRes = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
            signal: controller.signal,
            cache: "no-store",
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Accept": "application/json"
            }
          });
          clearTimeout(id);
          
          if (postRes.ok) {
            const postData = await postRes.json();
            if (postData?.[0]?.Status === "Success" && postData[0].PostOffice?.length > 0) {
              const po = postData[0].PostOffice[0];
              district = po.District;
              state = po.State;
            }
          }
        } catch (postErr) {
          console.warn("Postal API lookup failed, using local prefix lookup mappings:", postErr.message);
        }
        
        // Mock fallback for testing (serviceable for all valid 6-digit Indian pincodes)
        const mockServiceable = /^[1-9]\d{5}$/.test(pincode);
        const mockData = {
          delivery_codes: mockServiceable ? [
            {
              postal_code: {
                pincode: parseInt(pincode),
                is_active: "Y",
                district: district,
                state_code: state,
                cod: parseInt(pincode) % 2 === 0 ? "Y" : "N",
                cash: "Y"
              }
            }
          ] : []
        };
        return Response.json({ success: true, data: mockData, isMock: true });
      }
    }

    const { user, isAdmin } = await getAuth();
    if (!user) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    if (action === "create_shipment") {
      if (!isAdmin) return Response.json({ success: false, error: "Forbidden" }, { status: 403 });

      const { orderId, weightGrams, lengthCm, widthCm, heightCm } = payload || {};
      if (!orderId) return Response.json({ success: false, error: "orderId is required." }, { status: 400 });

      const order = await loadOrderForShipping(orderId);
      if (!order) return Response.json({ success: false, error: "Order not found." }, { status: 404 });
      if (order.tracking_number) {
        return Response.json({ success: false, error: "This order is already booked with a courier." }, { status: 400 });
      }
      if (!order.addresses) return Response.json({ success: false, error: "Order has no shipping address." }, { status: 400 });

      const weight = weightGrams || estimateWeightGrams(order);
      const result = await createShipment({
        order,
        address: order.addresses,
        weightKg: weight / 1000,
        lengthCm: lengthCm || DEFAULT_PACKAGE.lengthCm,
        widthCm: widthCm || DEFAULT_PACKAGE.breadthCm,
        heightCm: heightCm || DEFAULT_PACKAGE.heightCm,
      });

      const admin = createAdminClient();
      await admin
        .from("orders")
        .update({
          tracking_number: result.waybill,
          tracking_url: result.trackingUrl,
          courier_name: "Delhivery",
          order_status: "shipped",
          shipped_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      return Response.json({ success: true, waybill: result.waybill, trackingUrl: result.trackingUrl });
    }

    if (action === "track_shipment") {
      const { orderId } = payload || {};
      if (!orderId) return Response.json({ success: false, error: "orderId is required." }, { status: 400 });

      const admin = createAdminClient();
      let query = admin.from("orders").select("id, user_id, tracking_number").eq("id", orderId);
      if (!isAdmin) query = query.eq("user_id", user.id);
      const { data: order } = await query.maybeSingle();

      if (!order) return Response.json({ success: false, error: "Order not found." }, { status: 404 });
      if (!order.tracking_number) {
        return Response.json({ success: false, error: "This order hasn't shipped yet." }, { status: 404 });
      }

      const data = await trackShipment(order.tracking_number);
      const shipment = data?.ShipmentData?.[0]?.Shipment;
      const status = shipment?.Status?.Status;

      if (status) {
        await admin
          .from("orders")
          .update({
            shipment_status: status,
            order_status: status.toLowerCase() === "delivered" ? "delivered" : undefined,
          })
          .eq("id", orderId);
      }

      return Response.json({ success: true, tracking: data });
    }

    return Response.json({ success: false, error: "Invalid action type." }, { status: 400 });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 502 });
  }
}
