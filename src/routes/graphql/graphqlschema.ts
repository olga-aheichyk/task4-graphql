import { GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client/extension';

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: { type: new GraphQLNonNull(UUIDType) },
		name: { type: new GraphQLNonNull(GraphQLString) },
		balance: { type: new GraphQLNonNull(GraphQLFloat) },
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
	})
});

export const schema = new GraphQLSchema({
	query: RootQuery,
});