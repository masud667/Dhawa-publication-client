import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Link } from 'react-router';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import { motion } from 'framer-motion';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { BookCard } from './BookCard';
import { BookCardSkeleton } from './BookCardSkeleton';

export const RecentBooks = ({
  books = [],
  isLoading = false,
}) => {
  const hasBooks =
    Array.isArray(books) &&
    books.length > 0;

  // Keep autoplay stable
  const autoplay = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  // Embla functionality unchanged
  const [emblaRef, emblaApi] =
    useEmblaCarousel(
      {
        loop:
          hasBooks &&
          books.length > 5,

        align: 'start',

        slidesToScroll: 1,

        containScroll:
          'trimSnaps',
      },

      hasBooks
        ? [autoplay.current]
        : []
    );

  const [
    selectedIndex,
    setSelectedIndex,
  ] = useState(0);

  const [
    scrollSnaps,
    setScrollSnaps,
  ] = useState([]);

  const onSelect =
    useCallback(() => {
      if (!emblaApi) return;

      setSelectedIndex(
        emblaApi.selectedScrollSnap()
      );
    }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const updateCarousel =
      () => {
        setScrollSnaps(
          emblaApi.scrollSnapList()
        );

        onSelect();
      };

    updateCarousel();

    emblaApi.on(
      'select',
      onSelect
    );

    emblaApi.on(
      'reInit',
      updateCarousel
    );

    return () => {
      emblaApi.off(
        'select',
        onSelect
      );

      emblaApi.off(
        'reInit',
        updateCarousel
      );
    };
  }, [
    emblaApi,
    onSelect,
  ]);

  const scrollPrev =
    useCallback(() => {
      emblaApi?.scrollPrev();
    }, [emblaApi]);

  const scrollNext =
    useCallback(() => {
      emblaApi?.scrollNext();
    }, [emblaApi]);

  // Empty state unchanged
  if (
    !isLoading &&
    !hasBooks
  ) {
    return (
      <section className="bg-[#f7f4ee] py-16">
        <div className="container mx-auto px-4 text-center">

          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <span className="text-3xl">
              📚
            </span>
          </div>

          <h3 className="text-xl font-bold text-[#263d35]">
            কোনো বই পাওয়া যায়নি
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            নতুন বইয়ের জন্য
            পরে আবার দেখুন।
          </p>

        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#f7f4ee] py-12 md:py-16">

      <div className="container relative mx-auto max-w-[1200px] px-4">

        {/* =================================
            Reference Style Heading
        ================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.5,
          }}

          viewport={{
            once: true,
          }}

          className="mb-8 md:mb-10"
        >

          <div className="flex items-center justify-center gap-4">

            {/* Left line */}

            <span className="h-px flex-1 bg-[#d9d3c8]" />

            {/* Title */}

            <h2 className="whitespace-nowrap font-serif text-[25px] font-bold text-[#174d3b] sm:text-[28px] md:text-[32px]">

              সদ্য প্রকাশিত বই

            </h2>

            {/* Right line */}

            <span className="h-px flex-1 bg-[#d9d3c8]" />

          </div>

          {/* Small title underline */}

          <div className="mx-auto mt-2 h-[2px] w-24 bg-[#174d3b]" />

        </motion.div>


        {/* =================================
            Book Carousel
        ================================= */}

        <div className="relative px-5 sm:px-7 md:px-9">

          {/* Embla viewport */}

          <div
            ref={emblaRef}
            className="overflow-hidden"
          >

            <div className="-ml-4 flex">

              {isLoading

                ? Array
                    .from({
                      length: 5,
                    })
                    .map(
                      (
                        _,
                        index
                      ) => (

                        <div
                          key={
                            index
                          }

                          className="
                            min-w-0
                            flex-[0_0_50%]
                            pl-4

                            sm:flex-[0_0_33.333%]

                            lg:flex-[0_0_25%]

                            xl:flex-[0_0_20%]
                          "
                        >

                          <BookCardSkeleton />

                        </div>

                      )
                    )

                : books.map(
                    (
                      book,
                      index
                    ) => (

                      <div
                        key={
                          book._id ||
                          book.id ||
                          index
                        }

                        className="
                          min-w-0
                          flex-[0_0_50%]
                          pl-4

                          sm:flex-[0_0_33.333%]

                          lg:flex-[0_0_25%]

                          xl:flex-[0_0_20%]
                        "
                      >

                        <BookCard
                          book={
                            book
                          }
                        />

                      </div>

                    )
                  )}

            </div>

          </div>


          {/* =================================
              Left Arrow
          ================================= */}

          {hasBooks &&
            books.length >
              1 && (

            <button
              type="button"

              onClick={
                scrollPrev
              }

              className="
                absolute

                left-0

                top-[42%]

                z-20

                flex

                h-10

                w-10

                -translate-x-1/2

                -translate-y-1/2

                items-center

                justify-center

                rounded-full

                bg-transparent

                text-[#374151]

                transition

                duration-300

                hover:bg-white

                hover:shadow-md

                focus:outline-none

                md:h-11

                md:w-11
              "

              aria-label="
                Previous books
              "
            >

              <ChevronLeft
                className="
                  h-7
                  w-7
                  stroke-[1.3]
                "
              />

            </button>

          )}


          {/* =================================
              Right Arrow
          ================================= */}

          {hasBooks &&
            books.length >
              1 && (

            <button
              type="button"

              onClick={
                scrollNext
              }

              className="
                absolute

                right-0

                top-[42%]

                z-20

                flex

                h-10

                w-10

                translate-x-1/2

                -translate-y-1/2

                items-center

                justify-center

                rounded-full

                bg-transparent

                text-[#374151]

                transition

                duration-300

                hover:bg-white

                hover:shadow-md

                focus:outline-none

                md:h-11

                md:w-11
              "

              aria-label="
                Next books
              "
            >

              <ChevronRight
                className="
                  h-7
                  w-7
                  stroke-[1.3]
                "
              />

            </button>

          )}

        </div>


        {/* =================================
            All Books Button
        ================================= */}

        <motion.div

          initial={{
            opacity: 0,
            y: 10,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: 0.15,
          }}

          viewport={{
            once: true,
          }}

          className="
            mt-8
            text-center
            md:mt-10
          "
        >

          <Link

            to="/books"

            className="
              group

              inline-flex

              min-w-[120px]

              items-center

              justify-center

              gap-2

              border

              border-[#2d6a55]

              bg-transparent

              px-6

              py-2.5

              text-sm

              font-semibold

              text-[#215b47]

              transition-all

              duration-300

              hover:bg-[#215b47]

              hover:text-white

              hover:shadow-md
            "
          >

            সকল বই

            <ChevronRight
              className="
                h-4
                w-4

                transition-transform

                duration-300

                group-hover:translate-x-1
              "
            />

          </Link>

        </motion.div>

      </div>

    </section>
  );
};