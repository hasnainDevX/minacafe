export default function BrandLogo({ className = "" }) {
  return (
    <svg
      viewBox="0 0 220 100"
      className={className}
      role="img"
      aria-label="mina"
      overflow="visible"
    >
      <text
        x="0"
        y="80"
        fontFamily="Cormorant, Georgia, serif"
        fontSize="88"
        fontWeight="600"
        fill="currentColor"
      >
        mına
      </text>
      <path
        fill="#C93F4D"
        d="M77 25C73 21 65 16 65 10C65 3 74 2 77 8C80 2 89 3 89 10C89 16 81 22 77 25Z"
      />
    </svg>
  );
}