import MainButton from "@/components/main-button";

export default function Home() {
  return (
    <>
      <h1 className="text-2xl">Guess the daily Hero! or Villain?</h1>
      <div className="flex flex-col gap-4 w-full items-center">
        <MainButton
          label="Classic"
          description="Guess the character with clues"
          href="/classic"
        />
        <MainButton
          label="Movie"
          description="Guess the movie from a list of frames"
          href="/movie"
        />
        <MainButton
          label="Image"
          description="Guess the character from an image section"
          href="/image"
        />
        <MainButton
          label="Quote"
          description="Guess who said the quote"
          href="/quote"
        />
        <MainButton
          label="Item"
          description="Guess the owner of the item"
          href="/item"
        />
        <MainButton
          label="Emoji"
          description="Guess the character with emojis"
          href="/emoji"
        />
      </div>
    </>
  );
}
