import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        username: "testuser",
        name: "Test User",
        passwordHash: "test123", // In production, this would be properly hashed
      },
    });

    console.log("Created test user:", user);

    // Query the user back
    const users = await prisma.user.findMany();
    console.log("All users in database:", users);

    // Create a test photo
    const photo = await prisma.photo.create({
      data: {
        url: "https://example.com/test.jpg",
        uploaderId: user.id,
        caption: "Test photo",
      },
    });

    console.log("Created test photo:", photo);

    // Query photos with their uploaders
    const photos = await prisma.photo.findMany({
      include: {
        uploader: true,
      },
    });

    console.log("All photos with uploaders:", photos);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
