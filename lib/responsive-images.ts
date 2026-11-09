import { responsiveImageSources } from "./responsive-images-data";

/** Selection hints only: preserve src, CSS, full-frame proportions and fallback. */
export function responsiveImage(src: string, sizes: string) {
  const srcSet = responsiveImageSources[src];
  return srcSet ? { srcSet, sizes } : {};
}
