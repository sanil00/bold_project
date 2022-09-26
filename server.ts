

const  { ApolloServer, gql } = require ("apollo-server")
const { PrismaClient } = require("@prisma/client")
const client = new PrismaClient()

const typeDefs = gql`
    type User {
        id: ID
        email: String
        password: String
        name: String
        Posts: [Post]
        createdAt: DateTime
    }

    type Post {
        id: ID
        title: String
        content: String
        published: Boolean
        authorId: User
        createdAt: DateTime
        Comments : [Comment]
    }
    type Comment {
        id: ID
        content: String
        postId: Post
        createdAt: DateTime
    }
    type Query {
        selectUser: User
        selectPost: Post
        selectComment: Comment
    }

    type Mutation {
        createUser(email: String, password: String, name: String): User
        createPost(title: String, content: String, published: String, userId: ID): Post
        createComment(content: String, postId: ID): Comment
    }
    scalar DateTime
`

interface User { 
    email : string
    password : string
    name : string
}

interface Post {
    userId: string 
    title : string
    content : string
    published : boolean
}

interface Comment {
    postId: string
    content: string
}

const resolvers = {
    Query: {
        async selectUser():Promise<User|null> {
            const selectUser = await client.user.findMany({
                where: {
                    published:true,
                    posts: {
                        select: {
                          published: true,
                        },
                      },
                },
            })
            return selectUser
        },
        async selectPost(_:any, { userId }:Post):Promise<Post|null> {
            const selectPost = await client.user.findMany({
                where: {
                    id: parseInt(userId),
                    content: {
                        contains:'graphql'
                    }
                },
            })
            return selectPost
        },
        async selectComment(_:any, { postId }:Comment):Promise<Comment|null> {
            const selectPost = await client.user.findMany({
                where: {
                    id: parseInt(postId),
                },
            })
            return selectPost
        },
    },
    Mutation: {
        async createUser(_:any,{ name, password, email }:User) {
            const createUser = await client.user.create({
                data: {
                    name,
                    email,
                    password,
                },
                include: {
                    Post: true,
                },
            })
            return createUser
        },
        async createPost(_:any, { title, content, published, userId }:Post) {
            const createPost = await client.post.create({
                data: {
                    title,
                    content,
                    published,
                    authorId: parseInt(userId),
                },
            })
            return createPost
        },
        async createComment(_:any, { postId, content }:Comment) {
            const createPost = await client.post.create({
                data: {
                    content,
                    authorId: parseInt(postId),
                },
            })
            return createPost
        },
    },
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }:any) => {
    console.log(`Runing on ${url}`)
})
