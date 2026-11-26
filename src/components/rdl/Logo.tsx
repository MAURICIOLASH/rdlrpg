// Provisional mark until the original RDL logo image is supplied; swap the inner content for <img>.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-gothic text-metal inline-block leading-none select-none ${className}`} aria-label="RDL">
      RDL
    </span>
  );
}
