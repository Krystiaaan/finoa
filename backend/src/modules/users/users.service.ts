import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { DRIZZLE, type Db } from '../../db/database.module';
import { users, userProfiles, bodyMetrics, userGoals } from '../../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import type { UpdateProfileDto } from './dto/update-profile.dto';
import type { LogWeightDto } from './dto/log-weight.dto';
import type { SetGoalDto } from './dto/set-goal.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: Db) {}

  async create(data: { name: string; email: string }) {
    const existing = await this.db.query.users.findFirst({
      where: eq(users.email, data.email),
      columns: { id: true },
    });
    if (existing) throw new ConflictException('Email already exists');

    const [row] = await this.db.insert(users).values(data).returning();
    return row;
  }

  async findAll() {
    return this.db.select().from(users).orderBy(users.id);
  }

  async findOne(id: number) {
    return this.db.query.users.findFirst({ where: eq(users.id, id) });
  }
  async upsertProfile(userId: number, dto: UpdateProfileDto) {
    const has = await this.db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, userId),
    });
    if (has) {
      const [row] = await this.db
        .update(userProfiles)
        .set({ ...dto })
        .where(eq(userProfiles.userId, userId))
        .returning();
      return row;
    }
    const [row] = await this.db
      .insert(userProfiles)
      .values({ userId, ...dto })
      .returning();
    return row;
  }
  async setGoal(userId: number, dto:SetGoalDto){
    await this.db.update(userGoals).set({isActive: false}).where(and(eq(userGoals.userId, userId), eq(userGoals.isActive, true)));
    const [row] = await this.db.insert(userGoals).values({ userId, ...dto, isActive: true }).returning();
    return row;
  }
  async logWeight(userId: number, dto: LogWeightDto) {
    const [row] = await this.db.insert(bodyMetrics).values({
      userId,
      weightKg: dto.weightKg,
      bodyFatPct: dto.bodyFatPct,
      restingHr: dto.restingHr,
      source: (dto.source ?? 'manual') as any,
      at: dto.at ? new Date(dto.at) : new Date(),
      note: dto.note,
    }).returning();
    return row;
  }
  
  async latestMetrics(userId: number) {
    const rows = await this.db.select().from(bodyMetrics)
      .where(eq(bodyMetrics.userId, userId))
      .orderBy(desc(bodyMetrics.at)) 
      .limit(1);
    return rows[0] ?? null;
  }
}
