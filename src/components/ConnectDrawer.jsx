"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

export default function ConnectDrawer({ trigger }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    projectDetails: "",
    budget: "",
    additionalComments: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.projectDetails) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", phone: "", projectDetails: "", budget: "", additionalComments: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <span onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger}
      </span>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="bg-[#EDE8DF] border-t-3 border-[#2A2520] max-h-[95dvh]">
          <div className="mx-auto w-full max-w-lg px-6 pb-6 overflow-y-auto">
            <DrawerHeader className="px-0 pt-6 pb-4">
              <DrawerTitle
                className="text-4xl font-black text-[#2A2520]"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                Request for Quotation
              </DrawerTitle>
              <DrawerDescription className="text-[#2A2520]/60 text-sm mt-1">
                Fill in the details below and I'll get back to you with a quote.
              </DrawerDescription>
            </DrawerHeader>

            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-16 h-16 rounded-full bg-[#C9A96E] border-3 border-[#2A2520] flex items-center justify-center shadow-[4px_4px_0_#2A2520]">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p
                  className="font-black text-xl text-[#2A2520]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Message Sent!
                </p>
                <p className="text-[#2A2520]/60 text-sm text-center">
                  Thanks for reaching out. I'll get back to you soon.
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setOpen(false);
                  }}
                  className="mt-2 text-sm font-bold uppercase tracking-widest text-[#C9A96E] border-3 border-[#C9A96E] px-6 py-2 shadow-[3px_3px_0_#2A2520] hover:shadow-[1px_1px_0_#2A2520] transition-all"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#2A2520]/60 mb-1.5 block">
                    Full Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-[#F5F0EA] border-3 border-[#2A2520] shadow-[4px_4px_0_#2A2520] text-[#2A2520] placeholder:text-[#2A2520]/30 font-medium focus:outline-none focus:shadow-[2px_2px_0_#C9A96E] focus:border-[#C9A96E] transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#2A2520]/60 mb-1.5 block">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-[#F5F0EA] border-3 border-[#2A2520] shadow-[4px_4px_0_#2A2520] text-[#2A2520] placeholder:text-[#2A2520]/30 font-medium focus:outline-none focus:shadow-[2px_2px_0_#C9A96E] focus:border-[#C9A96E] transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#2A2520]/60 mb-1.5 block">
                    Phone
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+61 4xx xxx xxx"
                    className="w-full px-4 py-3 bg-[#F5F0EA] border-3 border-[#2A2520] shadow-[4px_4px_0_#2A2520] text-[#2A2520] placeholder:text-[#2A2520]/30 font-medium focus:outline-none focus:shadow-[2px_2px_0_#C9A96E] focus:border-[#C9A96E] transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#2A2520]/60 mb-1.5 block">
                    Project Details *
                  </label>
                  <textarea
                    name="projectDetails"
                    value={form.projectDetails}
                    onChange={handleChange}
                    placeholder="Describe the shoot — location, style, timeline..."
                    rows={4}
                    className="w-full px-4 py-3 bg-[#F5F0EA] border-3 border-[#2A2520] shadow-[4px_4px_0_#2A2520] text-[#2A2520] placeholder:text-[#2A2520]/30 font-medium focus:outline-none focus:shadow-[2px_2px_0_#C9A96E] focus:border-[#C9A96E] transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#2A2520]/60 mb-1.5 block">
                    Budget <span className="text-[#2A2520]/30 normal-case font-medium tracking-normal">— optional</span>
                  </label>
                  <input
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    placeholder="e.g. $500–$1000"
                    className="w-full px-4 py-3 bg-[#F5F0EA] border-3 border-[#2A2520] shadow-[4px_4px_0_#2A2520] text-[#2A2520] placeholder:text-[#2A2520]/30 font-medium focus:outline-none focus:shadow-[2px_2px_0_#C9A96E] focus:border-[#C9A96E] transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#2A2520]/60 mb-1.5 block">
                    Additional Comments <span className="text-[#2A2520]/30 normal-case font-medium tracking-normal">— optional</span>
                  </label>
                  <textarea
                    name="additionalComments"
                    value={form.additionalComments}
                    onChange={handleChange}
                    placeholder="Anything else you'd like me to know..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[#F5F0EA] border-3 border-[#2A2520] shadow-[4px_4px_0_#2A2520] text-[#2A2520] placeholder:text-[#2A2520]/30 font-medium focus:outline-none focus:shadow-[2px_2px_0_#C9A96E] focus:border-[#C9A96E] transition-all resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-sm font-bold">
                    Something went wrong. Please try again.
                  </p>
                )}

                <DrawerFooter className="px-0 pt-2 pb-0 flex-row gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={status === "loading"}
                    className="flex-1 bg-[#C9A96E] text-black font-black uppercase tracking-widest text-sm py-3 border-3 border-[#2A2520] shadow-[4px_4px_0_#2A2520] hover:shadow-[2px_2px_0_#2A2520] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    {status === "loading" ? "Sending..." : "Submit Request"}
                  </button>
                  <DrawerClose asChild>
                    <button className="px-6 py-3 border-3 border-[#2A2520] font-bold uppercase tracking-widest text-sm shadow-[4px_4px_0_#2A2520] hover:shadow-[2px_2px_0_#2A2520] hover:translate-x-0.5 hover:translate-y-0.5 transition-all bg-[#F5F0EA]">
                      Cancel
                    </button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
