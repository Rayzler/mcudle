import { Item, PrismaClient } from "@prisma/client";

export async function seedItems(prisma: PrismaClient) {
  const items: Omit<Item, "id">[] = [
    {
      name: "Arc Reactor",
      description: "An advanced power source developed by Tony Stark.",
      imageUrl: null,
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Iron Man" } })
          .then((character) => character?.id)) || ""
    },
    {
      name: "Mjolnir",
      description: "Thor's enchanted hammer, capable of summoning lightning.",
      imageUrl: null,
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Thor" } })
          .then((character) => character?.id)) || ""
    },
    {
      name: "Vibranium Shield",
      description: "A vibranium shield used by Captain America.",
      imageUrl: null,
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Captain America" } })
          .then((character) => character?.id)) || ""
    },
    {
      name: "Infinity Gauntlet",
      description: "A powerful artifact that can control the Infinity Stones.",
      imageUrl: null,
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Thanos" } })
          .then((character) => character?.id)) || ""
    },
    {
      name: "Eye of Agamotto",
      description:
        "A mystical artifact used by Doctor Strange to manipulate time.",
      imageUrl: null,
      characterId:
        (await prisma.character
          .findUnique({ where: { name: "Doctor Strange" } })
          .then((character) => character?.id)) || ""
    }
  ];

  for (const item of items) {
    await prisma.item.upsert({
      where: { name: item.name },
      update: {},
      create: item
    });
  }

  console.log(`Seeded ${items.length} items.`);
}
