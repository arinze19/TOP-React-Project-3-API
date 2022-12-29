import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// export type UserDocument = HydratedDocument<User>; // keeps User model in sync with Document type-wise;
export type UserDocument = Document & User;

export enum Role {
  ADMIN = 'Admin',
  PLAYER = 'Player',
}

@Schema() // marks the class as a schema definition
export class User {
  @Prop()
  _id?: string;

  @Prop({ required: true }) // substitute for object in nodejs object when creating model
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  country: string;

  @Prop({ default: 0 })
  score: number;

  @Prop({ default: Role.PLAYER })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
