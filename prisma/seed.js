const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
    const alice = await prisma.user.upsert({
        where: { id: 1 },
        update: {},
        create: {
            email: "alice@prisma.io",
            name: "Alice",
            password: "1234",
            Post: {
                create: {
                    title: "Check out Prisma with Next.js",
                    content: "https://www.prisma.io/nextjs",
                    published: true,
                    Comment: {
                        create: {
                            content: "comment1",
                        },
                    },
                },
            },
        },
    })

    const bob = await prisma.user.upsert({
        where: { id: 2 },
        update: {},
        create: {
            email: "bob@prisma.io",
            name: "Bob",
            password: "1234",
            Post: {
                create: [
                    {
                        title: "Follow Prisma on Twitter",
                        content: "https://twitter.com/prisma",
                        published: true,
                        Comment: {
                            create: {
                                content: "comment2",
                            },
                        },
                    },
                    {
                        title: "Follow Nexus on Twitter",
                        content: "https://twitter.com/nexusgql",
                        published: true,
                        Comment: {
                            create: {
                                content: "comment3",
                            },
                        },
                    },
                ],
            },
        },
    })
    console.log({ alice, bob })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
