import Link from "next/link";

export function Logo({
  className = "",
  size = "default",
  href = "/",
}: {
  className?: string;
  size?: "sm" | "default" | "lg";
  href?: string;
}) {
  const sizes = {
    sm: { icon: 32, textAr: "text-lg", textEn: "text-[10px]" },
    default: { icon: 44, textAr: "text-2xl", textEn: "text-xs" },
    lg: { icon: 56, textAr: "text-3xl", textEn: "text-sm" },
  };
  const s = sizes[size];

  return (
    <Link href={href} className={`flex items-center gap-3 ${className}`}>
      <div
        className="flex items-center justify-center text-brand"
        style={{ width: s.icon, height: s.icon }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer S shape */}
          <path
            d="M26 12L20 8.5L14 12V18L26 23V29L20 32.5L14 29"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner fold line to give 3D effect */}
          <path
            d="M14 12L20 15.5L26 12"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-col items-start justify-center leading-none">
        <span
          className={`font-bold ${s.textAr} text-foreground tracking-tight`}
          style={{ marginBottom: "2px" }}
        >
          سرار
        </span>
        <span
          className={`font-bold ${s.textEn} text-foreground tracking-[0.2em]`}
        >
          SIRAR
        </span>
      </div>
    </Link>
  );
}
