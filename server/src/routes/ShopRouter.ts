import { Router, Request, Response } from 'express'
import { ShopService } from '../services'

export class ShopRouter {
    constructor(private shopService: ShopService) {}

    public getRoutes = () => {
        const router = Router()
        // basic shop CRU
        router.get('/', this.getAll)
        router.get('/:id([0-9]*)', this.getById)
        router.post('/', this.create)
        router.put('/', this.update)

         // get fridge(s) of shop(s)
        //  router.get('/:id/fridge', this.getFridgeByShopId)
        //  router.get('/fridge', this.getAllShopFridges) 

        // // get temperature(s) of shop(s)
        // router.get('/:id/fridge/temp', this.getTempByShopId) //?from=2019-09-01&to2019-09-30
        // router.get('/fridge/temp', this.getAllShopTemp) 

        // // get alert(s) of shop(s)
        // router.get('/:id/fridge/alert', this.getAlertsByShopId)
        // router.get('/fridge/alert', this.getAllShopAlerts)

        router.get('/temp', this.getTemperatureByDateAndType)
        return router
    }

    private getAll = async (_req: Request, res: Response) => {
        try {
            const result = await this.shopService.get()
            res.json(result)
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@shop/GET_ALL_FAILED' })
        }
    }

    private getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const result = await this.shopService.get(parseInt(id))
            res.json(result)
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@shop/GET_BY_ID_FAILED' })
        }
    }

    private create = async (req: Request, res: Response) => {
        try {
            const { name, locationId } = req.body
            if (name && !isNaN(parseInt(locationId))) {
                const result = await this.shopService.create(name, locationId)
                res.json({ result })
            }
            throw new Error("@shop/INVALID_INPUT")
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@shop/CREATE_FAILED' })
        }
    }

    private update = async (req: Request, res: Response) => {
        try {
            const { id, name, locationId } = req.body
            if (!isNaN(parseInt(id)) && name && !isNaN(parseInt(locationId))) {
                const result = await this.shopService.update(id, name, locationId)
                res.json({ result })
            }
            throw new Error("@shop/INVALID_INPUT")
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@shop/UPDATE_FAILED' })
        }
    }

    private getTemperatureByDateAndType = async (req: Request, res: Response) => {
        try {
            const { date, fridgeType } = req.query
            console.log(date, fridgeType)
            const chartData = await this.shopService.getTemperatureByDateAndType(date, fridgeType)
            const minMaxTemp = await this.shopService.getMinMaxTemperature(date, fridgeType)
            res.json({ chartData, minMaxTemp })

        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@shop/GET_TEMP_BY_DATE_TYPE_FAILED' })
        }
    }
}
