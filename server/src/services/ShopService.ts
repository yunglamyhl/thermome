import * as Knex from "knex";
import { IShop } from "../models/Shop";
import moment from 'moment';
import joinJs from 'join-js';

export class ShopService {
    private readonly TABLE_NAME = 'shops'

    constructor(private knex: Knex) {}

    public get = async (id: number | null = null): Promise<IShop> => {
        const queryBuilder = this.knex.select<IShop>({
            id: "id",
            name: "name",
            locationId: "location_id"
        }).from(this.TABLE_NAME)

        if (id) {
            queryBuilder.where('id', id).first()
        }

        return await queryBuilder
    }

    public create = async (name: string, locationId: number): Promise<number[]> => {
        return await this.knex.insert({
            name,
            location_id: locationId
        }).into(this.TABLE_NAME).returning('id')
    }

    public update = async (id: number, name: string, locationId: number): Promise<number> => {
        return await this.knex(this.TABLE_NAME).update({
            name,
            location_id: locationId
        }).where('id', id)
    }

    public getTemperatureByDateAndType = async (date: string, fridgeType: string): Promise<any> => {
        const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm'
        const startDate = moment(`${date} 00:00`, DATE_TIME_FORMAT).format(DATE_TIME_FORMAT)
        const endDate = moment(`${date} 23:59`, DATE_TIME_FORMAT).format(DATE_TIME_FORMAT)

        const result = await this.knex
        .select({
            'name': this.knex.raw("shops.name || ', ' || fridges.name"),
            'data': this.knex.raw(`ARRAY[extract(epoch from time_slot) * 1000, temperature]`),
        })
        .from(this.TABLE_NAME)
        .innerJoin('shop_fridge_type_settings', 'shop_fridge_type_settings.shop_id', 'shops.id')
        .innerJoin('fridge_types', 'fridge_types.id', 'shop_fridge_type_settings.fridge_type_id')
        .innerJoin('fridges', function() {
            this
              .on('fridges.fridge_type_id', 'fridge_types.id')
              .on('shops.id', 'fridges.shop_id');
          })
        .innerJoin('sensors', 'sensors.fridge_id', 'fridges.id')
        .innerJoin('sensor_temp', 'sensor_temp.sensor_id', 'sensors.id')
        .whereBetween('time_slot', [startDate, endDate])
        .andWhere('fridge_types.name', fridgeType)
        .orderBy('shops.name', 'asc')
        .orderBy('fridges.name', 'asc')
        .orderBy('time_slot', 'asc')

        const shopTemps: { [key:string]: number[] } = {}
        for (let r of result) {
            if (!shopTemps[r.name]) {
                shopTemps[r.name] = []
            }
                
            shopTemps[r.name].push(r.data)
        }

        const chartData = Object.keys(shopTemps).map((key) => {
            return ({ "name": key, "data": shopTemps[key]})
        })

        return chartData
    }


    public getMinMaxTemperature = async (date: string, fridgeType: string): Promise<any> => {
        const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm'
        const startDate = moment(`${date} 00:00`, DATE_TIME_FORMAT).format(DATE_TIME_FORMAT)
        const endDate = moment(`${date} 23:59`, DATE_TIME_FORMAT).format(DATE_TIME_FORMAT)

        const result = await this.knex.select({
            'max': this.knex.raw('ceiling(max(temperature))'),
            'min': this.knex.raw('floor(min(temperature))')
        })
        .from(this.TABLE_NAME)
        .innerJoin('shop_fridge_type_settings', 'shop_fridge_type_settings.shop_id', 'shops.id')
        .innerJoin('fridge_types', 'fridge_types.id', 'shop_fridge_type_settings.fridge_type_id')
        .innerJoin('fridges', function() {
            this
              .on('fridges.fridge_type_id', 'fridge_types.id')
              .on('shops.id', 'fridges.shop_id');
          })
        .innerJoin('sensors', 'sensors.fridge_id', 'fridges.id')
        .innerJoin('sensor_temp', 'sensor_temp.sensor_id', 'sensors.id')
        .whereBetween('time_slot', [startDate, endDate])
        .andWhere('fridge_types.name', fridgeType)
        .first()

        return (result) ? { max: +result.max, min: +result.min } : null
        
    }
}
