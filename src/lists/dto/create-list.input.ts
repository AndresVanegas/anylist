import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateListInput {
  @Field(() => ID)
  @IsUUID()
  name: string;
}
