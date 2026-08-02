import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    title: "জ্ঞান হোক জীবনের আলো",
    description:
      "Discover inspiring books that enrich your knowledge and strengthen your journey.",
    image: "/banner-1.jpg",
  },
  {
    id: 2,
    title: "ইসলামিক বইয়ের সমৃদ্ধ সংগ্রহ",
    description:
      "Explore authentic books from Dhawa Publication and build your personal library.",
    image: "/banner-2.png",
  },
  {
    id: 3,
    title: "নতুন বইয়ের নতুন গল্প",
    description:
      "Find carefully selected books for readers of every generation.",
    image: "/banner/banner-3.jpg",
  },
];

function Banner() {
  const autoplay = Autoplay({
    delay: 3000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 35,
    },
    [autoplay]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);


  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);


  return (
    <section className="relative overflow-hidden">

      {/* Carousel */}
      <div ref={emblaRef} className="overflow-hidden">

        <div className="flex">

          {banners.map((banner) => (

            <div
              key={banner.id}
              className="relative min-w-full h-[320px] md:h-[420px]"
            >

              {/* Background Image */}
              <img
                src={banner.image}
                alt={banner.title}
                className="
                  absolute 
                  inset-0 
                  h-full 
                  w-full 
                  object-cover
                "
              />


              {/* Overlay */}
              <div
                className="
                absolute 
                inset-0
                bg-gradient-to-r
                from-black/70
                via-black/40
                to-transparent
                "
              />


              {/* Content */}
              <div className="
                relative 
                z-10 
                mx-auto 
                flex 
                h-full 
                max-w-7xl 
                items-center 
                px-6
                "
              >

                <div className="max-w-xl text-white">


                  <span
                    className="
                    inline-block
                    rounded-full
                    bg-white/20
                    px-4
                    py-2
                    text-sm
                    backdrop-blur-md
                    "
                  >
                    Dhawa Publication
                  </span>


                  <h1
                    className="
                    mt-5
                    text-3xl
                    font-bold
                    leading-tight
                    md:text-5xl
                    "
                  >
                    {banner.title}
                  </h1>


                  <p
                    className="
                    mt-4
                    text-sm
                    text-white/90
                    md:text-lg
                    "
                  >
                    {banner.description}
                  </p>


                  <div className="mt-6 flex gap-4">

                    <button
                      className="
                      rounded-lg
                      bg-emerald-600
                      px-6
                      py-3
                      font-semibold
                      transition
                      hover:bg-emerald-700
                      "
                    >
                      Browse Books
                    </button>


                    <button
                      className="
                      rounded-lg
                      border
                      border-white/50
                      bg-white/10
                      px-6
                      py-3
                      font-semibold
                      backdrop-blur
                      transition
                      hover:bg-white
                      hover:text-black
                      "
                    >
                      Learn More
                    </button>

                  </div>


                </div>

              </div>

            </div>

          ))}

        </div>

      </div>


      {/* Previous Button */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="
        absolute
        left-5
        top-1/2
        -translate-y-1/2
        rounded-full
        bg-white/80
        p-2
        shadow-lg
        backdrop-blur
        "
      >
        <ChevronLeft size={22}/>
      </button>


      {/* Next Button */}
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="
        absolute
        right-5
        top-1/2
        -translate-y-1/2
        rounded-full
        bg-white/80
        p-2
        shadow-lg
        backdrop-blur
        "
      >
        <ChevronRight size={22}/>
      </button>


      {/* Dots */}
      <div
        className="
        absolute
        bottom-5
        left-1/2
        flex
        -translate-x-1/2
        gap-2
        "
      >

        {banners.map((_, index)=>(

          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`
              h-2
              rounded-full
              transition-all
              ${
                selectedIndex === index
                ? "w-8 bg-white"
                : "w-2 bg-white/50"
              }
            `}
          />

        ))}

      </div>


    </section>
  );
}

export default Banner;