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
      imageUrl: "/characters/iron_man.jpg",
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
      imageUrl: "/images/characters/captain_america.jpg",
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
      imageUrl: "/images/characters/black_widow.jpg",
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
      imageUrl: "/images/characters/thor.jpg",
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
      imageUrl: "/images/characters/hulk.jpg",
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
      imageUrl: "/images/characters/hawkeye.jpg",
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
      imageUrl: "/images/characters/scarlet_witch.jpg",
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
      imageUrl: "/images/characters/spiderman.jpg",
      actorId:
        (await prisma.actor
          .findUnique({ where: { name: "Tom Holland" } })
          .then((actor) => actor?.id)) || ""
    },
    {
      name: "Kate Bishop",
      gender: Gender.female,
      species: "Human",
      status: Status.alive,
      firstAppearance: 2021,
      description: "Young archer and member of the Young Avengers.",
      emojis: "🏹🟣👧🎯",
      imageUrl: "/images/characters/kate_bishop.jpg",
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
      imageUrl: "/images/characters/doctor_strange.jpg",
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
      imageUrl: "/images/characters/groot.jpg",
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
      imageUrl: "/images/characters/black_panther.jpg",
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
      imageUrl: "/images/characters/thanos.jpg",
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
      imageUrl: "/images/characters/pietro_maximoff.jpg",
      actorId:
        (await prisma.actor
          .findUnique({ where: { name: "Aaron Taylor-Johnson" } })
          .then((actor) => actor?.id)) || ""
    },
    {
      name: "Loki",
      gender: Gender.male,
      species: "Asgardian",
      status: Status.alive,
      firstAppearance: 2011,
      description: "God of Mischief and adopted brother of Thor.",
      emojis: "🪄👑🟩🐍",
      imageUrl: "/images/characters/loki.jpg",
      actorId:
        (await prisma.actor
          .findUnique({ where: { name: "Tom Hiddleston" } })
          .then((actor) => actor?.id)) || ""
    },
    {
      name: "Winter Soldier",
      gender: Gender.male,
      species: "Human",
      status: Status.alive,
      firstAppearance: 2014,
      description: "Formerly known as Bucky Barnes, Steve Rogers' best friend.",
      emojis: "❄️🔫🖤",
      imageUrl: "/images/characters/winter_soldier.jpg",
      actorId:
        (await prisma.actor
          .findUnique({ where: { name: "Sebastian Stan" } })
          .then((actor) => actor?.id)) || ""
    },
    {
      name: "Nick Fury",
      gender: Gender.male,
      species: "Human",
      status: Status.alive,
      firstAppearance: 2008,
      description: "Director of S.H.I.E.L.D. and former soldier.",
      emojis: "🕶️🔫🖤",
      imageUrl: "/images/characters/nick_fury.jpg",
      actorId: null
    },
    {
      name: "Abomination",
      gender: Gender.male,
      species: "Human",
      status: Status.alive,
      firstAppearance: 2008,
      description: "Formerly known as Emil Blonsky, a soldier who transformed into a monster.",
      emojis: "🟩💪👹",
      imageUrl: "/images/characters/abomination.jpg",
      actorId: null
    },
    {
      name: "Red Skull",
      gender: Gender.male,
      species: "Human",
      status: Status.alive,
      firstAppearance: 2011,
      description: "Leader of HYDRA and enemy of Captain America.",
      emojis: "🟥💀🔫",
      imageUrl: "/images/characters/red_skull.jpg",
      actorId: null
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
