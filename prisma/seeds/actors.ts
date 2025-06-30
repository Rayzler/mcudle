import { Actor, PrismaClient } from "@prisma/client";

export async function seedActors(prisma: PrismaClient) {
  const actors: Omit<Actor, "id">[] = [
    {
      name: "Robert Downey Jr.",
      imageUrl: null
    },
    {
      name: "Chris Evans",
      imageUrl: null
    },
    {
      name: "Scarlett Johansson",
      imageUrl: null
    },
    {
      name: "Chris Hemsworth",
      imageUrl: null
    },
    {
      name: "Mark Ruffalo",
      imageUrl: null
    },
    {
      name: "Tom Holland",
      imageUrl: null
    },
    {
      name: "Benedict Cumberbatch",
      imageUrl: null
    },
    {
      name: "Samuel L. Jackson",
      imageUrl: null
    },
    {
      name: "Elizabeth Olsen",
      imageUrl: null
    },
    {
      name: "Hailee Steinfeld",
      imageUrl: null
    },
    {
      name: "Tom Hiddleston",
      imageUrl: null
    },
    {
      name: "Anthony Mackie",
      imageUrl: null
    },
    {
      name: "Jeremy Renner",
      imageUrl: null
    },
    {
      name: "Paul Rudd",
      imageUrl: null
    },
    {
      name: "Benedict Wong",
      imageUrl: null
    },
    {
      name: "Chadwick Boseman",
      imageUrl: null
    },
    {
      name: "Brie Larson",
      imageUrl: null
    },
    {
      name: "Vin Diesel",
      imageUrl: null
    },
    {
      name: "Josh Brolin",
      imageUrl: null
    },
    {
      name: "Aaron Taylor-Johnson",
      imageUrl: null
    },
    {
      name: "Sebastian Stan",
      imageUrl: null
    }
  ];

  for (const actor of actors) {
    await prisma.actor.upsert({
      where: { name: actor.name },
      update: {},
      create: actor
    });
  }

  console.log(`Seeded ${actors.length} actors`);
}
