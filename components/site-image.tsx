"use client";

import { getImageProps, type ImageProps } from "next/image";
import { createElement, type ComponentProps } from "react";

type SiteImageProps = Omit<ComponentProps<"img">, "src" | "alt" | "width" | "height"> & {
  src: string;
  alt: string;
  width?: ImageProps["width"];
  height?: ImageProps["height"];
};

/** Variants are generated at build time; keep their srcSet and existing CSS crops. */
export default function SiteImage({ srcSet, sizes, loading = "eager", ...props }: SiteImageProps) {
  const { props: imageProps } = getImageProps({ ...props, loading, unoptimized: true });
  // Vinext's Image drops sizes when unoptimized. Its props API lets us retain
  // both responsive attributes without adding a wrapper or changing the layout.
  return createElement("img", { ...imageProps, srcSet, sizes });
}
