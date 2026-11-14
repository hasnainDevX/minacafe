import "./preview.css";

export const metadata = {
  title: "Mina — Brand Background Preview",
  robots: { index: false, follow: false },
};

const colors = [
  ["Ivory", "#F3ECDA"], ["Butter", "#F4EDBE"], ["Peach", "#EFD5BE"],
  ["Cocoa", "#4A2E1C"], ["Burgundy", "#601E1C"], ["Ink", "#000000"],
];

export default function BrandPreview() {
  return (
    <main className="brand-preview">
      <header className="preview-header">
        <span className="preview-wordmark">mina</span>
        <span>COLOUR & SURFACE STUDY / 01</span>
      </header>
      <section className="preview-intro">
        <p className="preview-eyebrow">A warmer kind of everyday.</p>
        <h1>Soft colours.<br />A little character.</h1>
        <p>The Mina palette, with broad café stripes and a quiet paper grain.</p>
        <div className="preview-swatches">
          {colors.map(([name, hex]) => (
            <div key={name}>
              <span className="preview-swatch" style={{ backgroundColor: hex }} />
              <strong>{name}</strong><small>{hex}</small>
            </div>
          ))}
        </div>
      </section>
      <section className="mina-stripes mina-paper preview-surface">
        <div className="preview-note">
          <p className="preview-eyebrow">01 / IVORY + PEACH</p>
          <h2>Made for<br />sweet moments.</h2>
          <p>Our main striped surface. Warm, spacious and softly textured.</p>
          <span className="preview-label">PRIMARY BACKGROUND</span>
        </div>
        <div className="preview-type">
          <span>From my hands<br />to your heart.</span>
          <small>Real product photography will sit beautifully here.</small>
        </div>
      </section>
      <section className="mina-stripes mina-stripes-butter mina-paper preview-surface preview-surface-butter">
        <div className="preview-note">
          <p className="preview-eyebrow">02 / IVORY + BUTTER</p>
          <h2>A softer<br />side of Mina.</h2>
          <p>A gentle alternative for stories, selected reviews and seasonal features.</p>
          <span className="preview-label">SUPPORTING BACKGROUND</span>
        </div>
      </section>
      <section className="mina-stripes mina-stripes-burgundy preview-bold">
        <div className="preview-note">
          <p className="preview-eyebrow">03 / IVORY + BURGUNDY</p>
          <h2>A little boldness.</h2>
          <p>Reserve this stronger stripe for small accents. Text stays on a solid surface.</p>
        </div>
      </section>
      <footer className="mina-paper preview-footer">
        <span className="preview-wordmark">mina</span>
        <p>Burgundy for the moments that need a little more warmth.</p>
        <small>#601E1C / SOLID FOOTER SURFACE</small>
      </footer>
    </main>
  );
}

