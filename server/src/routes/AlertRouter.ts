import { Router, Request, Response } from 'express'
import { AlertService } from '../services'

export class AlertRouter {
    constructor(private alertService: AlertService) {}

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
            const result = await this.alertService.get()
            res.json(result)
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@alert/GET_ALL_FAILED' })
        }
    }

    private getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const result = await this.alertService.get(parseInt(id))
            res.json(result)
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@alert/GET_BY_ID_FAILED' })
        }
    }

    private create = async (req: Request, res: Response) => {
        try {
            const { sensorTempId, alertTypeId } = req.body
            if (!isNaN(parseInt(sensorTempId)) && !isNaN(parseInt(alertTypeId))) {
                const result = await this.alertService.create(sensorTempId, alertTypeId)
                res.json({ result })
            }
            throw new Error("@alert/INVALID_INPUT")
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@alert/CREATE_FAILED' })
        }
    }

    private update = async (req: Request, res: Response) => {
        try {
            const { id, sensorId, sensorTempId, alertTypeId } = req.body
            if (!isNaN(parseInt(id)) && !isNaN(parseInt(sensorTempId)) && !isNaN(parseInt(alertTypeId))) {
                const result = await this.alertService.update(id, sensorTempId, alertTypeId)
                res.json({ result })
            }
            throw new Error("@alert/INVALID_INPUT")
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@alert/UPDATE_FAILED' })
        }
    }
}
