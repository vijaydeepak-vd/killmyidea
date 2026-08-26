import { ExternalLink } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { TONE } from "@/components/tones";

export default function BrutalReality({ findings }) {
  return (
    <div data-testid="brutal-reality">
      <SectionHeading
        eyebrow="No sugarcoating"
        title="The Brutal Reality"
        sub="Here is why this idea may fail."
      />
      <div className="divide-y divide-line rounded-xl border border-line bg-surface">
        {findings.map((f, i) => (
          <div key={i} className="flex gap-4 p-5 sm:p-6" data-testid={`brutal-finding-${i}`}>
            <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${TONE[f.tone].dot}`} />
            <div>
              <h3 className="font-display text-base font-semibold text-body sm:text-lg">
                {f.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-mist">{f.body}</p>
              {f.sourceUrl && (
                <a
                  href={f.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`brutal-evidence-link-${i}`}
                  className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-info transition-colors duration-200 hover:underline"
                >
                  Evidence-backed
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
