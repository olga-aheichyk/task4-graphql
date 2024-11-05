import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client/extension';

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: { type: new GraphQLNonNull(UUIDType) },
		name: { type: new GraphQLNonNull(GraphQLString) },
		balance: { type: new GraphQLNonNull(GraphQLFloat) },
		posts: {
			type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
			resolve: async (obj, args, { prisma }: { prisma: PrismaClient }) => {
				return await prisma.post.findMany({ where: { authorId: obj.id } })
			},
		},
		profile: {
			type: ProfileType,
			resolve: async (obj, args, { prisma }: { prisma: PrismaClient }) => {
				return await prisma.profile.findUnique({ where: { userId: obj.id } })
			},
		}
	}),
});

const PostType = new GraphQLObjectType({
	name: 'Post',
	fields: () => ({
		id: { type: new GraphQLNonNull(UUIDType) },
		title: { type: new GraphQLNonNull(GraphQLString) },
		content: { type: new GraphQLNonNull(GraphQLString) },
		authorId: { type: new GraphQLNonNull(UUIDType) }
	}),
});

const ProfileType = new GraphQLObjectType({
	name: 'Profile',
	fields: () => ({
		id: { type: new GraphQLNonNull(UUIDType) },
		isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
		yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
		userId: { type: new GraphQLNonNull(UUIDType) }
	}),
});

const RootQuery: GraphQLObjectType = new GraphQLObjectType({
	name: 'RootQuery',
	fields: () => ({
		user: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(UUIDType) },
			},
			resolve: async (_, args, { prisma }: { prisma: PrismaClient }) => {
				return await prisma.user.findUnique({ where: { id: args.id }})
			},
		},
		users: {
			type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
			resolve: async (_, args, { prisma }: { prisma: PrismaClient }) => {
				return await prisma.user.findMany()
			},
		},
		post: {
			type: PostType,
			args: {
				id: { type: new GraphQLNonNull(UUIDType) },
			},
			resolve: async (_, args, { prisma }: { prisma: PrismaClient }) => {
				return await prisma.post.findUnique({ where: { id: args.id } })
			},
		},
		posts: {
			type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
			resolve: async (_, args, { prisma }: { prisma: PrismaClient }) => {
				return await prisma.post.findMany();
			},
		},
		profile: {
			type: ProfileType,
			args: {
				id: { type: new GraphQLNonNull(UUIDType) },
			},
			resolve: async (_, args, { prisma }: { prisma: PrismaClient }) => {
				return await prisma.profile.findUnique({ where: { id: args.id } })
			},
		},
		profiles: {
			type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
			resolve: async (_, args, { prisma }: { prisma: PrismaClient }) => {
				return await prisma.profile.findMany();
			},
		},
	})
});

export const schema = new GraphQLSchema({
	query: RootQuery,
});