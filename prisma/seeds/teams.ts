import { Team, PrismaClient } from "@prisma/client";

export async function seedTeams(prisma: PrismaClient) {
  const avengersMembers = await prisma.character.findMany({
    where: {
      name: {
        in: [
          "Iron Man",
          "Captain America",
          "Thor",
          "Hulk",
          "Black Widow",
          "Hawkeye",
          "Scarlet Witch",
          "Spider-Man",
          "Doctor Strange",
          "Black Panther",
          "Pietro Maximoff"
        ]
      }
    }
  });
  const guardiansMembers = await prisma.character.findMany({
    where: { name: { in: ["Groot"] } }
  });
  const revengersMembers = await prisma.character.findMany({
    where: { name: { in: ["Thor", "Hulk"] } }
  });
  const shieldMembers = await prisma.character.findMany({
    where: { name: { in: ["Hawkeye", "Black Widow"] } }
  });

  const teams = [
    {
      name: "Avengers",
      description:
        "Earth's mightiest heroes, assembled to protect the world from threats.",
      members: avengersMembers.map((c) => ({ id: c.id }))
    },
    {
      name: "Guardians of the Galaxy",
      description:
        "A group of intergalactic misfits who band together to protect the universe.",
      members: guardiansMembers.map((c) => ({ id: c.id }))
    },
    {
      name: "Revengers",
      description:
        "A team formed to take down powerful enemies, often with a personal vendetta.",
      members: revengersMembers.map((c) => ({ id: c.id }))
    },
    {
      name: "Eternals",
      description:
        "A group of immortal beings who have secretly protected Earth for centuries.",
      members: []
    },
    {
      name: "X-Men",
      description:
        "A team of mutants fighting for a peaceful coexistence between humans and mutants.",
      members: []
    },
    {
      name: "Fantastic Four",
      description:
        "A team of superheroes with unique powers, exploring the unknown and defending Earth.",
      members: []
    },
    {
      name: "S.H.I.E.L.D.",
      description:
        "A secret organization that deals with superhuman threats and espionage.",
      members: shieldMembers.map((c) => ({ id: c.id }))
    },
    {
      name: "Thunderbolts",
      description:
        "A team of reformed villains working for the government to redeem themselves.",
      members: []
    }
  ];

  for (const team of teams) {
    await prisma.team.upsert({
      where: { name: team.name },
      update: {
        members: { set: team.members }
      },
      create: {
        name: team.name,
        description: team.description,
        members: { connect: team.members }
      }
    });
  }

  console.log(`Seeded ${teams.length} teams.`);
}
