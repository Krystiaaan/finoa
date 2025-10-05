import { Module, Provider, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import 'dotenv/config';

export const DRIZZLE = Symbol('DRIZZLE_DB');
export type Db = NodePgDatabase<typeof schema>;

@Injectable()
class DrizzleClient implements OnModuleDestroy {
  public readonly db: Db;
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(this.pool, { schema }) as Db;
  }

  async onModuleDestroy() {
    await this.pool.end().catch(() => undefined);
  }
}

const drizzleProvider: Provider = {
  provide: DRIZZLE,
  useFactory: (client: DrizzleClient) => client.db,
  inject: [DrizzleClient],
};

@Module({
  providers: [DrizzleClient, drizzleProvider],
  exports: [drizzleProvider],
})
export class DatabaseModule {}
