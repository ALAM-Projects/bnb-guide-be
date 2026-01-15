import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RestaurantType, TransportationType } from '@generated/prisma/client';

export class StructureDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string | null;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}

export class RestaurantDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  link: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address: string | null;

  @ApiPropertyOptional({ enum: RestaurantType })
  @IsOptional()
  @IsEnum(RestaurantType)
  type: RestaurantType | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string | null;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}

export class ActivityDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  price: number | null;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}

export class SupermarketDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string | null;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}

export class FaqDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty()
  @IsString()
  answer: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}

export class RulesDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}

export class TransportationDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ enum: TransportationType })
  @IsEnum(TransportationType)
  type: TransportationType;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}

export class GuideDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  structureId: string;

  @ApiProperty({ type: () => StructureDto })
  structure: StructureDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  checkInRules: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  checkOutRules: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wifiName: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wifiPassword: string | null;

  @ApiProperty({ type: [RestaurantDto] })
  @IsArray()
  restaurants: RestaurantDto[];

  @ApiProperty({ type: [ActivityDto] })
  @IsArray()
  activities: ActivityDto[];

  @ApiProperty({ type: [SupermarketDto] })
  @IsArray()
  supermarkets: SupermarketDto[];

  @ApiProperty({ type: [FaqDto] })
  @IsArray()
  faqs: FaqDto[];

  @ApiProperty({ type: [RulesDto] })
  @IsArray()
  rules: RulesDto[];

  @ApiProperty({ type: [TransportationDto] })
  @IsArray()
  transportation: TransportationDto[];

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;

  constructor(partial: Partial<GuideDto>) {
    Object.assign(this, partial);
  }
}

// DTO per la creazione di struttura (senza campi generati)
export class CreateStructureDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string | null;
}

// DTO per la creazione di guida (solo campi base)
export class CreateGuideDataDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string | null;
}

// DTO principale per creare guida con struttura
export class CreateGuideWithStructureDto {
  @ApiProperty({ type: CreateStructureDto })
  structure: CreateStructureDto;

  @ApiProperty({ type: CreateGuideDataDto })
  guide: CreateGuideDataDto;
}
