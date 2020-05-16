import { Router, Request, Response } from 'express'
import { SensorService } from '../services'

export class SensorRouter {
    constructor(private sensorService: SensorService) {}

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
            const result = await this.sensorService.get()
            res.json(result)
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@sensor/GET_ALL_FAILED' })
        }
    }

    private getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const result = await this.sensorService.get(parseInt(id))
            res.json(result)
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@sensor/GET_BY_ID_FAILED' })
        }
    }

    private create = async (req: Request, res: Response) => {
        try {
            const { name, fridgeId } = req.body
            if (!isNaN(parseInt(fridgeId)) && name) {
                const result = await this.sensorService.create(name, fridgeId)
                res.json({ result })
            }
            throw new Error("@sensor/INVALID_INPUT")
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@sensor/CREATE_FAILED' })
        }
    }

    private update = async (req: Request, res: Response) => {
        try {
            const { id, name, fridgeId, isActive } = req.body
            if (!isNaN(parseInt(id)) && name && !isNaN(parseInt(fridgeId))) {
                const result = await this.sensorService.update(id, name, fridgeId, isActive)
                res.json({ result })
            }
            throw new Error("@sensor/INVALID_INPUT")
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@sensor/UPDATE_FAILED' })
        }
    }
}
