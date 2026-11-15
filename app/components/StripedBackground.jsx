export default function StripedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 bg-[url('/images/textures/mina-stripes.svg')] bg-fixed bg-repeat [background-size:clamp(88px,14vw,192px)_192px]"
    />
  );
}
