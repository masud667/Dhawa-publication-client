import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { BookCard } from './BookCard';
import { BookCardSkeleton } from './BookCardSkeleton';

export const RecentBooks = ({ books = [], isLoading = false }) => {
  const hasBooks = Array.isArray(books) && books.length > 0;

  // ─── Embla Carousel ──────────────────────────────────────
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: hasBooks,
      align: 'start',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 640px)': { slidesToShow: 2 },
        '(min-width: 768px)': { slidesToShow: 3 },
        '(min-width: 1024px)': { slidesToShow: 4 },
        '(min-width: 1280px)': { slidesToShow: 5 },
      },
    },
    hasBooks ? [Autoplay({ delay: 4000, stopOnInteraction: true })] : []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // ─── Empty State ──────────────────────────────────────────
  if (!isLoading && !hasBooks) {
    return (
      <section className="relative overflow-hidden bg-[#FAF9F5] py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block rounded-full bg-amber-100 p-4 mb-4">
            <span className="text-4xl">📚</span>
          </div>
          <h3 className="font-serif text-2xl text-gray-700">No books available</h3>
          <p className="text-gray-400 mt-2">Check back later for new arrivals.</p>
        </div>
      </section>
    );
  }

  // ─── Render ──────────────────────────────────────────────
  return (
    <section className="relative overflow-hidden bg-[#FAF9F5] py-20 md:py-28">
      {/* ─── Premium Background Decor ────────────────────── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Soft radial glow */}
        <div className="absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-amber-50/40 blur-3xl" />
        
        {/* Islamic geometric pattern (very subtle) */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="geoP" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L60 30 L30 60 L0 30 Z" stroke="#B8860B" strokeWidth="0.5" fill="none" />
              <circle cx="30" cy="30" r="4" fill="#B8860B" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geoP)" />
        </svg>

        {/* Corner flourishes */}
        <div className="absolute top-0 right-0 h-32 w-32 border-r-2 border-t-2 border-amber-200/30 rounded-tr-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 border-l-2 border-b-2 border-amber-200/30 rounded-bl-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* ─── Section Heading ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300" />
            <span className="text-xs font-serif tracking-[0.2em] text-amber-600 uppercase">
              Latest Collection
            </span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300" />
          </div>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-800">
            Recent <span className="relative text-emerald-800">
              Books
              <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-amber-400/60" />
            </span>
          </h2>

          <div className="mt-4 flex items-center justify-center gap-1">
            <span className="h-0.5 w-6 rounded-full bg-amber-300" />
            <span className="h-0.5 w-3 rounded-full bg-amber-400" />
            <span className="h-0.5 w-6 rounded-full bg-amber-300" />
          </div>
        </motion.div>

        {/* ─── Carousel ────────────────────────────────────── */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-5">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="min-w-0 flex-[0_0_calc(50%-10px)] sm:flex-[0_0_calc(33.333%-14px)] md:flex-[0_0_calc(25%-15px)] lg:flex-[0_0_calc(20%-16px)]"
                    >
                      <BookCardSkeleton />
                    </div>
                  ))
                : books.map((book, index) => (
                    <div
                      key={book._id || book.id || index}
                      className="min-w-0 flex-[0_0_calc(50%-10px)] sm:flex-[0_0_calc(33.333%-14px)] md:flex-[0_0_calc(25%-15px)] lg:flex-[0_0_calc(20%-16px)]"
                    >
                      <BookCard book={book} />
                    </div>
                  ))}
            </div>
          </div>

          {/* ─── Navigation Arrows (Gold Glass) ────────────── */}
          {hasBooks && (
            <>
              <button
                type="button"
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 p-3 shadow-xl backdrop-blur-md border border-amber-200/30 transition hover:scale-110 hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5 text-amber-700" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                className="absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 p-3 shadow-xl backdrop-blur-md border border-amber-200/30 transition hover:scale-110 hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5 text-amber-700" />
              </button>
            </>
          )}
        </div>

        {/* ─── Pagination ──────────────────────────────────── */}
        {hasBooks && (
          <div className="mt-8 flex justify-center gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                className={`transition-all duration-500 rounded-full ${
                  index === selectedIndex
                    ? 'w-10 h-2 bg-gradient-to-r from-amber-500 to-emerald-600 shadow-md'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* ─── View All Button ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            to="/books"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-amber-600/40 bg-white/60 px-9 py-3.5 font-serif font-medium text-amber-800 shadow-sm backdrop-blur-sm transition-all hover:border-amber-600 hover:bg-gradient-to-r hover:from-amber-600 hover:to-emerald-700 hover:text-white hover:shadow-xl"
          >
            View All Books
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};