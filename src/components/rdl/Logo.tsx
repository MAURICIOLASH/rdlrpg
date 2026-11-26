import logo from "@/assets/rdl-logo.png.asset.json";

// Original RDL logo (white background removed only). Size it with a height class, e.g. "h-10".
export function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src={logo.url}
      alt="RDL"
      width={878}
      height={818}
      draggable={false}
      className={`inline-block w-auto select-none object-contain drop-shadow-[0_0_24px_oklch(1_0_0/0.08)] ${className}`}
    />
  );
}
