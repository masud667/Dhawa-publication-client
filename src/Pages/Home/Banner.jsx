import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, Tag } from "lucide-react";

const banners = [
  // ─── SLIDE 1: Full Background Cover Image ─────────────────────────
  {
    id: 1,
    type: "hero",
    tag: "স্বাগতম",
    title: "দাওয়া পাবলিকেশন",
    subtitle: "সুন্দর আগামীর জন্য",
    description: "জ্ঞান চর্চা ও আত্মশুদ্ধির পথ সুগম করতে নির্ভরযোগ্য ইসলামী সাহিত্য।",
    bgImage: "/banner-1.jpg",
    ctaText: "বইসমূহ দেখুন",
    ctaLink: "/books",
  },
  // ─── SLIDE 2: Professional Book Spotlight Showcase ─────────────────
  {
    id: 2,
    type: "preorder",
    tag: "আমাদের প্রকাশিত নতুন বইয়ের প্রি-অর্ডার চলছে",
    offerTag: "৫৫% ছাড় ও বই উপহার",
    title: "আত তাবসিরাহ",
    author: "ইমাম ইবনুল জাওযী রহ.",
    description: "আত্মশুদ্ধি ও হৃদয়ের অনুভূতি জাগিয়ে তোলার এক অনন্য সৃষ্টি। সীমিত সময়ের জন্য বিশেষ অফারে সংগ্রাহকদের জন্য উন্মুক্ত!",
    bookCover: "/at-tabsirah.jpeg",
    ctaText: "এখনই প্রি-অর্ডার করুন",
    ctaLink: "/books/6ab7424f5a88664d7bc823eb",
  },
];

function Banner() {
  // Autoplay Plugin Setup
  // Change delay from 4000 to 3000 (3 seconds)
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 25 },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white select-none">
      {/* Carousel Viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative min-w-full min-h-[400px] md:min-h-[450px] flex items-center overflow-hidden"
            >
              {/* ─────────────────────────────────────────────────────────────
                  SLIDE 1: Full Background Image
              ───────────────────────────────────────────────────────────── */}
              {banner.type === "hero" && (
                <>
                  <img
                    src={banner.bgImage}
                    alt={banner.title}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-black/60 to-transparent" />

                  <div className="relative z-10 mx-auto max-w-7xl w-full px-6 py-10 md:py-16">
                    <div className="max-w-xl text-white space-y-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 px-4 py-1.5 text-xs md:text-sm font-medium backdrop-blur-md">
                        <Sparkles size={14} className="text-amber-300" />
                        {banner.tag}
                      </span>

                      <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
                        {banner.title}
                      </h1>

                      <p className="text-xl md:text-2xl font-bold text-amber-300">
                        {banner.subtitle}
                      </p>

                      <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                        {banner.description}
                      </p>

                      <div className="pt-2">
                        <Link
                          to={banner.ctaLink}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 font-semibold text-sm md:text-base transition-all shadow-lg hover:shadow-emerald-900/50"
                        >
                          <BookOpen size={18} />
                          {banner.ctaText}
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  SLIDE 2: Professional Book Showcase Background
              ───────────────────────────────────────────────────────────── */}
              {banner.type === "preorder" && (
                <div className="relative w-full h-full bg-[#061811] py-8 md:py-14 overflow-hidden flex items-center">

                  {/* Professional Background Graphics Layer */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  {/* Glowing Spotlight Behind Book Cover */}
                  <div className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
                  <div className="absolute right-10 top-10 w-72 h-72 bg-amber-500/15 rounded-full blur-[90px] pointer-events-none" />

                  <div className="relative z-10 mx-auto max-w-7xl w-full px-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

                      {/* LEFT: Professional Book Display with Glassmorphic Pedestal */}
                      <div className="md:col-span-5 flex justify-center items-center">
                        <div className="relative group">

                          {/* Radial Glow Frame */}
                          <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500/40 via-emerald-500/40 to-transparent rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />

                          {/* Book Container with Subtle Reflection */}
                          <div className="relative rounded-2xl  p-4 border border-white/10 shadow-2xl backdrop-blur-md">
                            <img
                              src={banner.bookCover}
                              alt={banner.title}
                              className=" w-auto object-contain rounded-lg transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]"
                            />

                            {/* Offer Badge Overlay */}
                            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs md:text-sm px-3.5 py-1.5 rounded-full shadow-xl border border-amber-300 flex items-center gap-1">
                              <Tag size={14} />
                              {banner.offerTag}
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* RIGHT: High-Converting Text */}
                      <div className="md:col-span-7 space-y-4 text-left">

                        {/* Live Tag */}
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3.5 py-1 text-xs md:text-sm font-semibold text-emerald-300 backdrop-blur-md">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          {banner.tag}
                        </div>

                        {/* Title & Author */}
                        <div>
                          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                            {banner.title}
                          </h1>
                          <p className="mt-1 text-lg md:text-xl font-semibold text-amber-300">
                            {banner.author}
                          </p>
                        </div>

                        {/* Description */}
                        <p className="text-sm md:text-base text-gray-300 max-w-xl leading-relaxed">
                          {banner.description}
                        </p>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <span className="bg-slate-900/80 border border-emerald-800/60 text-xs px-3.5 py-1.5 rounded-md text-amber-300 font-semibold shadow-inner">
                            🔥 ৫৫% প্রি-অর্ডার ডিসকাউন্ট
                          </span>
                          <span className="bg-slate-900/80 border border-emerald-800/60 text-xs px-3.5 py-1.5 rounded-md text-emerald-300 font-semibold shadow-inner">
                            🎁 ফ্রি বিশেষ উপহার
                          </span>
                        </div>

                        {/* CTA Link Button */}
                        <div className="pt-3">
                          <Link
                            to={banner.ctaLink}
                            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-sm md:text-base px-8 py-3.5 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5"
                          >
                            {banner.ctaText}
                          </Link>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Manual Controls */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-slate-950/60 hover:bg-slate-900 text-white p-2.5 backdrop-blur-md border border-white/10 transition"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-slate-950/60 hover:bg-slate-900 text-white p-2.5 backdrop-blur-md border border-white/10 transition"
        aria-label="Next Slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2.5 rounded-full transition-all ${selectedIndex === index
              ? "w-8 bg-amber-400"
              : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
          />
        ))}
      </div>
    </section>
  );
}

export default Banner;