"use client";

import { useEffect, useRef } from "react";
import Star from "@/components/assets/images/star.png";
import Image from "next/image";

const items = [
  "SINGING",
  "DANCING",
  "SPOKEN WORDS",
  "POETRY",
  "COMEDY",
  "SINGING",
  "DANCING",
  "SPOKEN WORDS",
  "POETRY",
  "COMEDY",
  "SINGING",
  "DANCING",
  "SPOKEN WORDS",
  "POETRY",
  "COMEDY",
  "SINGING",
  "DANCING",
  "SPOKEN WORDS",
  "POETRY",
  "COMEDY",
  "SINGING",
  "DANCING",
  "SPOKEN WORDS",
  "POETRY",
  "COMEDY",
  "SINGING",
  "DANCING",
  "SPOKEN WORDS",
  "POETRY",
  "COMEDY",
  "SINGING",
  "DANCING",
  "SPOKEN WORDS",
  "POETRY",
  "COMEDY",
  "SINGING",
  "DANCING",
  "SPOKEN WORDS",
  "POETRY",
  "COMEDY",
];

export function MarqueeStrip() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const anim = el.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
      { duration: 14000, iterations: Infinity, easing: "linear" }
    );
    return () => anim.cancel();
  }, []);

  return (
    <div className="relative overflow-hidden bg-black py-4 text-xs text-green-400">
      <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]" />
      <div ref={ref} className="flex whitespace-nowrap">
        {[...Array(2)].map((_, loop) => (
          <div key={loop} className="flex items-center">
            {items.map((item, i) => (
              <div key={`${loop}-${i}`} className="flex items-center px-3">
                <Image
                  alt="Star"
                  src={Star}
                  className=""
                  width={30}
                  height={30}
                />
                <span className="tracking-widest">{item}</span>
                <span
                  className="mx-1 inline-block h-1 w-1 rounded-full bg-green-500"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
