const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function createUser() {
    const uuid = "user_2zaMwyTn6dRzpnUDu9a1dSKUdjw";
    
    try {
        const user = await prisma.user.upsert({
            where: { uuid },
            update: {},
            create: {
                uuid,
                name: "Test User",
                email: "test@example.com",
                username: "testuser"
            }
        });
        console.log("✅ User created/updated:", user);
    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createUser();
