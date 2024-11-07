import { GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';


export const ProfileType = new GraphQLObjectType({
	name: 'Profile',
	fields: () => ({
		id: { type: new GraphQLNonNull(UUIDType) },
		isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
		yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
		userId: { type: new GraphQLNonNull(UUIDType) }
	}),
});