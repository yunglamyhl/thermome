import * as Knex from "knex";
import { ISensorTemp } from "../models/SensorTemp";

export class SensorTempService {
    private readonly TABLE_NAME = 'sensor_temp'

    constructor(private knex: Knex) {}

    public get = async (id: number | null = null): Promise<ISensorTemp> => {
        const queryBuilder = this.knex.select<ISensorTemp>({
            id: "id",
            sensorId: "sensor_id",
            timeSlot: "time_slot",
            temperature: "temperature"
        }).from(this.TABLE_NAME)

        if (id) {
            queryBuilder.where('id', id).first()
        }

        return await queryBuilder
    }

    public create = async (sensorId: number, timeSlot: number, temperature: number): Promise<number[]> => {
        return await this.knex.insert({
            sensor_id: sensorId,
            time_slot: timeSlot,
            temperature: temperature
        }).into(this.TABLE_NAME).returning('id')
    }

    public update = async (id: number, sensorId: number, timeSlot: number, temperature: number): Promise<number> => {
        return await this.knex(this.TABLE_NAME).update({
            sensor_id: sensorId,
            time_slot: timeSlot,
            temperature: temperature
        }).where('id', id)
    }
}
