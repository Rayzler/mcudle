import { Character, Gender, Status, PrismaClient } from "@prisma/client";

export async function seedCharacters(prisma: PrismaClient) {
  const characters: Omit<Character, "id">[] = [
    {
      name: "Iron Man",
      gender: Gender.male,
      species: "Human",
      status: Status.dead,
      firstAppearance: 2008,
      description: "Genius, billionaire, playboy, philanthropist.",
      emojis: "😎🤖🦾🧠",
      imageUrl: "https://example.com/ironman.jpg",
      actorId:
        (await prisma.actor
          .findUnique({ where: { name: "Robert Downey Jr." } })
          .then((actor) => actor?.id)) || "",
    },
    {
      name: "Captain America",
      gender: Gender.male,
      species: "Human",
      status: Status.unknown,
      firstAppearance: 2011,
      description: "Super soldier and leader of the Avengers.",
      emojis: "🦸‍♂️🛡️💪🦅",
      imageUrl: "https://example.com/captainamerica.jpg",
      actorId:
        (await prisma.actor
          .findUnique({ where: { name: "Chris Evans" } })
          .then((actor) => actor?.id)) || ""
    },
    {
      name: "Black Widow",
      gender: Gender.female,
      species: "Human",
      status: Status.dead,
      firstAppearance: 2010,
      description: "Skilled spy and assassin.",
      emojis: "🕷️🖤🔫👩‍🦰",
      imageUrl: "https://example.com/blackwidow.jpg",
      actorId:
        (await prisma.actor
          .findUnique({ where: { name: "Scarlett Johansson" } })
          .then((actor) => actor?.id)) || ""
    },
    {
      name: "Thor",
      gender: Gender.male,
      species: "Asgardian",
      status: Status.alive,
      firstAppearance: 2011,
      description: "God of Thunder and protector of Asgard.",
      emojis: "⚡️🪓🌩️👑",
      imageUrl: "https://example.com/thor.jpg",
      actorId:
        (await prisma.actor
          .findUnique({ where: { name: "Chris Hemsworth" } })
          .then((actor) => actor?.id)) || ""
    },
    {
      name: "Hulk",
      gender: Gender.male,
      species: "Human",
      status: Status.alive,
      firstAppearance: 2008,
      description: "The strongest Avenger.",
      emojis: "🟩💪😡👕",
      imageUrl: "https://example.com/hulk.jpg",
      actorId:
        (await prisma.actor
          .findUnique({ where: { name: "Mark Ruffalo" } })
          .then((actor) => actor?.id)) || ""
    },
    {
      name: "Hawkeye",
      gender: Gender.male,
      species: "Human",
      status: Status.alive,
      firstAppearance: 2011,
      description: "Master archer and marksman.",
      emojis: "🏹🟣👁️🎯",
      imageUrl: "https://example.com/hawkeye.jpg",
      actorId:
        (await prisma.actor
          .findUnique({ where: { name: "Jeremy Renner" } })
          .then((actor) => actor?.id)) || ""
    },
    {
      name: "Scarlet Witch",
      gender: Gender.female,
      species: "Mutant",
      status: Status.dead,
      firstAppearance: 2015,
      description: "Powerful sorceress and member of the Avengers.",
      emojis: "🧙‍♀️🔮❤️✨",
      imageUrl: "https://example.com/scarletwitch.jpg",
      actorId:
        (await prisma.actor
          .findUnique({ where: { name: "Elizabeth Olsen" } })
          .then((actor) => actor?.id)) || ""
    },
    {
      name: "Spider-Man",
      gender: Gender.male,
      species: "Human",
      status: Status.alive,
      firstAppearance: 2002,
      description: "Teenager with spider-like abilities.",
      emojis: "🕷️🕸️🤟🧑‍🎤",
      imageUrl: "https://example.com/spiderman.jpg",
      actorId:
        (await prisma.actor
          .findUnique({ where: { name: "Tom Holland" } })
          .then((actor) => actor?.id)) || ""
    },
    {
      name: "Hawkeye (Kate Bishop)",
      gender: Gender.female,
      species: "Human",
      status: Status.alive,
      firstAppearance: 2021,
      description: "Young archer and member of the Young Avengers.",
      emojis: "🏹🟣👧🎯",
      imageUrl: "https://example.com/hawkeye-kate.jpg",
      actorId:
        (await prisma.actor
          .findUnique({ where: { name: "Hailee Steinfeld" } })
          .then((actor) => actor?.id)) || ""
    },
    {
      name: "Doctor Strange",
      gender: Gender.male,
      species: "Human",
      status: Status.alive,
      firstAppearance: 2016,
      description: "Master of the Mystic Arts.",
      emojis: "🧙‍♂️🔮👐🕳️",
      imageUrl: "https://example.com/doctorstrange.jpg",
      actorId:
        (await prisma.actor
          .findUnique({ where: { name: "Benedict Cumberbatch" } })
          .then((actor) => actor?.id)) || ""
    },
    {
      name: "Groot",
      gender: Gender.male,
      species: "Flora colossi",
      status: Status.alive,
      firstAppearance: 2014,
      description:
        "Tree-like creature and member of the Guardians of the Galaxy.",
      emojis: "🌳🪴🧒🌱",
      imageUrl: "https://example.com/groot.jpg",
      actorId:
        (await prisma.actor
          .findUnique({ where: { name: "Vin Diesel" } })
          .then((actor) => actor?.id)) || ""
    },
    {
      name: "Black Panther",
      gender: Gender.male,
      species: "Human",
      status: Status.dead,
      firstAppearance: 2016,
      description: "King of Wakanda and skilled fighter.",
      emojis: "🐾👑🖤🐆",
      imageUrl: "https://example.com/blackpanther.jpg",
      actorId:
        (await prisma.actor
          .findUnique({ where: { name: "Chadwick Boseman" } })
          .then((actor) => actor?.id)) || ""
    },
    {
      name: "Thanos",
      gender: Gender.male,
      species: "Titan",
      status: Status.dead,
      firstAppearance: 2014,
      description: "The Mad Titan and conqueror of worlds.",
      emojis: "🪐💜🧤💪",
      imageUrl: "https://example.com/thanos.jpg",
      actorId:
        (await prisma.actor
          .findUnique({ where: { name: "Josh Brolin" } })
          .then((actor) => actor?.id)) || ""
    },
    {
      name: "Pietro Maximoff",
      gender: Gender.male,
      species: "Human",
      status: Status.dead,
      firstAppearance: 2015,
      description: "Super-speedster and twin brother of Wanda Maximoff.",
      emojis: "⚡️🟦👟👦",
      imageUrl: "https://example.com/pietro.jpg",
      actorId:
        (await prisma.actor
          .findUnique({ where: { name: "Aaron Taylor-Johnson" } })
          .then((actor) => actor?.id)) || ""
    }
  ];

  for (const character of characters) {
    await prisma.character.upsert({
      where: { name: character.name },
      update: {},
      create: character
    });
  }

  console.log(`Seeded ${characters.length} characters.`);
}
