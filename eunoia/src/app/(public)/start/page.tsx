import type { Metadata } from "next";
import { StartForm } from "@/components/public/StartForm";
import { RevealLines } from "@/components/public/Reveal";

export const metadata: Metadata = { title: "Start a project" };

export default function StartPage() {
  return (
    <section className="no-footer-cta wrap pb-[clamp(5rem,12vw,11rem)] pt-[clamp(7rem,14vw,12rem)]">
      <div className="inner">
        <p className="t-meta mb-6 text-gray">{"////// "}START A PROJECT</p>
        <h1 className="t-display mb-6 text-[clamp(2.5rem,8vw,7rem)]">
          <RevealLines lines={["TELL ME THE PROBLEM.", "NOT THE TOOL."]} />
        </h1>
        <p className="mb-16 max-w-xl text-lg text-gray">
          Five short steps. No account, no sales call booked behind your back. Just enough to reply properly.
        </p>
        <StartForm />
      </div>
    </section>
  );
}
