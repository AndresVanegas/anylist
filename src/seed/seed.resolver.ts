import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}

  @Mutation(() => Boolean, { name: 'executeSeed', description: 'Execute the build of the data base' })
  async executeSeed(): Promise<boolean> {
    return this.seedService.executeSeed();
  }
}
