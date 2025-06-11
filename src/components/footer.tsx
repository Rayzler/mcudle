import Image from "next/image";

const domain = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

const Footer = () => {
  return (
    <footer className="flex gap-2 flex-col flex-wrap items-center justify-center">
      <div className="flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          {domain} — 2025
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
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
