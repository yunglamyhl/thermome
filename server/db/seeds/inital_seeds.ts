import * as Knex from 'knex';
import moment from 'moment';

export async function seed(knex: Knex) {
    // Deletes ALL existing entries
    await knex('alerts').del()
    await knex('sensor_temp').del()
    await knex('alert_types').del()
    await knex('sensors').del()
    await knex('shop_fridge_type_settings').del()
    await knex('fridges').del()
    await knex('fridge_types').del()
    await knex('shops').del()
    await knex('locations').del()

    const locations = await knex('locations').insert([
        { name: 'Tsuen Wan' },
        { name: 'Prince Edward' },
        { name: 'Hong Kong International Airport' },
    ]).returning(['id']);

    const shops = await knex('shops').insert([
        { name: 'StarDucks - Tsuen Wan', location_id: locations[0].id, is_active: true },
        { name: 'StarDucks - Prince Edward', location_id: locations[1].id, is_active: true },
        { name: 'StarDucks - Airport', location_id: locations[2].id, is_active: true }
    ]).returning(['id']);

    const fridgeTypes = await knex('fridge_types').insert([
        { name: 'Beverage', is_active: true },
        { name: 'Freezer', is_active: true },
    ]).returning(['id', 'name'])

    const fridges = await knex('fridges').insert([
        { name: 'FTW-B01', shop_id: shops[0].id, fridge_type_id: fridgeTypes[0].id, is_active: true },
        { name: 'FTW-B02', shop_id: shops[0].id, fridge_type_id: fridgeTypes[0].id, is_active: true },
        { name: 'FTW-F01', shop_id: shops[0].id, fridge_type_id: fridgeTypes[1].id, is_active: true },
        { name: 'FTW-F02', shop_id: shops[0].id, fridge_type_id: fridgeTypes[1].id, is_active: true },
       
        { name: 'FPE-B01', shop_id: shops[1].id, fridge_type_id: fridgeTypes[0].id, is_active: true },
        { name: 'FPE-B02', shop_id: shops[1].id, fridge_type_id: fridgeTypes[0].id, is_active: true },
        { name: 'FPE-F01', shop_id: shops[1].id, fridge_type_id: fridgeTypes[1].id, is_active: true },
        { name: 'FPE-F02', shop_id: shops[1].id, fridge_type_id: fridgeTypes[1].id, is_active: true },

        { name: 'FAP-B01', shop_id: shops[2].id, fridge_type_id: fridgeTypes[0].id, is_active: true },
        { name: 'FAP-B02', shop_id: shops[2].id, fridge_type_id: fridgeTypes[0].id, is_active: true },
        { name: 'FAP-F01', shop_id: shops[2].id, fridge_type_id: fridgeTypes[1].id, is_active: true },
        { name: 'FAP-F02', shop_id: shops[2].id, fridge_type_id: fridgeTypes[1].id, is_active: true },
    ]).returning(['id', 'fridge_type_id', 'shop_id'])

    const fridgeObj = fridges.reduce((a, fridge) => {
        const type = fridgeTypes.find((type) => type.id === fridge.fridge_type_id)
        a[fridge.id] = type ? { typeId: type.id, typeName: type.name, shopId: fridge.shop_id } : null
        return a
    }, {})

    // console.log(fridgeObj)

    const shopFridgeTypeSetting = await knex('shop_fridge_type_settings').insert([
        { shop_id: shops[0].id, fridge_type_id: fridgeTypes[0].id, min_temp: -1, max_temp: 3 },
        { shop_id: shops[0].id, fridge_type_id: fridgeTypes[1].id, min_temp: -20, max_temp: 2 },

        { shop_id: shops[1].id, fridge_type_id: fridgeTypes[0].id, min_temp: -3, max_temp: 8 },
        { shop_id: shops[1].id, fridge_type_id: fridgeTypes[1].id, min_temp: -10, max_temp: 0 },

        { shop_id: shops[2].id, fridge_type_id: fridgeTypes[0].id, min_temp: -5, max_temp: 5 },
        { shop_id: shops[2].id, fridge_type_id: fridgeTypes[1].id, min_temp: -10, max_temp: -2 },
    ]).returning(['id', 'shop_id', 'fridge_type_id', 'min_temp', 'max_temp'])

    const sensors = await knex('sensors').insert([
        { name: 'STW-01', fridge_id: fridges[0].id, is_active: true },
        { name: 'STW-02', fridge_id: fridges[1].id, is_active: true },
        { name: 'STW-03', fridge_id: fridges[2].id, is_active: true },
        { name: 'STW-04', fridge_id: fridges[3].id, is_active: true },

        { name: 'SPE-01', fridge_id: fridges[4].id, is_active: true },
        { name: 'SPE-02', fridge_id: fridges[5].id, is_active: true },
        { name: 'SPE-03', fridge_id: fridges[6].id, is_active: true },
        { name: 'SPE-04', fridge_id: fridges[7].id, is_active: true },

        { name: 'SAP-01', fridge_id: fridges[8].id, is_active: true },
        { name: 'SAP-02', fridge_id: fridges[9].id, is_active: true },
        { name: 'SAP-03', fridge_id: fridges[10].id, is_active: true },
        { name: 'SAP-04', fridge_id: fridges[11].id, is_active: true },
    ]).returning(['id', 'fridge_id'])

    const alertTypes = await knex('alert_types').insert([
        { type: 'exceeded', is_active: true },
        { type: 'below', is_active: true }
    ]).returning(['id', 'type'])

    await knex.transaction(async (trx: Knex.Transaction) => {
        for (let sensor of sensors) {
            const result = generateSensorTemp(sensor.id, fridgeObj[sensor.fridge_id].typeName === 'Beverage')
            await trx('sensor_temp').insert(result)
        }
    })

    const alertTypeObj = alertTypes.reduce((a, alert) => {
        a[alert.type] = alert.id
        return a
    }, {})

    const sensorTemps = await knex('sensor_temp').select('*')
    console.log("sensor_temp", sensorTemps.length)

    const alerts = []
    for (let sensorTemp of sensorTemps){
       
        const sensor = sensors.find((sensor) => sensor.id === sensorTemp.sensor_id)
        const { typeId, shopId } = fridgeObj[sensor.fridge_id]
        const { min_temp, max_temp } = shopFridgeTypeSetting.find((setting) => setting.shop_id === shopId && setting.fridge_type_id === typeId)

        if (parseFloat(sensorTemp.temperature) > parseFloat(max_temp)) { // exceed max temperature
            alerts.push({
                sensor_temp_id: sensorTemp.id,
                alert_type_id: alertTypeObj['exceeded']
            })
        } else if (parseFloat(sensorTemp.temperature) < parseFloat(min_temp)) { // below min temperature
            alerts.push({
                sensor_temp_id: sensorTemp.id,
                alert_type_id: alertTypeObj['below']
            })
        } 
    }

    console.log("alert", alerts.length)
    await knex.batchInsert('alerts', alerts)
    // await knex('alerts').insert(alerts)
};

