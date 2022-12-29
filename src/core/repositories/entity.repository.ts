import { Document, FilterQuery, Model, QueryOptions } from 'mongoose';

export abstract class EntityRepository<T extends Document> {
  constructor(private entityModel: Model<T>) {}

  async save<D>(data: D): Promise<T> {
    return await new this.entityModel(data).save();
  }

  async find(
    query: FilterQuery<T>,
    projection?: Record<string, unknown>,
    options?: QueryOptions,
  ): Promise<T[]> {
    return await this.entityModel.find(query, projection, options);
  }

  async findById(id: string): Promise<T | null> {
    return await this.entityModel.findById(id);
  }

  async findOne(
    query: FilterQuery<T>,
    projection?: Record<string, unknown>,
    options?: QueryOptions,
  ): Promise<T | null> {
    return await this.entityModel.findOne(query, projection, options);
  }

  async findOneAndUpdate(
    query: FilterQuery<T>,
    update: Record<string, unknown>,
    options: QueryOptions,
  ): Promise<T | null> {
    return await this.entityModel.findOneAndUpdate(query, update, {
      ...options,
      new: true,
    });
  }

  async findOneAndDelete(
    query: FilterQuery<T>,
    options: QueryOptions,
  ): Promise<T | null> {
    return await this.entityModel.findOneAndDelete(query, {
      ...options,
    });
  }
}
