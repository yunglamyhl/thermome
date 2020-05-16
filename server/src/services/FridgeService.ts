import * as Knex from "knex";
import { IFridge } from "../models/Fridge";

export class FridgeService {
    private readonly TABLE_NAME = 'fridges'

    constructor(private knex: Knex) {}

    public get = async (id: number | null = null): Promise<IFridge> => {
        const queryBuilder = this.knex.select<IFridge>({
            id: "id",
            shopId: "shop_id",
            fridgeTypeId: "fridge_type_id"
        }).from(this.TABLE_NAME)

        if (id) {
            queryBuilder.where('id', id).first()
        }

        return await queryBuilder
    }

    public create = async (name: string, shopId: number, fridgeTypeId: number): Promise<number[]> => {
        return await this.knex.insert({
            name,
            shop_id: shopId,
            fridge_type_id: fridgeTypeId,
            is_active: true
        }).into(this.TABLE_NAME).returning('id')
    }

    public update = async (id: number, name: string, shopId: number, fridgeTypeId: number, isActive: boolean = true): Promise<number> => {
        return await this.knex(this.TABLE_NAME).update({
            name,
            shop_id: shopId,
            fridge_type_id: fridgeTypeId,
            is_active: isActive
        }).where('id', id)
    }
}
