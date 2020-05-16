import * as Knex from "knex";
import { IAlertType } from "../models/AlertType";

export class AlertTypeService {
    private readonly TABLE_NAME = 'alert_types'

    constructor(private knex: Knex) {}

    public get = async (id: number | null = null): Promise<IAlertType> => {
        const queryBuilder = this.knex.select<IAlertType>({
            id: "id",
            type: "type"
        }).from(this.TABLE_NAME)

        if (id) {
            queryBuilder.where('id', id).first()
        }

        return await queryBuilder
    }

    public create = async (type: string): Promise<number[]> => {
        return await this.knex.insert({
            type: type
        }).into(this.TABLE_NAME).returning('id')
    }

    public update = async (id: number, type: string, isActive: boolean = true): Promise<number> => {
        return await this.knex(this.TABLE_NAME).update({
            type,
            is_active: isActive
        }).where('id', id)
    }
}
