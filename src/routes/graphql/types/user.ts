import { GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { PrismaClient } from '@prisma/client/extension';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';


export const UserType = new GraphQLObjectType({
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