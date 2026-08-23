import { eyebrowClass } from "@/components/tones";

export default function SectionHeading({ eyebrow, title, sub }) {
  return (
    <div className="mb-8">
      <p className={eyebrowClass}>{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
        {title}
      </h2>
      {sub && <p className="mt-2 text-base text-mist max-w-2xl">{sub}</p>}
    </div>
  );
}
