import * as Knex from "knex";
import { ILocation } from "../models/Location";

export class LocationService {
    private readonly TABLE_NAME = 'locations'

    constructor(private knex: Knex) {}

    public get = async (id: number | null = null): Promise<ILocation> => {
        const queryBuilder = this.knex.select<ILocation>({
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
            name
        }).into(this.TABLE_NAME).returning('id')
    }

    public update = async (id: number, name: string): Promise<number> => {
        return await this.knex(this.TABLE_NAME).update({
            name
        }).where('id', id)
    }
}
