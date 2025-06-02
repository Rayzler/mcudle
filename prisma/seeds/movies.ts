import { Movie, PrismaClient } from "@prisma/client";

export async function seedMovies(prisma: PrismaClient) {
  const movies: Omit<Movie, "id">[] = [
    {
      title: "Iron Man",
      releaseYear: 2008,
      phase: 1,
      isSeries: false,
      posterUrl: "https://example.com/ironman.jpg"
    },
    {
      title: "The Incredible Hulk",
      releaseYear: 2008,
      phase: 1,
      isSeries: false,
      posterUrl: "https://example.com/hulk.jpg"
    },
    {
      title: "Iron Man 2",
      releaseYear: 2010,
      phase: 1,
      isSeries: false,
      posterUrl: "https://example.com/ironman2.jpg"
    },
    {
      title: "Thor",
      releaseYear: 2011,
      phase: 1,
      isSeries: false,
      posterUrl: "https://example.com/thor.jpg"
    },
    {
      title: "Captain America: The First Avenger",
      releaseYear: 2011,
      phase: 1,
      isSeries: false,
      posterUrl: "https://example.com/captainamerica.jpg"
    },
    {
      title: "The Avengers",
      releaseYear: 2012,
      phase: 1,
      isSeries: false,
      posterUrl: "https://example.com/avengers.jpg"
    },
    {
      title: "Iron Man 3",
      releaseYear: 2013,
      phase: 2,
      isSeries: false,
      posterUrl: "https://example.com/ironman3.jpg"
    }
  ];

  for (const movie of movies) {
    await prisma.movie.upsert({
      where: { title: movie.title },
      update: {},
      create: movie
    });
  }

  console.log(`Seeded ${movies.length} movies.`);
}
