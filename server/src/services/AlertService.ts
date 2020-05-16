import * as Knex from "knex";
import { IAlert } from "../models/Alert";

export class AlertService {
    private readonly TABLE_NAME = 'alerts'

    constructor(private knex: Knex) {}

    public get = async (id: number | null = null): Promise<IAlert> => {
        const queryBuilder = this.knex.select<IAlert>({
            id: "id",
            sensorTempId: "sensor_temp_id",
            alertTypeId: "alert_type_id"
        }).from(this.TABLE_NAME)

        if (id) {
            queryBuilder.where('id', id).first()
        }

        return await queryBuilder
    }

    public create = async (sensorTempId: number, alertTypeId: number): Promise<number[]> => {
        return await this.knex.insert({
            sensor_temp_id: sensorTempId,
            alert_type_id: alertTypeId
        }).into(this.TABLE_NAME).returning('id')
    }

    public update = async (id: number, sensorTempId: number, alertTypeId: number): Promise<number> => {
        return await this.knex(this.TABLE_NAME).update({
            sensor_temp_id: sensorTempId,
            alert_type_id: alertTypeId
        }).where('id', id)
    }
}
