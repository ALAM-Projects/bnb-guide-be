import { ApiAction } from '@/shared/decorators/api-action.decorator';
import { Body, Controller } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse } from '@nestjs/swagger';
import {
  ActivityDto,
  FaqDto,
  GuideDto,
  RestaurantDto,
  RulesDto,
  StructureDto,
  SupermarketDto,
  TransportationDto,
  CreateGuideWithStructureDto,
} from './guide.dto';
import { GetUser } from '@/shared/decorators/get-user.decorator';
import { User } from '@generated/prisma/client';
import { GuideService } from './guide.service';
import { plainToInstance } from 'class-transformer';

@ApiExtraModels(
  GuideDto,
  StructureDto,
  RestaurantDto,
  ActivityDto,
  SupermarketDto,
  FaqDto,
  RulesDto,
  TransportationDto,
  CreateGuideWithStructureDto,
)
@Controller('guide')
export class GuideController {
  constructor(private guideService: GuideService) {}

  @ApiAction('get', 'Guides', 'getMyGuides')
  @ApiOkResponse({ type: GuideDto, isArray: true })
  async getMyGuides(@GetUser() reqUser: User): Promise<GuideDto[]> {
    const guides = await this.guideService.getMyGuides(reqUser.id);
    return plainToInstance(GuideDto, guides);
  }

  @ApiAction('post', 'Guides', 'createGuide')
  @ApiOkResponse({ type: GuideDto })
  async createGuide(
    @Body() createGuideDto: CreateGuideWithStructureDto,
    @GetUser() reqUser: User,
  ): Promise<GuideDto> {
    return await this.guideService.createGuide(createGuideDto, reqUser.id);
  }
}
