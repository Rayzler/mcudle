import { Quote, PrismaClient } from "@prisma/client";

export async function seedQuotes(prisma: PrismaClient) {
  const quotes: Omit<Quote, "id">[] = [
    {
      text: "I can do this all day.",
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Captain America" } })
          .then((character) => character?.id)) || ""
    },
    {
      text: "I'm always angry.",
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Hulk" } })
          .then((character) => character?.id)) || ""
    },
    {
      text: "I love you 3000.",
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Iron Man" } })
          .then((character) => character?.id)) || ""
    },
    {
      text: "On your left.",
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Captain America" } })
          .then((character) => character?.id)) || ""
    },
    {
      text: "With great power comes great responsibility.",
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Spider-Man" } })
          .then((character) => character?.id)) || ""
    },
    {
      text: "Avengers, assemble!",
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Captain America" } })
          .then((character) => character?.id)) || ""
    },
    {
      text: "I am Groot.",
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Groot" } })
          .then((character) => character?.id)) || ""
    },
    {
      text: "I choose to run towards my problems, and not away from them.",
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Captain America" } })
          .then((character) => character?.id)) || ""
    },
    {
      text: "Sometimes you gotta run before you can walk.",
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Iron Man" } })
          .then((character) => character?.id)) || ""
    },
    {
      text: "We have a Hulk.",
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Iron Man" } })
          .then((character) => character?.id)) || ""
    },
    {
      text: "Wakanda forever!",
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Black Panther" } })
          .then((character) => character?.id)) || ""
    },
    {
      text: "I am inevitable.",
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Thanos" } })
          .then((character) => character?.id)) || ""
    },
    {
      text: "You didn't see that coming.",
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Pietro Maximoff" } })
          .then((character) => character?.id)) || ""
    },
    {
      text: "I don't want to go.",
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Spider-Man" } })
          .then((character) => character?.id)) || ""
    },
    {
      text: "Sun's getting real low.",
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Black Widow" } })
          .then((character) => character?.id)) || ""
    }
  ];

  for (const quote of quotes) {
    await prisma.quote.upsert({
      where: { text: quote.text },
      update: {},
      create: quote
    });
  }

  console.log(`Seeded ${quotes.length} quotes.`);
}
