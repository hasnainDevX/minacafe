export default function StripedBackground({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 ${className}`}
      style={{
        backgroundColor: "var(--stripe-bg, #ffffff)",
        backgroundImage:
          "linear-gradient(90deg, var(--stripe-color, #efcdd0) 50%, transparent 50%)",
        backgroundSize: "var(--stripe-width, clamp(188px, 30vw, 300px)) 100%",
        backgroundRepeat: "repeat-x",
      }}
    />
  );
}
