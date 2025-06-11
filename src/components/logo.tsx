import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="hover:scale-105 transition-transform">
      <img
        src="/images/ui/logo.png"
        alt="MCU-DLE logo"
        width={275}
        height={98}
        className="box-reflect mb-6"
      />
    </Link>
  );
};

export default Logo;
