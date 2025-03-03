// npm install --save-dev tsx

// npx tsx prisma/seedData/dbInject.ts

import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  // Delete all records in reverse order of dependencies
  await prisma.post.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.authenticator.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Database cleared successfully!');
}

async function seed() {
  // First clear the database
  await clearDatabase();

  const data = JSON.parse(fs.readFileSync('prisma/seedData/seed-data.json', 'utf8'));

  // Insert Users, Profiles, and Posts into your DB
  // Because of relations, we can create them in the correct order or use createMany.
  for (const item of data) {
    try {
      // Create user
      const createdUser = await prisma.user.create({
        data: {
          id: item.id,
          name: item.name,
          email: item.email,
          emailVerified: item.emailVerified ? new Date(item.emailVerified) : null,
          image: item.image,
          createdAt: new Date(item.createdAt || new Date()),
          updatedAt: new Date(item.updatedAt || new Date())
        }
      });

      // Create profile
      if (item.profile) {
        await prisma.profile.create({
          data: {
            id: item.profile.id,
            userId: item.id, // Use the user's ID, not profile.userId which might be wrong
            bio: item.profile.bio,
            avatarUrl: item.profile.avatarUrl,
            location: item.profile.location,
            interests: item.profile.interests || [],
            createdAt: new Date(item.profile.createdAt || new Date()),
            updatedAt: new Date(item.profile.updatedAt || new Date())
          }
        });
      }

      // Create posts
      if (item.posts && item.posts.length > 0) {
        await prisma.post.createMany({
          data: item.posts.map((p: any) => ({
            id: p.id,
            userId: item.id, // Use the user's ID, not p.userId which might be wrong
            imageUrl: p.imageUrl,
            caption: p.caption,
            createdAt: new Date(p.createdAt || new Date()),
            updatedAt: new Date(p.updatedAt || new Date())
          }))
        });
      }
    } catch (error) {
      console.error(`Error processing user ${item.name}:`, error);
      throw error; // Re-throw to stop the seeding process
    }
  }

  console.log('Database seeded successfully!');
}

seed()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });