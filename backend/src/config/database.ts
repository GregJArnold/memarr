import Knex from 'knex';
import { Model, knexSnakeCaseMappers } from 'objection';

const knex = Knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10
  },
  ...knexSnakeCaseMappers()
});

// Bind all Models to the knex instance
Model.knex(knex);

export default knex; 