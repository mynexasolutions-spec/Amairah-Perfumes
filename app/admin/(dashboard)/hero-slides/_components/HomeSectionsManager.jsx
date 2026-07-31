"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, AlertCircle, ArrowRight } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { updateSiteSetting } from "@/actions/settings";

const inputClass =
  "w-full rounded-xl border border-gold-400/10 bg-ink/40 px-4 py-2.5 text-sm text-ivory placeholder:text-ivory/30 transition-colors duration-300 focus:border-gold-400/40 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/20";
const labelClass = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-ivory/40";
const panelClass =
  "rounded-[2rem] border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 p-6 backdrop-blur-md md:p-8";

const SECTIONS = [
  {
    id: "marquee",
    title: "Marquee Strip",
    enabledKey: "home_marquee_enabled",
    fields: [
      {
        key: "home_marquee_items",
        label: "Items",
        hint: "One item per line. Start a line with * to highlight it in gold.",
        rows: 8,
      },
    ],
  },
  {
    id: "choose",
    title: "Find the Perfect Scent",
    enabledKey: "home_choose_enabled",
    fields: [
      { key: "home_choose_subtitle", label: "Subtitle" },
      { key: "home_choose_option1_title", label: "Option 1 — Title" },
      { key: "home_choose_option1_desc", label: "Option 1 — Description" },
      { key: "home_choose_option2_title", label: "Option 2 — Title" },
      { key: "home_choose_option2_desc", label: "Option 2 — Description" },
      { key: "home_choose_option3_title", label: "Option 3 — Title" },
      { key: "home_choose_option3_desc", label: "Option 3 — Description" },
      { key: "home_choose_unsure_title", label: "Consultation Card — Heading" },
      { key: "home_choose_unsure_text", label: "Consultation Card — Text" },
      { key: "home_choose_unsure_button", label: "Consultation Card — Button Text" },
    ],
    imageKey: "home_choose_image",
  },
  {
    id: "journey",
    title: "The Fragrance Journey",
    enabledKey: "home_journey_enabled",
    fields: [
      { key: "home_journey_line1", label: "Line 1" },
      { key: "home_journey_label1", label: "Line 1 — Label" },
      { key: "home_journey_line2", label: "Line 2" },
      { key: "home_journey_label2", label: "Line 2 — Label" },
      { key: "home_journey_line3", label: "Line 3" },
      { key: "home_journey_label3", label: "Line 3 — Label" },
    ],
    imageKey: "home_journey_image",
  },
  {
    id: "limited",
    title: "Limited Edition",
    enabledKey: "home_limited_enabled",
    fields: [
      { key: "home_limited_heading_line1", label: "Heading — Line 1" },
      { key: "home_limited_heading_line2", label: "Heading — Line 2 (highlighted in gold)" },
      { key: "home_limited_subtitle", label: "Subtitle" },
      { key: "home_limited_button_text", label: "Button Text" },
    ],
    imageKey: "home_limited_image",
  },
  {
    id: "testimonials",
    title: "What Our Customers Say",
    enabledKey: "home_testimonials_enabled",
    fields: [{ key: "home_testimonials_subtitle", label: "Subtitle" }],
    note: "Manage the actual customer reviews on the Testimonials page.",
    noteHref: "/admin/testimonials",
  },
  {
    id: "faq",
    title: "Questions You Might Have",
    enabledKey: "home_faq_enabled",
    fields: [
      { key: "home_faq_subtitle", label: "Subtitle" },
      { key: "home_faq_q1", label: "Question 1" },
      { key: "home_faq_a1", label: "Answer 1" },
      { key: "home_faq_q2", label: "Question 2" },
      { key: "home_faq_a2", label: "Answer 2" },
      { key: "home_faq_q3", label: "Question 3" },
      { key: "home_faq_a3", label: "Answer 3" },
      { key: "home_faq_q4", label: "Question 4" },
      { key: "home_faq_a4", label: "Answer 4" },
    ],
    imageKey: "home_faq_image",
  },
];

export default function HomeSectionsManager({ settings, only }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [savingId, setSavingId] = useState(null);
  const [saved, setSaved] = useState(null);

  const sections = only ? SECTIONS.filter((s) => only.includes(s.id)) : SECTIONS;

  const initialValues = {};
  sections.forEach((section) => {
    section.fields.forEach((f) => {
      initialValues[f.key] = settings[f.key]?.value ?? "";
    });
    if (section.imageKey) initialValues[section.imageKey] = settings[section.imageKey]?.value ?? "";
    if (section.enabledKey) initialValues[section.enabledKey] = settings[section.enabledKey]?.value ?? "true";
  });

  const [values, setValues] = useState(initialValues);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (section) => {
    const keys = [
      ...section.fields.map((f) => f.key),
      ...(section.imageKey ? [section.imageKey] : []),
      ...(section.enabledKey ? [section.enabledKey] : []),
    ];

    setSaved(null);
    setSavingId(section.id);
    startTransition(async () => {
      const results = await Promise.all(keys.map((key) => updateSiteSetting(key, values[key])));
      const failed = results.find((r) => !r.success);
      setSavingId(null);
      if (failed) {
        setSaved({ id: section.id, success: false, error: failed.error });
      } else {
        setSaved({ id: section.id, success: true });
        router.refresh();
        setTimeout(() => setSaved(null), 2000);
      }
    });
  };

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const isSaving = pending && savingId === section.id;
        const sectionEnabled = section.enabledKey ? values[section.enabledKey] !== "false" : true;

        return (
          <div key={section.id} className={panelClass}>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-lg text-ivory">{section.title}</h3>
                {section.enabledKey && (
                  <label className="flex items-center gap-1.5 rounded-full border border-gold-400/10 bg-white/[0.02] px-3 py-1 text-xs font-medium text-ivory/60">
                    <input
                      type="checkbox"
                      checked={sectionEnabled}
                      onChange={(e) => handleChange(section.enabledKey, e.target.checked ? "true" : "false")}
                    />
                    Show on Homepage
                  </label>
                )}
              </div>
              <button
                onClick={() => handleSave(section)}
                disabled={isSaving}
                className="btn-gold w-full px-6 py-2.5 text-xs font-semibold disabled:opacity-60 sm:w-auto"
              >
                {isSaving ? "Saving…" : "Save"}
              </button>
            </div>

            <div className="space-y-5">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className={labelClass}>{field.label}</label>
                  {field.hint && <p className="mb-1.5 -mt-1 text-sm text-ivory/30">{field.hint}</p>}
                  <textarea
                    value={values[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    rows={field.rows ?? (values[field.key]?.length > 80 ? 3 : 1)}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              ))}

              {section.imageKey && (
                <div>
                  <label className={labelClass}>Image</label>
                  <ImageUploader
                    value={values[section.imageKey]}
                    onChange={(url) => handleChange(section.imageKey, url)}
                    folder="amairah/home-sections"
                  />
                </div>
              )}

              {section.note && (
                <Link
                  href={section.noteHref}
                  className="flex items-center gap-1.5 text-sm text-gold-300/80 transition-colors hover:text-gold-200"
                >
                  {section.note} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            {saved?.id === section.id && (
              <div className={`mt-4 flex items-center gap-2 text-sm ${saved.success ? "text-emerald-400" : "text-red-400"}`}>
                {saved.success ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Saved successfully
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3.5 w-3.5" /> {saved.error}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
