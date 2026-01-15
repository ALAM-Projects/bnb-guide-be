import { PrismaService } from '@/infrastructure/database/prisma.service';
import { Prisma } from '@generated/prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GuideRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(
    where: Prisma.GuideWhereUniqueInput,
    include?: Prisma.GuideInclude,
  ) {
    return this.prisma.guide.findUnique({
      where,
      include,
    });
  }

  async findFirst(
    where: Prisma.GuideWhereInput,
    include?: Prisma.GuideInclude,
  ) {
    return this.prisma.guide.findFirst({
      where,
      include,
    });
  }

  async findMany(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.GuideWhereUniqueInput;
    where?: Prisma.GuideWhereInput;
    orderBy?: Prisma.GuideOrderByWithRelationInput;
    include?: Prisma.GuideInclude;
  }) {
    return this.prisma.guide.findMany(params);
  }

  async create(data: Prisma.GuideCreateInput, include?: Prisma.GuideInclude) {
    return this.prisma.guide.create({
      data,
      include,
    });
  }

  async update(
    where: Prisma.GuideWhereUniqueInput,
    data: Prisma.GuideUpdateInput,
  ) {
    return this.prisma.guide.update({
      where,
      data,
    });
  }

  async upsert(
    where: Prisma.GuideWhereUniqueInput,
    create: Prisma.GuideCreateInput,
    update: Prisma.GuideUpdateInput,
  ) {
    return this.prisma.guide.upsert({
      where,
      create,
      update,
    });
  }

  async delete(where: Prisma.GuideWhereUniqueInput) {
    return this.prisma.guide.delete({
      where,
    });
  }

  async deleteMany(where: Prisma.GuideWhereInput) {
    return this.prisma.guide.deleteMany({
      where,
    });
  }

  async count(where?: Prisma.GuideWhereInput) {
    return this.prisma.guide.count({
      where,
    });
  }
}
