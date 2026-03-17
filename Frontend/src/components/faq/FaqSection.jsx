import { useState } from 'react';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const faqs = [
  {
    question: "How does food donation work on MealConnect?",
    answer: "MealConnect makes food donation simple. Restaurants and food businesses can register, list their surplus food, and our platform connects them with nearby NGOs and food banks. We ensure safe food handling and timely pickup/delivery.",
    emoji: "🍽️",
  },
  {
    question: "What types of food can be donated?",
    answer: "We accept non-perishable foods, fresh produce, prepared meals, and packaged foods that are still safe for consumption. All donations must meet food safety guidelines and be within their consumption timeframe.",
    emoji: "🥗",
  },
  {
    question: "How do you ensure food safety?",
    answer: "We follow strict food safety protocols. All donors must comply with food safety guidelines, and our NGO partners are trained in proper food handling. We monitor temperature control and delivery timing to maintain food quality.",
    emoji: "🛡️",
  },
  {
    question: "Can individuals donate food?",
    answer: "Currently, we primarily work with businesses and organizations to ensure consistent food quality and quantity. However, individuals can support our mission through volunteering or financial contributions.",
    emoji: "🙋",
  },
  {
    question: "How can NGOs partner with MealConnect?",
    answer: "NGOs can apply through our website. We verify credentials, assess food handling capabilities, and provide training. Once approved, NGOs can access our platform to receive food donations.",
    emoji: "🤝",
  },
  {
    question: "What areas do you currently serve?",
    answer: "We currently operate in major cities across Maharashtra, with plans to expand to other regions. Check our coverage area page for specific locations and expansion updates.",
    emoji: "📍",
  },
];

/* ── Single accordion item ── */
function FaqItem({ faq, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
    >
      <div
        className={`
          group relative rounded-2xl border transition-all duration-300 cursor-pointer
          ${isOpen
            ? "border-blue-300 bg-white shadow-lg shadow-blue-100/60"
            : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-md hover:shadow-blue-50/80"
          }
        `}
        onClick={onToggle}
      >
        {/* Left accent bar — visible when open */}
        <div
          className={`absolute left-0 top-4 bottom-4 w-1 rounded-full transition-all duration-300 ${
            isOpen ? "bg-gradient-to-b from-blue-400 to-blue-600 opacity-100" : "opacity-0"
          }`}
        />

        {/* Summary row */}
        <div className="flex items-center gap-4 px-6 py-5 pl-7">
          {/* Emoji badge */}
          <span
            className={`
              flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg
              transition-all duration-300
              ${isOpen ? "bg-blue-600 shadow-md shadow-blue-200" : "bg-blue-50 group-hover:bg-blue-100"}
            `}
          >
            {faq.emoji}
          </span>

          {/* Question */}
          <span
            className={`flex-1 text-base font-semibold leading-snug transition-colors duration-200 ${
              isOpen ? "text-blue-700" : "text-slate-700 group-hover:text-blue-600"
            }`}
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {faq.question}
          </span>

          {/* Toggle icon */}
          <span
            className={`
              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
              ${isOpen
                ? "bg-blue-600 text-white rotate-0"
                : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500"
              }
            `}
          >
            {isOpen ? <RemoveIcon sx={{ fontSize: 16 }} /> : <AddIcon sx={{ fontSize: 16 }} />}
          </span>
        </div>

        {/* Animated answer */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="answer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-5 pl-[4.5rem]">
                <div className="h-px bg-blue-100 mb-4" />
                <p
                  className="text-slate-500 text-sm leading-relaxed"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Sora:wght@400;500;600&display=swap');
      `}</style>

      <section className="relative w-full bg-slate-50 py-20 px-6 md:px-14 overflow-hidden">

        {/* ── Background blobs ── */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-100/50 blur-[110px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-blue-50/70 blur-[90px]" />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto flex flex-col lg:flex-row gap-16 items-start">

          {/* ── Left: sticky header ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24 flex flex-col gap-5 lg:w-80 flex-shrink-0"
          >
            <Chip
              variant="soft"
              color="primary"
              size="sm"
              sx={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", px: 2, width: "fit-content" }}
            >
              FAQ
            </Chip>

            <h2
              className="text-4xl md:text-5xl font-black leading-tight text-slate-800"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Questions?{" "}
              <span
                className="italic text-transparent bg-clip-text block"
                style={{ backgroundImage: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
              >
                Look here.
              </span>
            </h2>

            <p
              className="text-slate-400 text-sm leading-relaxed"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Everything you need to know about donating food and partnering with MealConnect.
            </p>

            {/* Decorative stat */}
            <div className="mt-2 flex flex-col gap-3">
              {[
                { value: "6", label: "Common questions answered" },
                { value: "24h", label: "Average response time" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-blue-100 shadow-sm">
                  <span
                    className="text-xl font-black text-transparent bg-clip-text"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      backgroundImage: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    }}
                  >
                    {s.value}
                  </span>
                  <span className="text-xs text-slate-400 font-medium"
                    style={{ fontFamily: "'Sora', sans-serif" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Still have questions CTA */}
            <div className="mt-2 p-5 rounded-2xl border border-dashed border-blue-200 bg-blue-50/50 flex flex-col gap-2">
              <p className="text-sm font-semibold text-slate-700"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                Still have questions?
              </p>
              <p className="text-xs text-slate-400"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                Reach out and we'll get back to you within 24 hours.
              </p>
              <a
                href="/contact"
                className="mt-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
              >
                Contact Us
              </a>
            </div>
          </motion.div>

          {/* ── Right: accordion list ── */}
          <div className="flex-1 flex flex-col gap-3 w-full">
            {faqs.map((faq, i) => (
              <FaqItem
                key={i}
                faq={faq}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

export default FaqSection;