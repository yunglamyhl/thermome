import express from 'express';
import Knex from 'knex';
import { config } from 'dotenv';
import * as bodyparser from 'body-parser';
import cors from 'cors';
import {
    ShopService, LocationService,
    SensorService, SensorTempService,
    FridgeService, FridgeTypeService,
    AlertService, AlertTypeService
} from './services';
import {
    ShopRouter, LocationRouter,
    SensorRouter, SensorTempRouter,
    FridgeRouter, FridgeTypeRouter,
    AlertRouter, AlertTypeRouter
} from './routes';

config();
const { NODE_ENV } = process.env;

const knexConfig = require('../knexfile');
const knex = Knex(knexConfig[NODE_ENV || 'development'])

const shopService = new ShopService(knex);
const shopRouter = new ShopRouter(shopService);

const locationService = new LocationService(knex);
const locationRouter = new LocationRouter(locationService);

const fridgeService = new FridgeService(knex);
const fridgeRouter = new FridgeRouter(fridgeService);

const fridgeTypeService = new FridgeTypeService(knex);
const fridgeTypeRouter = new FridgeTypeRouter(fridgeTypeService);

const fridgeRoutes = fridgeRouter.getRoutes()
const fridgeTypeRoutes = fridgeRoutes.use('/type', fridgeTypeRouter.getRoutes())

const sensorService = new SensorService(knex);
const sensorRouter = new SensorRouter(sensorService);

const sensorTempService = new SensorTempService(knex);
const sensorTempRouter = new SensorTempRouter(sensorTempService);

const sensorRoutes = sensorRouter.getRoutes()
const sensorTempRoutes = sensorRoutes.use('/temp', sensorTempRouter.getRoutes())

const alertService = new AlertService(knex);
const alertRouter = new AlertRouter(alertService);

const alertTypeService = new AlertTypeService(knex);
const alertTypeRouter = new AlertTypeRouter(alertTypeService);

const alertRoutes = alertRouter.getRoutes()
const alertTypeRoutes = alertRoutes.use('/type', alertTypeRouter.getRoutes())

// express
const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors())

app.use('/shop', shopRouter.getRoutes());
app.use('/location', locationRouter.getRoutes());
app.use('/fridge', fridgeTypeRoutes);
app.use('/sensor', sensorTempRoutes);
app.use('/alert', alertTypeRoutes);

export { app }
