import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema,  } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client/extension';
import { UserType } from './types/user.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';

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