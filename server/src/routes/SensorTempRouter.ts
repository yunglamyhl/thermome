import { Router, Request, Response } from 'express'
import { SensorTempService } from '../services'

export class SensorTempRouter {
    constructor(private sensorTempService: SensorTempService) {}

    public getRoutes = () => {
        const router = Router()
        router.get('/', this.getAll)
        router.get('/:id([0-9]*)', this.getById)
        router.post('/', this.create)
        router.put('/', this.update)
        return router
    }

    private getAll = async (_req: Request, res: Response) => {
        try {
            const result = await this.sensorTempService.get()
            res.json(result)
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@sensorTemp/GET_ALL_FAILED' })
        }
    }

    private getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const result = await this.sensorTempService.get(parseInt(id))
            res.json(result)
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@sensorTemp/GET_BY_ID_FAILED' })
        }
    }

    private create = async (req: Request, res: Response) => {
        try {
            const { sensorId, timeSlot, temperature } = req.body
            if (!isNaN(parseInt(sensorId)) && !isNaN(parseInt(timeSlot)) && !isNaN(parseInt(temperature))) {
                const result = await this.sensorTempService.create(sensorId, timeSlot, temperature)
                res.json({ result })
            }
            throw new Error("@sensorTemp/INVALID_INPUT")
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@sensorTemp/CREATE_FAILED' })
        }
    }

    private update = async (req: Request, res: Response) => {
        try {
            const { id, sensorId, timeSlot, temperature } = req.body
            if (!isNaN(parseInt(id)) && !isNaN(parseInt(sensorId)) && !isNaN(parseInt(timeSlot)) && !isNaN(parseInt(temperature))) {
                const result = await this.sensorTempService.update(id, sensorId, timeSlot, temperature)
                res.json({ result })
            }
            throw new Error("@sensorTemp/INVALID_INPUT")
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@sensorTemp/UPDATE_FAILED' })
        }
    }
}
