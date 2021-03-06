import * as Knex from "knex";
import { IFridgeType } from "../models/FridgeType";

export class FridgeTypeService {
    private readonly TABLE_NAME = 'fridge_types'

    constructor(private knex: Knex) {}

    public get = async (id: number | null = null): Promise<IFridgeType> => {
        const queryBuilder = this.knex.select<IFridgeType>({
            id: "id",
            name: "name"
        }).from(this.TABLE_NAME)

        if (id) {
            queryBuilder.where('id', id).first()
        }

        return await queryBuilder
    }

    public create = async (name: string): Promise<number[]> => {
        return await this.knex.insert({
            name,
            is_active: true
        }).into(this.TABLE_NAME).returning('id')
    }

    public update = async (id: number, name: string, isActive: boolean = true): Promise<number> => {
        return await this.knex(this.TABLE_NAME).update({
            name,
            is_active: isActive
        }).where('id', id)
    }
}
