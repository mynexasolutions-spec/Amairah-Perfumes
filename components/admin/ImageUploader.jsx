"use client";

import { useRef } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { ImagePlus, Star, X } from "lucide-react";

/**
 * `value` is either a single URL string (multiple=false) or an array of URL
 * strings (multiple=true). `onChange` receives the same shape back.
 *
 * When `multiple` and `showCoverPicker` are both set, the first image in the
 * array is treated as the "cover" — each other thumbnail gets a star button
 * that promotes it to index 0.
 */
export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  folder = "amairah",
  previewClassName = "h-24 w-24",
  showCoverPicker = false,
}) {
  const urls = multiple ? value || [] : value ? [value] : [];

  const restoreBodyScroll = () => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
      // Also ensure any lingering modal wrappers are unlocked
      const htmlEl = document.documentElement;
      if (htmlEl) {
        htmlEl.style.overflow = "";
      }
    }
  };

  // The Cloudinary widget instance is created once and keeps whichever
  // onSuccess closure was passed in at that time, so reading `value`
  // directly inside handleSuccess would silently drop every image after
  // the first. A ref that's updated every render always holds the latest
  // array, regardless of which render's closure actually fires.
  const valueRef = useRef(value);
  valueRef.current = value;

  const handleSuccess = (result) => {
    restoreBodyScroll();
    const url = result?.info?.secure_url;
    if (!url) return;
    if (multiple) {
      // Mutate the ref synchronously too, so a second file finishing before
      // this render's state update lands still appends onto the first
      // instead of overwriting it.
      const next = [...(valueRef.current || []), url];
      valueRef.current = next;
      onChange(next);
    } else {
      onChange(url);
    }
  };

  const removeAt = (idx) => {
    if (multiple) onChange((value || []).filter((_, i) => i !== idx));
    else onChange(null);
  };

  const setCover = (idx) => {
    if (idx === 0) return;
    const rest = urls.filter((_, i) => i !== idx);
    onChange([urls[idx], ...rest]);
  };

  const showCover = multiple && showCoverPicker && urls.length > 1;

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {urls.map((url, idx) => (
          <div key={url} className={`relative overflow-hidden rounded-xl border ${idx === 0 && showCover ? "border-gold-400/60" : "border-ink-line"} ${previewClassName}`}>
            <Image src={url} alt="" fill sizes="(max-width: 640px) 100vw, 448px" className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <X className="h-3 w-3" />
            </button>
            {showCover && (
              <button
                type="button"
                onClick={() => setCover(idx)}
                disabled={idx === 0}
                title={idx === 0 ? "Cover image" : "Set as cover image"}
                className={`absolute bottom-1 left-1 flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide backdrop-blur-sm ${
                  idx === 0 ? "bg-gold-gradient text-ink" : "bg-black/60 text-ivory/80 hover:text-gold-300"
                }`}
              >
                <Star className={`h-2.5 w-2.5 ${idx === 0 ? "fill-ink" : ""}`} />
                {idx === 0 ? "Cover" : "Set"}
              </button>
            )}
          </div>
        ))}

        {(multiple || urls.length === 0) && (
          <CldUploadWidget
            signatureEndpoint="/api/cloudinary/sign"
            options={{ folder, multiple, sources: ["local", "url", "camera"] }}
            onSuccess={handleSuccess}
            onClose={restoreBodyScroll}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-line text-ivory/40 transition-colors hover:border-gold-400/50 hover:text-gold-300 ${previewClassName}`}
              >
                <ImagePlus className="h-5 w-5" />
                <span className="text-[10px]">Upload</span>
              </button>
            )}
          </CldUploadWidget>
        )}
      </div>
    </div>
  );
}
