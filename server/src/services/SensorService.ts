import * as Knex from "knex";
import { ISensor } from "../models/Sensor";

export class SensorService {
    private readonly TABLE_NAME = 'sensors'

    constructor(private knex: Knex) {}

    public get = async (id: number | null = null): Promise<ISensor> => {
        const queryBuilder = this.knex.select<ISensor>({
            id: "id",
            fridgeId: "fridge_id"
        }).from(this.TABLE_NAME)

        if (id) {
            queryBuilder.where('id', id).first()
        }

        return await queryBuilder
    }

    public create = async (name: string, fridgeId: number): Promise<number[]> => {
        return await this.knex.insert({
            name: name,
            fridge_id: fridgeId,
            is_active: true
        }).into(this.TABLE_NAME).returning('id')
    }

    public update = async (id: number, name: string, fridgeId: number, isActive: boolean = true): Promise<number> => {
        return await this.knex(this.TABLE_NAME).update({
            name: name,
            fridge_id: fridgeId,
            isActive: isActive
        }).where('id', id)
    }
}
