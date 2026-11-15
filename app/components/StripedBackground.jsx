export default function StripedBackground({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 ${className}`}
      style={{
        backgroundColor: "var(--stripe-bg, #F3ECE8)",
        backgroundImage:
          "linear-gradient(90deg, var(--stripe-color, #EFD5BE) 50%, transparent 50%)",
        backgroundSize: "var(--stripe-width, clamp(88px, 14vw, 192px)) 100%",
        backgroundRepeat: "repeat-x",
      }}
    />
  );
}