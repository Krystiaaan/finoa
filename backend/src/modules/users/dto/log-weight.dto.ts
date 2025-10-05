import { IsNumber, Min, IsOptional, IsDateString, IsEnum, IsString } from 'class-validator';

export enum MetricSource { manual='manual', device='device' }

export class LogWeightDto {
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(20) weightKg!: number;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(1) bodyFatPct?: number;
  @IsOptional() @IsNumber() @Min(20) restingHr?: number;
  @IsOptional() @IsDateString() at?: string;
  @IsOptional() @IsEnum(MetricSource) source?: MetricSource;
  @IsOptional() @IsString() note?: string;
}