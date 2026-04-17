"use client";

import { Carousel } from "@/components/ui";
import type { CarouselSlide } from "@/components/ui";

const slides: CarouselSlide[] = [
  { src: "/images/banner1.png", alt: "Motoboy na rua à noite – velocidade e foco" },
  { src: "/images/banner2.png", alt: "Comunidade de motoboys – união e respeito" },
  { src: "/images/banner3.png", alt: "Equipamentos do motoboy – profissionalismo" },
];

export function CarouselWrapper() {
  return <Carousel slides={slides} autoPlay interval={5000} />;
}
