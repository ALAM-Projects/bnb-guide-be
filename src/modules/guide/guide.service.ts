import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GuideRepository } from './guide.repository';
import { Guide } from '@generated/prisma/client';
import { CreateGuideWithStructureDto } from './guide.dto';

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
  ): Promise<Guide> {
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

      return createdGuide;
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async getGuideById(guideId: string): Promise<Guide> {
    try {
      const guide = await this.guideRepository.findUnique(
        { id: guideId },
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
      if (!guide) {
        throw new NotFoundException('Guida non trovata');
      }
      return guide;
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