const generateSensorTemp = (sensorId: number, isBeverage: boolean) => {
    const TIME_FORMAT = 'HH:mm'
    const sDate = moment('2019-09-01 00:00', 'YYYY-MM-DD HH:mm')
    const eTime = moment('2019-09-10 23:59', 'YYYY-MM-DD HH:mm')

    const sDullHour = moment('00:00', TIME_FORMAT)
    const eDullHour = moment('07:30', TIME_FORMAT)

    const sBusyHour = moment('17:00', TIME_FORMAT)
    const eBusyHour = moment('20:00', TIME_FORMAT)

    const sensorTempList= []
    for (let i = sDate.unix(); i <= eTime.unix(); i = sDate.add(60, 'minutes').unix()) {
        const currentDate = moment(i * 1000)
        const currentTime = moment(currentDate.format(TIME_FORMAT), TIME_FORMAT)

        if (currentTime.isBetween(sDullHour, eDullHour)) {
            sensorTempList.push({
                sensor_id: sensorId,
                time_slot: currentDate.toDate(),
                temperature: isBeverage ? getRandomNumber(-1, 3) : getRandomNumber(-20, 0)
            })
        } else if (currentTime.isBetween(sBusyHour, eBusyHour)) {
            sensorTempList.push({
                sensor_id: sensorId,
                time_slot: currentDate.toDate(),
                temperature: isBeverage ? getRandomNumber(0, 12) : getRandomNumber(-0, 8)
            })
        } else {
            sensorTempList.push({
                sensor_id: sensorId,
                time_slot: currentDate.toDate(),
                temperature: isBeverage ? getRandomNumber(-1, 8) : getRandomNumber(-10, 2)
            })
        }
    }

    return sensorTempList;
}

const getRandomNumber = (min: number, max: number) => { // min and max included 
    return Math.random() * (max - min + 1) + min;
}