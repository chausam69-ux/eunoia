import Link from "next/link";
import { PillLink } from "./Pill";

type Props = { email: string; githubUrl: string; linkedinUrl: string };

export function Footer({ email, githubUrl, linkedinUrl }: Props) {
  const year = new Date().getFullYear();
  return (
    <footer className="snap theme-dark wrap section-sm relative overflow-hidden border-t border-line">
      <div aria-hidden="true" className="aurora aurora-soft" />
      <div className="inner relative">
        <div className="footer-cta">
          <p className="t-meta mb-6 text-gray">{"////// "}NEXT STEP</p>
          <h2 className="t-display mb-10 max-w-4xl text-[clamp(2rem,7vw,6rem)]">
            HAVE A PROBLEM?
            <br />
            LET&apos;S BUILD THE SYSTEM.
          </h2>
          <PillLink href="/start">START A PROJECT</PillLink>
        </div>

        <div className="footer-links mt-[clamp(4rem,8vw,7rem)] grid gap-10 border-t border-line pt-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="t-display text-2xl">EUNΟIA</p>
            <p className="t-meta mt-2 text-gray">DIGITAL SYSTEMS STUDIO</p>
            <p className="mt-4 max-w-sm text-sm text-gray">
              EUNΟIA is an independent digital practice by Sandip Chaudhary. Today: data analysis and SEO. Next: web, automation, AI. One person, one ladder.
            </p>
          </div>
          <nav aria-label="Footer" className="t-meta-lg flex flex-col gap-3 md:col-span-3">
            {[
              ["WORK", "/work"],
              ["LAB", "/lab"],
              ["CAPABILITIES", "/capabilities"],
              ["ABOUT", "/about"],
            ].map(([l, h]) => (
              <Link key={h} href={h} className="w-fit hover:text-accent">
                {l}
              </Link>
            ))}
          </nav>
          <div className="t-meta-lg flex flex-col gap-3 md:col-span-4">
            <a href={githubUrl} target="_blank" rel="noreferrer" className="w-fit hover:text-accent">
              [GH] GITHUB <span aria-hidden="true">↗</span>
            </a>
            <a href={linkedinUrl} target="_blank" rel="noreferrer" className="w-fit hover:text-accent">
              [LI] LINKEDIN <span aria-hidden="true">↗</span>
            </a>
            <a href={`mailto:${email}`} className="w-fit hover:text-accent">
              [MAIL] {email.toUpperCase()} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="t-meta mt-16 flex flex-wrap justify-between gap-2 text-gray">
          <span>© {year} EUNΟIA · SANDIP CHAUDHARY</span>
          <span>INDIA → WORLDWIDE</span>
        </div>
      </div>
    </footer>
  );
}
