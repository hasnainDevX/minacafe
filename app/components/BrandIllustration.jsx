import Image from "next/image";

export default function BrandIllustration({ className = "" }) {
  return <Image
    src="/images/brand/mina-cup-fruit-transparent.png"
    width={1536}
    height={1024}
    sizes="192px"
    alt=""
    aria-hidden="true"
    className={"block " + className}
  />;
}
