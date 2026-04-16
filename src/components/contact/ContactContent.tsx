"use client";

import { useState } from "react";
import { Mail, MapPin, MessageCircle, Send, Loader2 } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "contact@expatriates360.com",
    href: "mailto:contact@expatriates360.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Serving expats worldwide",
    href: null,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "053-5048401",
    href: "https://wa.me/0535048401",
  },
];

export function ContactContent() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    setStatus("sending");
    // Simulate async send — wire up to your API route to actually send
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("sent");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
      {/* Left — contact info */}
      <div className="lg:col-span-2 animate-in fade-in slide-in-from-left-6 duration-700">
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Contact information
        </h2>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          Reach us through any of the channels below. We typically respond
          within one business day.
        </p>

        <ul className="space-y-8">
          {contactInfo.map(({ icon: Icon, label, value, href }) => (
            <li key={label} className="flex items-start gap-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                  {label}
                </p>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-medium hover:text-primary transition-colors"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-foreground font-medium">{value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* decorative dashes */}
        <div className="mt-14 hidden lg:flex flex-col gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full bg-gradient-to-r from-primary/50 to-transparent"
              style={{ width: `${60 - i * 10}%`, opacity: 1 - i * 0.15 }}
            />
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="lg:col-span-3 animate-in fade-in slide-in-from-right-6 duration-700">
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-8 sm:p-10 shadow-xl shadow-primary/5">
          {status === "sent" ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                <Send className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold">Message sent!</h3>
              <p className="text-muted-foreground max-w-xs">
                Thanks for reaching out. We&apos;ll get back to you shortly.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-2 text-sm text-primary underline-offset-4 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight mb-1">
                  Send us a message
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fill in the form and we&apos;ll be in touch.
                </p>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-destructive">
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
