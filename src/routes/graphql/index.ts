import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import { schema } from './graphqlschema.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req, reply) {
      const { query, variables } = req.body;
      const result = await graphql({
        schema,
        source: query,
        // rootValue,
        contextValue: { prisma },
        variableValues: variables,
      });
      return reply.send(result);

    },
  });
};

// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'RootQuery',
//     fields: {
//       testString: {
//         type: GraphQLString,
//         resolve: async () => {
//           return 'Hello world'
//         }
//       }
//     }
//   })
// });

export default plugin;
