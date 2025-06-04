import type { Metadata } from "next";
import "./globals.css";
import { getDailyChallenge } from "@/actions/dailyChallenge";
import { shareTech } from "@/fonts";

export const metadata: Metadata = {
  title: "MCU-DLE",
  description: "Guess the daily Marvel Cinematic Universe character!"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  getDailyChallenge();

  return (
    <html lang="en">
      <body
        className={`${shareTech.className} antialiased`}
      >
        <div className="absolute inset-0 shadow-[inset_0px_8px_80px_30px_rgba(0,_0,_0,_0.8)] overflow-hidden bg-neutral-950 -z-50">
          <img src="/images/ui/main_bg.jpg" alt="Background" className="object-cover w-full h-full -z-10 grayscale opacity-5" />
        </div>
        {children}
      </body>
    </html>
  );
}
