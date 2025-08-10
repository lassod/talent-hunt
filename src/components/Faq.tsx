"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "./Reveal";

const left = [
  {
    q: "WHO CAN PARTICIPATE?",
    a: "Singers, Dancers, Spoken word artists, Poets, Comedians.",
  },
  {
    q: "WHAT KIND OF VIDEOS?",
    a: "Not more than 60 seconds. We value originality.",
  },
  {
    q: "HOW ARE FINALISTS SELECTED?",
    a: "Phase 1: Social engagement. Phase 2: Weekly voting.",
  },
];

const right = [
  {
    q: "WHEN CAN I SUBMIT MY ENTRY?",
    a: "Now!",
  },
  {
    q: "WHAT ARE THE PRIZES?",
    a: "₦2,000,000 grand prize.",
  },
  {
    q: "WHERE IS THE GRAND FINALE?",
    a: "Charis Hotel Garden Space, Ilorin, Nigeria.",
  },
];

export function FAQ() {
  return (
    <div className="mt-8 sm:py-10 sm:px-4 md:px-6 grid gap-8 md:grid-cols-2">
      <FAQColumn items={left} prefix="l" />
      <FAQColumn items={right} prefix="r" />
    </div>
  );
}

function FAQColumn({
  items,
  prefix,
}: {
  items: { q: string; a: string }[];
  prefix: string;
}) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((it, i) => (
        <Reveal key={i}>
          <AccordionItem
            value={`${prefix}-${i}`}
            className="border-b mb-6 border-white/10"
          >
            <AccordionTrigger className="text-left text-gray-200 font-semibold tracking-tight hover:no-underline">
              {it.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-gray-300">
              {it.a}
            </AccordionContent>
          </AccordionItem>
        </Reveal>
      ))}
    </Accordion>
  );
}
