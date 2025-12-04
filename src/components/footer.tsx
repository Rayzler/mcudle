import Image from "next/image";

const domain = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
const buildYear =
  process.env.NEXT_PUBLIC_BUILD_YEAR || String(new Date().getFullYear());

const Footer = () => {
  return (
    <footer className="flex gap-2 flex-col flex-wrap items-center justify-center mt-2">
      <div className="flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href={domain}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden={true}
            src="/globe.svg"
            alt=""
            width={16}
            height={16}
          />
          {domain} — {buildYear}
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden={true}
            src="/file.svg"
            alt=""
            width={16}
            height={16}
          />
          Privacy Policy
        </a>
      </div>
      <p>Marvel does not endorse this application.</p>
    </footer>
  );
};

export default Footer;
