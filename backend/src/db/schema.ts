import {
  pgTable, serial, integer, varchar, timestamp, date, numeric, boolean, jsonb,
  uniqueIndex, index, pgEnum
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const goalEnum = pgEnum('goal_enum', ['lose', 'maintain', 'gain']);
export const sexEnum = pgEnum('sex_enum', ['male', 'female', 'other']);
export const activityEnum = pgEnum('activity_enum', ['sedentary','light','moderate','active','very_active']);
export const unitEnum = pgEnum('unit_enum', ['metric','imperial']);
export const sourceEnum = pgEnum('metric_source_enum', ['manual','device']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userProfiles = pgTable('user_profiles', {
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  heightCm: integer('height_cm'),
  weightKg: numeric('weight_kg', { precision: 5, scale: 2 }),
  birthDate: date('birth_date'),
  sex: sexEnum('sex'),
  activityLevel: activityEnum('activity_level').default('sedentary').notNull(),
  unitSystem: unitEnum('unit_system').default('metric').notNull(),
  timezone: varchar('timezone', { length: 128 }),
  locale: varchar('locale', { length: 16 }),
  notifyEnabled: boolean('notify_enabled').default(true).notNull(),
  notifyPrefs: jsonb('notify_prefs')
    .$type<{ steps: boolean; meals: boolean; workouts: boolean; tips: boolean }>()
    .default({ steps: true, meals: true, workouts: true, tips: true }),
  aiAvatarSeed: varchar('ai_avatar_seed', { length: 128 }),
});

export const userGoals = pgTable('user_goals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: goalEnum('type').notNull(),
  targetWeightKg: numeric('target_weight_kg', { precision: 5, scale: 2, mode: 'number' }),
  weeklyRateKg: numeric('weekly_rate_kg', { precision: 4, scale: 3, mode: 'number' }),
  startDate: date('start_date').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull(),
}, (t) => [
  uniqueIndex('user_active_goal_idx').on(t.userId, t.isActive),
]);

export const bodyMetrics = pgTable('body_metrics', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  at: timestamp('at').defaultNow().notNull(),
  weightKg: numeric('weight_kg', { precision: 5, scale: 2, mode: 'number' }),
  bodyFatPct: numeric('body_fat_pct', { precision: 5, scale: 2, mode: 'number' }),
  restingHr: integer('resting_hr'),
  source: sourceEnum('source').default('manual').notNull(),
  note: varchar('note', { length: 256 }),
}, (t) => [
  index('body_metrics_user_at_idx').on(t.userId, t.at),
]);


export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, { fields: [users.id], references: [userProfiles.userId] }),
  goals: many(userGoals),
  metrics: many(bodyMetrics),
}));
