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
      imageUrl: "https://www.xtrafondos.com/wallpapers/nuevo-traje-de-iron-man-6726.jpg",
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
      imageUrl: "https://www.xtrafondos.com/wallpapers/capitan-america-1415.jpg",
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
      imageUrl: "https://www.xtrafondos.com/wallpapers/viuda-negra-pelicula-7423.jpg",
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
      imageUrl: "https://www.xtrafondos.com/wallpapers/resized/thor-en-avengers-1277.jpg?s=large",
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
      imageUrl: "https://wallpapersok.com/images/high/angry-hulk-4k-marvel-iphone-w3jrbhyk7kitvwtb.jpg",
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
      imageUrl: "https://wallpapers.com/images/hd/hawkeye-4k-marvel-iphone-purple-sddkgfs67kr4emvq.jpg",
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
      imageUrl: "https://wallpapers.com/images/hd/wanda-scarlet-witch-the-hydra-4k-i7pi11enppt6a79w.jpg",
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
      imageUrl: "https://www.xtrafondos.com/wallpapers/spider-man-marvel-avengers-10921.jpg",
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
      imageUrl: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2392efe1-1e60-4084-936b-0f2fb4ba33aa/djsgovy-d36946bf-86ef-45de-bd64-0ec3481f3e50.jpg/v1/fill/w_1001,h_798,q_70,strp/kate_bishop___2025_05_21_by_skyedigitaltales_djsgovy-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAyMCIsInBhdGgiOiJcL2ZcLzIzOTJlZmUxLTFlNjAtNDA4NC05MzZiLTBmMmZiNGJhMzNhYVwvZGpzZ292eS1kMzY5NDZiZi04NmVmLTQ1ZGUtYmQ2NC0wZWMzNDgxZjNlNTAuanBnIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.oinhMY1hqxEJ86zCOrXAiVnwT0qWNcC6KZDriaLbqh0",
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
      imageUrl: "https://images5.alphacoders.com/916/916247.jpg",
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
      imageUrl: "https://wallpapercat.com/w/full/1/b/f/461219-1440x2560-samsung-hd-groot-wallpaper-photo.jpg",
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
      imageUrl: "https://fondosmil.co/fondo/108860.png",
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
      imageUrl: "https://c4.wallpaperflare.com/wallpaper/741/92/981/avengers-infinity-war-thanos-4k-josh-brolin-wallpaper-preview.jpg",
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
      imageUrl: "https://c4.wallpaperflare.com/wallpaper/425/807/827/fiction-superhero-comic-aaron-taylor-johnson-wallpaper-preview.jpg",
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
