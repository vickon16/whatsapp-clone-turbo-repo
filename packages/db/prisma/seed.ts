import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const seedUsers: Prisma.userCreateInput[] = [
  {
    email: "user1@gmail.com",
    name: "User 1",
    bio: "My name is User 1",
    image: "/avatars/1.png",
    isOnBoard: true,
  },
  {
    email: "user2@gmail.com",
    name: "User 2",
    bio: "My name is User 2",
    image: "/avatars/2.png",
    isOnBoard: true,
  },
  {
    email: "user3@gmail.com",
    name: "User 3",
    bio: "My name is User 3",
    image: "/avatars/3.png",
    isOnBoard: true,
  },
  {
    email: "user4@gmail.com",
    name: "User 4",
    bio: "My name is User 4",
    image: "/avatars/4.png",
    isOnBoard: true,
  },
  {
    email: "user5@gmail.com",
    name: "User 5",
    image: "/avatars/5.png",
    isOnBoard: true,
  },
  {
    email: "user6@gmail.com",
    name: "User 6",
    bio: "My name is User 6",
    image: "/avatars/6.png",
    isOnBoard: true,
  },
  {
    email: "user7@gmail.com",
    name: "User 7",
    image: "/avatars/7.png",
    isOnBoard: true,
  },
  {
    email: "user8@gmail.com",
    name: "User 8",
    bio: "My name is User 8",
    image: "/avatars/8.png",
    isOnBoard: true,
  },
  {
    email: "user9@gmail.com",
    name: "User 9",
    bio: "My name is User 9",
    image: "/avatars/9.png",
    isOnBoard: true,
  },
  {
    email: "user10@gmail.com",
    name: "User 10",
    bio: "My name is User 10",
    image: "/avatars/10.png",
    isOnBoard: true,
  },
];

async function main() {
  console.log(`Start seeding ...`);
  await prisma.user.createMany({ data: seedUsers });
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

// to run this
// 1) npm install tsx -D
// 2) add to package.json.
//  "prisma": {
//   "seed": "tsx prisma/seed.ts"
//  }
// 3) add this to script
// "script" : {
//     "reset:seed" : "prisma db push --force-reset && prisma db seed"
// }
// 4) npm run reset:seed
