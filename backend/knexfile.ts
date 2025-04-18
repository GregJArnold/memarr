import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/db/migrations',
      extension: 'ts'
    },
    seeds: {
      directory: './src/db/seeds',
      extension: 'ts'
    }
  },

  test: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
    migrations: {
      directory: './src/db/migrations',
      extension: 'ts'
    },
    seeds: {
      directory: './src/db/seeds',
      extension: 'ts'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/db/migrations',
      extension: 'ts'
    },
    seeds: {
      directory: './src/db/seeds',
      extension: 'ts'
    }
  }
};

export default config; 