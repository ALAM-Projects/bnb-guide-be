import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GuideRepository } from './guide.repository';
import { Guide } from '@generated/prisma/client';
import { GuideDto, CreateGuideWithStructureDto } from './guide.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GuideService {
  constructor(private guideRepository: GuideRepository) {
    this.guideRepository = guideRepository;
  }

  async getMyGuides(userId: string): Promise<Guide[]> {
    try {
      const guides = await this.guideRepository.findMany({
        where: {
          userId,
        },
        include: {
          structure: true,
          restaurants: true,
          activities: true,
          supermarkets: true,
          faqs: true,
          rules: true,
          transportation: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return guides;
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async createGuide(
    data: CreateGuideWithStructureDto,
    userId: string,
  ): Promise<GuideDto> {
    try {
      // Crea la guida con la struttura in una sola transazione
      const createdGuide = await this.guideRepository.create(
        {
          title: data.guide.title,
          isActive: true,
          user: {
            connect: { id: userId },
          },
          structure: {
            create: {
              name: data.structure.name,
              address: data.structure.address,
              description: data.structure.description,
            },
          },
        },
        {
          structure: true,
          restaurants: true,
          activities: true,
          supermarkets: true,
          faqs: true,
          rules: true,
          transportation: true,
        },
      );

      return plainToInstance(GuideDto, createdGuide);
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
