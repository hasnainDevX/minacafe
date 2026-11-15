const hours = [
  ["Monday", "Closed"],
  ["Tuesday", "Closed"],
  ["Wednesday", "Closed"],
  ["Thursday", "Closed"],
  ["Friday", "Closed"],
  ["Saturday", "Closed"],
  ["Sunday", "Closed"],
];

export default function Hours() {
  return (
    <section
      aria-labelledby="hours-heading"
      className="bg-white px-6 py-16 text-cocoa md:px-12 md:py-24 lg:py-32"
    >
      <div className="mx-auto grid max-w-[1300px] gap-12 md:grid-cols-2 md:gap-0">
        <div className="md:pr-16">
          <h2
            id="hours-heading"
            className="font-(family-name:--font-cormorant) text-4xl font-light leading-[1.15] md:text-6xl"
          >
            A little something,
            <br />
            made fresh for you.
          </h2>
          <p className="mt-8 max-w-[520px] font-[family-name:var(--font-source-sans)] text-lg leading-[1.7]">
            Stop by North Nazimabad and slow things down with a cold bottle or a
            fresh bowl. Everything is prepared by hand, so come say hello and
            find your little favourite.
          </p>
          <a
            href="/menu"
            className="mt-10 inline-block bg-[var(--mina-burgundy)] px-8 py-4 text-sm uppercase tracking-[0.15em] text-[var(--mina-ivory)] transition-opacity hover:opacity-90 motion-reduce:transition-none"
          >
            View our menu
          </a>
        </div>

        <div className="md:border-l md:border-[#4a2e1c33] md:pl-16">
          <ul className="border-t border-[#4a2e1c33]">
            {hours.map(([day, time]) => (
              <li
                key={day}
                className="grid grid-cols-2 border-b border-[#4a2e1c33] py-4 font-[family-name:var(--font-source-sans)] text-lg"
              >
                <span>{day}</span>
                <span>{time}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-[family-name:var(--font-source-sans)] text-base">
            Message us on Instagram for today&apos;s availability.
          </p>
        </div>
      </div>
    </section>
  );
}