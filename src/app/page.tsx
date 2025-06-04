import MainButton from "@/components/main-button";
import Image from "next/image";

const domain = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pt-16 gap-8">
      <main className="flex flex-col gap-5 justify-start items-center w-full h-full">
        <Image
          src="/images/ui/logo.png"
          alt="MCU-DLE logo"
          width={275}
          height={98}
          className="box-reflect mb-6"
          priority
        />
        <h1 className="text-2xl">Guess the daily Hero! or Villain?</h1>
        <div className="flex flex-col gap-4 w-full items-center">
          <MainButton label="Classic" description="Guess the character with clues" />
          <MainButton label="Movie" description="Guess the movie from a list of frames" />
          <MainButton label="Image" description="Guess the character from an image section" />
          <MainButton label="Quote" description="Guess who said the quote" />
          <MainButton label="Item" description="Guess the owner of the item" />
          <MainButton label="Emoji" description="Guess the character with emojis" />
        </div>
      </main>
      {/* TODO: Footer */}
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
    </div>
  );
}
