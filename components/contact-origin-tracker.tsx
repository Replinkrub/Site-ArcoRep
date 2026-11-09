"use client";

import { useEffect } from "react";
import { captureContactAttribution } from "@/lib/contact-attribution";

export function ContactOriginTracker() {
  useEffect(() => { captureContactAttribution(); }, []);
  return null;
}
