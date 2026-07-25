"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const WEDDING_DATE = new Date("2026-11-07T17:00:00");

/* ─── Countdown ──────────────────────────────────────────── */
function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = WEDDING_DATE.getTime() - Date.now();
      if (diff <= 0) { setIsPast(true); return; }
      setIsPast(false);
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  if (isPast) {
    return (
      <p style={{ fontFamily: "var(--font-montaga)" }} className="text-[#8a415d] text-4xl lg:text-5xl text-center px-4">
        ¡Ya llegó el gran día!
      </p>
    );
  }

  return (
    <div className="flex gap-4 lg:gap-12 justify-center">
      {[
        { label: "Días",  value: pad(timeLeft.days) },
        { label: "Horas", value: pad(timeLeft.hours) },
        { label: "Min",   value: pad(timeLeft.minutes) },
        { label: "Seg",   value: pad(timeLeft.seconds) },
      ].map(({ label, value }) => (
        <div key={label} className="text-center">
          <div style={{ fontFamily: "var(--font-montaga)" }}
            className="text-[#8a415d] text-[62px] lg:text-[110px] leading-none tabular-nums">
            {value}
          </div>
          <div className="text-[#8a415d] text-xs lg:text-lg mt-1 lg:mt-2 tracking-widest uppercase font-semibold">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Desktop: centered 1440px wrapper + fade-in on scroll ─ */
function C({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="hidden lg:flex absolute inset-0 justify-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 1s ease, transform 1s ease",
      }}
    >
      <div className="relative flex-shrink-0 h-full" style={{ width: 1440 }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Mobile: fade-in wrapper ────────────────────────────── */
function FadeIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      {children}
    </div>
  );
}

/* ─── Falling petals overlay ─────────────────────────────── */
const PETALS = [
  { left: "4%",  delay: "0s",    dur: "9s",    size: 13, color: "#e8b4c8" },
  { left: "12%", delay: "1.4s",  dur: "11s",   size: 9,  color: "#f5ccd8" },
  { left: "21%", delay: "2.8s",  dur: "8.5s",  size: 15, color: "#d4a0b8" },
  { left: "33%", delay: "0.6s",  dur: "10.5s", size: 11, color: "#e8b4c8" },
  { left: "44%", delay: "3.3s",  dur: "9.5s",  size: 9,  color: "#f5ccd8" },
  { left: "55%", delay: "1.9s",  dur: "12s",   size: 13, color: "#d4a0b8" },
  { left: "64%", delay: "0.4s",  dur: "8s",    size: 11, color: "#e8b4c8" },
  { left: "74%", delay: "2.5s",  dur: "11s",   size: 15, color: "#f5ccd8" },
  { left: "83%", delay: "1.6s",  dur: "9.5s",  size: 9,  color: "#d4a0b8" },
  { left: "91%", delay: "4s",    dur: "10.5s", size: 13, color: "#e8b4c8" },
  { left: "8%",  delay: "5.2s",  dur: "9s",    size: 11, color: "#f5ccd8" },
  { left: "27%", delay: "4.5s",  dur: "11.5s", size: 9,  color: "#d4a0b8" },
  { left: "49%", delay: "6.3s",  dur: "8.5s",  size: 15, color: "#e8b4c8" },
  { left: "68%", delay: "5.7s",  dur: "10s",   size: 11, color: "#f5ccd8" },
  { left: "96%", delay: "4.9s",  dur: "9s",    size: 13, color: "#d4a0b8" },
];

function FallingPetals() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 50 }}>
      {PETALS.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: p.left, top: 0,
          width: p.size, height: p.size,
          borderRadius: "50% 10% 50% 10%",
          background: p.color,
          animation: `petal-fall ${p.dur} ${p.delay} infinite linear`,
        }} />
      ))}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function Home() {
  const whatsappNumber = "";
  const mapsUrl = "";
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "#";

  return (
    <div className="w-full overflow-x-hidden relative">
      <FallingPetals />

      {/* ═══════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════ */}
      <section className="relative w-full h-[100svh] lg:h-[1070px] overflow-hidden">
        <Image src="/images/bg-hero.jpg" alt="The Wedding of Gustavo & Patricia" fill className="object-cover" priority sizes="100vw" />

        {/* Desktop */}
        <C>
          <div className="absolute" style={{ left: 188, top: 510, width: 386, height: 80 }}>
            <Image src="/images/decor-flowers.png" alt="" fill className="object-contain" sizes="386px" priority />
          </div>
          <div className="absolute" style={{ left: 835, top: 535, width: 310, height: 30 }}>
            <Image src="/images/decor-text.png" alt="Gustavo & Patricia" fill className="object-contain" sizes="310px" priority />
          </div>
        </C>

        {/* Mobile */}
        <div className="lg:hidden absolute inset-0 flex flex-col items-center justify-end pb-16 gap-5">
          <div className="relative w-[75vw] max-w-[280px] h-[56px]">
            <Image src="/images/decor-flowers.png" alt="" fill className="object-contain" sizes="280px" priority />
          </div>
          <div className="relative w-[55vw] max-w-[200px] h-[20px]">
            <Image src="/images/decor-text.png" alt="Gustavo & Patricia" fill className="object-contain" sizes="200px" priority />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          INVITACIÓN
      ═══════════════════════════════════════════════════ */}
      <section className="relative w-full bg-white lg:h-[900px]">
        {/* Desktop */}
        <C>
          <div className="absolute z-10" style={{ left: 233, top: -258, width: 970, height: 1108 }}>
            <Image src="/images/invitation.png" alt="Invitación" fill className="object-contain" sizes="970px" />
          </div>
        </C>

        {/* Mobile */}
        <FadeIn className="lg:hidden flex justify-center py-10 px-8">
          <div className="relative w-full max-w-[360px]" style={{ aspectRatio: "970/1108" }}>
            <Image src="/images/invitation.png" alt="Invitación" fill className="object-contain" sizes="360px" />
          </div>
        </FadeIn>
      </section>

      {/* ═══════════════════════════════════════════════════
          CEREMONIA
      ═══════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden h-[540px] lg:h-[900px]">
        <Image src="/images/bg-venue.jpg" alt="Ceremonia" fill className="object-cover" sizes="100vw" />

        {/* Desktop */}
        <C>
          <div className="absolute" style={{ left: -147, top: 155, width: 568, height: 699 }}>
            <Image src="/images/img-couple-venue.jpg" alt="Nota personal" fill className="object-contain" sizes="568px" />
          </div>
        </C>

        {/* Mobile */}
        <div className="lg:hidden absolute inset-0 flex items-center justify-center px-8">
          <div className="relative w-full max-w-[280px]" style={{ aspectRatio: "568/699" }}>
            <Image src="/images/img-couple-venue.jpg" alt="Nota personal" fill className="object-contain" sizes="280px" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HACIENDA INFO + COUNTDOWN
      ═══════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden h-[760px] lg:h-[1147px]">
        <Image src="/images/bg-pink.jpg" alt="Hacienda Guáquira" fill className="object-cover" sizes="100vw" />

        {/* Desktop */}
        <C>
          <div className="absolute left-0 right-0 flex gap-8 justify-center" style={{ top: 615 }}>
            <a href={mapsUrl || "#"} target={mapsUrl ? "_blank" : undefined} rel="noopener noreferrer"
              className="btn-elegant font-bold text-3xl rounded-2xl shadow-lg" style={{ padding: "20px 48px" }}>
              Como llegar
            </a>
            <button className="btn-elegant font-bold text-3xl rounded-2xl shadow-lg" style={{ padding: "20px 48px" }}>
              Cronograma
            </button>
          </div>
          <div className="absolute left-0 right-0" style={{ top: 800 }}>
            <Countdown />
          </div>
        </C>

        {/* Mobile */}
        <div className="lg:hidden absolute inset-0 flex flex-col items-center justify-end pb-10 gap-6 px-8">
          <Countdown />
          <div className="flex flex-col gap-3 items-center w-full">
            <a href={mapsUrl || "#"} target={mapsUrl ? "_blank" : undefined} rel="noopener noreferrer"
              className="btn-elegant font-bold text-lg rounded-2xl shadow-lg w-full text-center" style={{ padding: "14px 32px" }}>
              Como llegar
            </a>
            <button className="btn-elegant font-bold text-lg rounded-2xl shadow-lg w-full" style={{ padding: "14px 32px" }}>
              Cronograma
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOSPEDAJE
      ═══════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden h-[760px] lg:h-[1094px]">
        <Image src="/images/bg-accommodation.jpg" alt="" fill className="object-cover" sizes="100vw" />

        {/* Desktop panel */}
        <div className="hidden lg:block absolute" style={{ left: 100, top: 207, width: 542, height: 813 }}>
          <Image src="/images/img-couple-2.jpg" alt="" fill className="object-cover" sizes="542px" />
        </div>
        <p className="hidden lg:block absolute text-[#8a415d] text-[35px] whitespace-nowrap z-10"
          style={{ fontFamily: "var(--font-montaga)", left: 213, top: 268 }}>
          ¿Dónde hospedarse?
        </p>
        <p className="hidden lg:block absolute text-[#8a415d] text-[25px] leading-[27px] text-center z-10"
          style={{ fontFamily: "var(--font-montaga)", left: 159, top: 318, width: 415 }}>
          Hemos seleccionado algunas dos opciones cercanas a la hacienda para que su descanso sea perfecto.
        </p>
        <div className="hidden lg:block absolute bg-[#d9d9d9] rounded-[20px] z-10"
          style={{ left: 126, top: 434, width: 489, height: 180 }} />
        <div className="hidden lg:flex absolute gap-4 z-10" style={{ left: 174, top: 639 }}>
          <a href={mapsUrl || "#"} target={mapsUrl ? "_blank" : undefined} rel="noopener noreferrer"
            className="btn-elegant font-bold text-xl rounded-2xl shadow-sm" style={{ padding: "14px 32px" }}>
            Como llegar
          </a>
          <a href={whatsappHref} target={whatsappNumber ? "_blank" : undefined} rel="noopener noreferrer"
            className="btn-elegant font-bold text-xl rounded-2xl shadow-sm" style={{ padding: "14px 32px" }}>
            Reservar
          </a>
        </div>
        <div className="hidden lg:block absolute bg-[#d9d9d9] rounded-[20px] z-10"
          style={{ left: 126, top: 727, width: 489, height: 180 }} />
        <div className="hidden lg:flex absolute gap-4 z-10" style={{ left: 174, top: 932 }}>
          <a href={mapsUrl || "#"} target={mapsUrl ? "_blank" : undefined} rel="noopener noreferrer"
            className="btn-elegant font-bold text-xl rounded-2xl shadow-sm" style={{ padding: "14px 32px" }}>
            Como llegar
          </a>
          <a href={whatsappHref} target={whatsappNumber ? "_blank" : undefined} rel="noopener noreferrer"
            className="btn-elegant font-bold text-xl rounded-2xl shadow-sm" style={{ padding: "14px 32px" }}>
            Reservar
          </a>
        </div>

        {/* Mobile */}
        <div className="lg:hidden absolute inset-0 flex flex-col items-center justify-center px-6 gap-4">
          <p style={{ fontFamily: "var(--font-montaga)" }} className="text-[#8a415d] text-[26px] text-center">
            ¿Dónde hospedarse?
          </p>
          <p style={{ fontFamily: "var(--font-montaga)" }} className="text-[#8a415d] text-[15px] leading-6 text-center max-w-[300px]">
            Hemos seleccionado algunas opciones cercanas a la hacienda para que su descanso sea perfecto.
          </p>
          <div className="bg-[#d9d9d9] rounded-[16px] w-full max-w-[340px] h-[130px]" />
          <div className="flex gap-3">
            <a href={mapsUrl || "#"} target={mapsUrl ? "_blank" : undefined} rel="noopener noreferrer"
              className="btn-elegant font-bold text-sm rounded-xl shadow-sm" style={{ padding: "10px 20px" }}>
              Como llegar
            </a>
            <a href={whatsappHref} target={whatsappNumber ? "_blank" : undefined} rel="noopener noreferrer"
              className="btn-elegant font-bold text-sm rounded-xl shadow-sm" style={{ padding: "10px 20px" }}>
              Reservar
            </a>
          </div>
          <div className="bg-[#d9d9d9] rounded-[16px] w-full max-w-[340px] h-[130px]" />
          <div className="flex gap-3">
            <a href={mapsUrl || "#"} target={mapsUrl ? "_blank" : undefined} rel="noopener noreferrer"
              className="btn-elegant font-bold text-sm rounded-xl shadow-sm" style={{ padding: "10px 20px" }}>
              Como llegar
            </a>
            <a href={whatsappHref} target={whatsappNumber ? "_blank" : undefined} rel="noopener noreferrer"
              className="btn-elegant font-bold text-sm rounded-xl shadow-sm" style={{ padding: "10px 20px" }}>
              Reservar
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          DRESS CODE
      ═══════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden h-[720px] lg:h-[1079px]">
        <Image src="/images/bg-notes.png" alt="" fill className="object-cover" sizes="100vw" />

        {/* Desktop */}
        <C>
          <div className="absolute" style={{ left: -232, top: 691, width: 395, height: 388 }}>
            <Image src="/images/img-flowers-left.png" alt="" fill className="object-contain" sizes="395px" />
          </div>
          <div className="absolute" style={{ left: 531, top: 297, width: 421, height: 95 }}>
            <Image src="/images/title-dress.png" alt="Dress Code" fill className="object-contain" sizes="421px" />
          </div>
          <p style={{ fontFamily: "var(--font-montaga)", left: 193, top: 459, width: 1053 }}
            className="absolute text-black text-[25px] text-center leading-[37px]">
            Elegante Campestre / Garden Formal Nos casamos en una hacienda al atardecer, por lo que te sugerimos un
            estilo fresco y sofisticado. Para ellas, vestidos midi o largos, lisos o con estampados florales. Para
            ellos, trajes en tonos claros, pasteles o azul marino (puedes prescindir de la corbata si lo prefieres).
            ¡Los colores vivos y alegres son más que bienvenidos!
          </p>
          <div className="absolute" style={{ left: 315, top: 664, width: 396, height: 314 }}>
            <Image src="/images/fashion-1.png" alt="Dress code ellas" fill className="object-contain" sizes="396px" />
          </div>
          <div className="absolute" style={{ left: 688, top: 664, width: 436, height: 314 }}>
            <Image src="/images/fashion-2.png" alt="Dress code ellos" fill className="object-contain" sizes="436px" />
          </div>
        </C>

        {/* Mobile */}
        <div className="lg:hidden absolute inset-0 flex flex-col items-center justify-center px-6 gap-5">
          <div className="relative w-[60vw] max-w-[220px] h-[50px]">
            <Image src="/images/title-dress.png" alt="Dress Code" fill className="object-contain" sizes="220px" />
          </div>
          <p style={{ fontFamily: "var(--font-montaga)" }} className="text-black text-[14px] text-center leading-[22px] max-w-[320px]">
            Elegante Campestre / Garden Formal. Nos casamos en una hacienda al atardecer. Para ellas, vestidos midi o largos,
            lisos o con estampados florales. Para ellos, trajes en tonos claros, pasteles o azul marino.
            ¡Los colores vivos son bienvenidos!
          </p>
          <div className="flex gap-4 items-end">
            <div className="relative w-[38vw] max-w-[140px]" style={{ aspectRatio: "396/314" }}>
              <Image src="/images/fashion-1.png" alt="Dress code ellas" fill className="object-contain" sizes="140px" />
            </div>
            <div className="relative w-[42vw] max-w-[155px]" style={{ aspectRatio: "436/314" }}>
              <Image src="/images/fashion-2.png" alt="Dress code ellos" fill className="object-contain" sizes="155px" />
            </div>
          </div>
        </div>
      </section>

      {/* Orquídea — desktop only, cruza Hospedaje y Dress Code */}
      <div className="hidden lg:flex absolute inset-x-0 justify-center pointer-events-none" style={{ top: 5011, zIndex: 20 }}>
        <div className="relative flex-shrink-0" style={{ width: 1440 }}>
          <div className="absolute flex items-center justify-center" style={{ left: 1344, top: 0, width: 519, height: 691 }}>
            <div style={{ transform: "rotate(-21.2deg)", width: 317, height: 618, position: "relative", flexShrink: 0 }}>
              <Image src="/images/img-couple-3.jpg" alt="" fill className="object-cover" sizes="317px" />
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          RSVP
      ═══════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden h-[860px] lg:h-[2160px]">
        <Image src="/images/bg-rsvp.jpg" alt="" fill className="object-cover" sizes="100vw" />

        {/* Desktop */}
        <C>
          <div className="absolute" style={{ left: 531, top: 333, width: 366, height: 365 }}>
            <Image src="/images/logo.png" alt="Logo G&P" fill className="object-contain" sizes="366px" />
          </div>
          <div className="absolute left-0 right-0 flex justify-center" style={{ top: 1274 }}>
            <div style={{ width: 306, height: 420, position: "relative" }}>
              <Image src="/images/couple-rsvp.png" alt="Gustavo & Patricia" fill className="object-contain" sizes="306px" />
            </div>
          </div>
          <p style={{ fontFamily: "var(--font-montaga)", top: 1694 }}
            className="absolute left-0 right-0 text-white text-[35px] text-center leading-[37px]">
            Tu presencia es nuestro mejor regalo
          </p>
          <div className="absolute left-0 right-0 flex justify-center" style={{ top: 1731 }}>
            <div style={{ width: 851, height: 95, position: "relative" }}>
              <Image src="/images/text-names.png" alt="¿Nos acompañas a celebrar?" fill className="object-contain" sizes="851px" />
            </div>
          </div>
          <div className="absolute left-0 right-0 flex justify-center" style={{ top: 1863 }}>
            <a href={whatsappHref} target={whatsappNumber ? "_blank" : undefined} rel="noopener noreferrer"
              className="btn-elegant font-bold text-3xl rounded-2xl shadow-lg" style={{ padding: "20px 48px" }}>
              Confirmar Asistencia
            </a>
          </div>
        </C>

        {/* Mobile */}
        <div className="lg:hidden absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 pt-8">
          <div className="relative w-[45vw] max-w-[160px]" style={{ aspectRatio: "366/365" }}>
            <Image src="/images/logo.png" alt="Logo G&P" fill className="object-contain" sizes="160px" />
          </div>
          <div className="relative w-[50vw] max-w-[180px]" style={{ aspectRatio: "306/420" }}>
            <Image src="/images/couple-rsvp.png" alt="Gustavo & Patricia" fill className="object-contain" sizes="180px" />
          </div>
          <p style={{ fontFamily: "var(--font-montaga)" }} className="text-white text-[20px] text-center leading-7">
            Tu presencia es nuestro mejor regalo
          </p>
          <div className="relative w-[80vw] max-w-[300px] h-[34px]">
            <Image src="/images/text-names.png" alt="¿Nos acompañas a celebrar?" fill className="object-contain" sizes="300px" />
          </div>
          <a href={whatsappHref} target={whatsappNumber ? "_blank" : undefined} rel="noopener noreferrer"
            className="btn-elegant font-bold text-base rounded-2xl shadow-lg" style={{ padding: "14px 36px" }}>
            Confirmar Asistencia
          </a>
        </div>
      </section>

    </div>
  );
}
