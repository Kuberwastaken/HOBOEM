"use client";

import { useEffect, useEffectEvent, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerImage {
    src: string;
    alt: string;
}

const AUTOPLAY_MS = 6500;

export function BannerCarousel({ banners }: { banners: BannerImage[] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const bannerCount = banners.length;

    const showBanner = (nextIndex: number) => {
        if (bannerCount === 0) {
            return;
        }

        setActiveIndex((nextIndex + bannerCount) % bannerCount);
    };

    const advanceBanner = useEffectEvent(() => {
        setActiveIndex((currentIndex) => (currentIndex + 1) % bannerCount);
    });

    useEffect(() => {
        if (bannerCount < 2) {
            return;
        }

        const intervalId = window.setInterval(() => {
            advanceBanner();
        }, AUTOPLAY_MS);

        return () => window.clearInterval(intervalId);
    }, [bannerCount]);

    if (bannerCount === 0) {
        return null;
    }

    const safeActiveIndex = activeIndex % bannerCount;
    const currentBanner = banners[safeActiveIndex];

    return (
        <section className="px-1.5 md:px-3 mt-1 md:mt-2">
            <div className="group relative overflow-hidden border border-black/10 bg-[#d8d3c7]">
                <div className="relative h-[300px] sm:h-[360px] md:h-[440px] lg:h-[500px] xl:h-[540px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentBanner.src}
                            initial={{ opacity: 0, scale: 1.03 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.985 }}
                            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={currentBanner.src}
                                alt={currentBanner.alt}
                                fill
                                priority={safeActiveIndex === 0}
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 96vw, 1900px"
                            />
                        </motion.div>
                    </AnimatePresence>

                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/18 via-black/6 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/58 via-black/18 to-transparent" />

                    <div className="absolute left-4 top-4 md:left-6 md:top-6 z-10">
                        <div className="inline-flex max-w-[calc(100vw-2rem)] items-center gap-2 overflow-hidden border border-white/20 bg-black/20 px-2.5 py-2 text-[8px] uppercase tracking-[0.3em] text-white/90 backdrop-blur-sm md:max-w-none md:gap-3 md:px-3 md:text-[10px]">
                            <span>HOBOEM</span>
                            <span className="text-white/45">/</span>
                            <span className="truncate">{currentBanner.alt}</span>
                        </div>
                    </div>

                    {bannerCount > 1 && (
                        <>
                            <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-3 md:pl-5">
                                <button
                                    type="button"
                                    onClick={() => showBanner(safeActiveIndex - 1)}
                                    aria-label="Show previous banner"
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/22 bg-black/18 text-white/90 backdrop-blur-sm transition hover:bg-black/28 md:h-11 md:w-11"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5 md:h-4 md:w-4" strokeWidth={1.75} />
                                </button>
                            </div>

                            <div className="absolute inset-y-0 right-0 z-10 flex items-center pr-3 md:pr-5">
                                <button
                                    type="button"
                                    onClick={() => showBanner(safeActiveIndex + 1)}
                                    aria-label="Show next banner"
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/22 bg-black/18 text-white/90 backdrop-blur-sm transition hover:bg-black/28 md:h-11 md:w-11"
                                >
                                    <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" strokeWidth={1.75} />
                                </button>
                            </div>
                        </>
                    )}

                    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5 md:bottom-6 md:gap-3">
                        {bannerCount > 1 && (
                            <div className="h-[2px] w-24 overflow-hidden rounded-full bg-white/25 md:w-36">
                                <motion.div
                                    key={currentBanner.src}
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                                    className="h-full bg-white/90"
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            {banners.map((banner, index) => (
                                <button
                                    key={banner.src}
                                    type="button"
                                    onClick={() => showBanner(index)}
                                    aria-label={`Show banner ${index + 1}`}
                                    className={`transition-all ${index === safeActiveIndex
                                        ? "h-1.5 w-6 rounded-full bg-white md:w-7"
                                        : "h-1.5 w-1.5 rounded-full bg-white/45 hover:bg-white/75"
                                        }`}
                                />
                            ))}
                        </div>

                        <div className="text-[9px] uppercase tracking-[0.32em] text-white/78 md:text-[10px]">
                            {String(safeActiveIndex + 1).padStart(2, "0")} / {String(bannerCount).padStart(2, "0")}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
