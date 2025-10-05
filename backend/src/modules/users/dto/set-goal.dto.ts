import { IsEnum, IsOptional, IsNumber, Min } from 'class-validator';
import { GoalType } from './update-profile.dto';

export class SetGoalDto {
  @IsEnum(GoalType) type!: GoalType;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(20) targetWeightKg?: number;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 3 }) @Min(0.1) weeklyRateKg?: number;
}