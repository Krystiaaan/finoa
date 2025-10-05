import { IsOptional, IsInt, Min, Max, IsDateString, IsEnum, IsBoolean, IsString } from 'class-validator';

export enum GoalType { lose='lose', maintain='maintain', gain='gain' }
export enum Sex { male='male', female='female', other='other', }
export enum Activity { sedentary='sedentary', light='light', moderate='moderate', active='active', very_active='very_active' }
export enum Unit { metric='metric', imperial='imperial' }

export class UpdateProfileDto {
  @IsOptional() @IsInt() @Min(80) @Max(250) heightCm?: number;
  @IsOptional() @IsDateString() birthdate?: string;
  @IsOptional() @IsEnum(Sex) sex?: Sex;
  @IsOptional() @IsEnum(Activity) activityLevel?: Activity;
  @IsOptional() @IsEnum(Unit) unitSystem?: Unit;
  @IsOptional() @IsString() timezone?: string;
  @IsOptional() @IsString() locale?: string;
  @IsOptional() @IsBoolean() notifyEnabled?: boolean;
}