# hackernews-node
https://www.howtographql.com/graphql-js/0-introduction/

## Schema

Every GraphQL schema has three **root types**
1. Query
1. Mutation
1. Subscription

Fields on these root types are called **root fields**

## Resolvers

A resolver always has to be named after the corresponding field from the schema definition

Every field inside the schema definition is backed by one resolver function whose responsibility it is to return the data for precisely that field

## Prisma

### Creating Prisma binding instance

1. `yarn add prisma-binding`
2. Update instantiation of the `GraphQLServer` in `index.js`:
```javascript
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://eu1.prisma.sh/public-graytracker-771/hackernews-node/dev',
      secret: 'mysecret123',
      debug: true,
    }),
  }),
})
```
3. Import `prisma-binding` to index.js
4. Create a `.graphqlconfig` file:
```
projects:
  app:
    schemaPath: src/schema.graphql
    extensions:
      endpoints:
        default: http://localhost:4000
  database:
    schemaPath: src/generated/prisma.graphql
    extensions:
      prisma: database/prisma.yml
```
5. Download the Prisma database schema to `src/generated/prisma.graphql`
  * run `graphql get-schema --project database`
  * where `database` is the name of your folder where `prisma.yml` is
  * to make Prisma database update every time deploy changes add below to prisma.yml file:
  ```
  hooks:
  post-deploy:
    - graphql get-schema -p database
  ```
6. Run `prisma deploy`

You can import defintions from the generated schema using below syntax in .graphql files:
```
# import Link from "./generated/prisma.graphql"
```

## Running this app

1. run `node src/index.js` in one terminal
1. run `graphql playground` in another terminal

## Further info
1. `datamodel.graphql` is the data model: like mongodb Model.
1. `schema.graphql` is where you define ...
1. `prisma deploy` will update the generated database schema in `src/generated/prisma.graphql`
1. `schema.graphql` is the application schema