import { PrismaService } from '@/infrastructure/database/prisma.service';
import { Prisma } from '@generated/prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Trova un record unico tramite ID o un campo Unique (es. email).
   * Permette di includere relazioni tramite il parametro 'include'.
   */
  async findUnique(
    where: Prisma.UserWhereUniqueInput,
    include?: Prisma.UserInclude,
  ) {
    return this.prisma.user.findUnique({
      where,
      include,
    });
  }

  /**
   * Trova il primo record che soddisfa i criteri di ricerca.
   * Utile quando la ricerca non avviene su campi univoci.
   */
  async findFirst(where: Prisma.UserWhereInput, include?: Prisma.UserInclude) {
    return this.prisma.user.findFirst({
      where,
      include,
    });
  }

  /**
   * Recupera una lista di record con supporto a:
   * paginazione (skip/take), filtri (where), ordinamento (orderBy) e relazioni (include).
   */
  async findMany(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    include?: Prisma.UserInclude;
  }) {
    return this.prisma.user.findMany(params);
  }

  /**
   * Crea un nuovo record.
   * Il tipo UserCreateInput garantisce che tutti i campi obbligatori siano presenti.
   */
  async create(data: Prisma.UserCreateInput, include?: Prisma.UserInclude) {
    return this.prisma.user.create({
      data,
      include,
    });
  }

  /**
   * Aggiorna un record esistente identificato da un campo Unique.
   */
  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ) {
    return this.prisma.user.update({
      where,
      data,
    });
  }

  /**
   * "Crea o Aggiorna": se il record esiste lo aggiorna, altrimenti lo crea.
   * Estremamente utile per sincronizzazioni o profili utente.
   */
  async upsert(
    where: Prisma.UserWhereUniqueInput,
    create: Prisma.UserCreateInput,
    update: Prisma.UserUpdateInput,
  ) {
    return this.prisma.user.upsert({
      where,
      create,
      update,
    });
  }

  /**
   * Elimina un singolo record tramite un identificativo unico.
   */
  async delete(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({
      where,
    });
  }

  /**
   * Elimina più record contemporaneamente in base a un filtro.
   * Attenzione: non restituisce i record eliminati, ma solo il conteggio.
   */
  async deleteMany(where: Prisma.UserWhereInput) {
    return this.prisma.user.deleteMany({
      where,
    });
  }

  /**
   * Restituisce il numero totale di record che soddisfano un filtro.
   * Ottimo per gestire il calcolo delle pagine nel frontend.
   */
  async count(where?: Prisma.UserWhereInput) {
    return this.prisma.user.count({
      where,
    });
  }
}
