import { PrismaClient } from "@prisma/client";
import { seedCharacters } from "./characters";
import { seedMovies } from "./movies";
import { seedQuotes } from "./quotes";
import { seedItems } from "./items";
import { seedActors } from "./actors";
import { seedTeams } from "./teams";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  // Clear existing data
  await prisma.item.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.character.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.actor.deleteMany();
  await prisma.team.deleteMany();

  // Seed data
  await seedActors(prisma);
  await seedCharacters(prisma);
  await seedMovies(prisma);
  await seedQuotes(prisma);
  await seedItems(prisma);
  await seedTeams(prisma);

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
