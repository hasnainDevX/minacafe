// A viewport onto the original artwork: no redraw or replacement of the logo pixels.
export default function BrandIllustration({ className = "" }) {
  return <svg viewBox="390 190 490 400" className={"block overflow-hidden mix-blend-multiply " + className} aria-hidden="true" focusable="false">
    <image href="/images/brand/mina-original-logo.jpg" width="1254" height="1254" />
  </svg>;
}
