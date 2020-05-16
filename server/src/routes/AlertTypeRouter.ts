import { Router, Request, Response } from 'express'
import { AlertTypeService } from '../services'

export class AlertTypeRouter {
    constructor(private alertTypeService: AlertTypeService) {}

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
            const result = await this.alertTypeService.get()
            res.json(result)
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@alertType/GET_ALL_FAILED' })
        }
    }

    private getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const result = await this.alertTypeService.get(parseInt(id))
            res.json(result)
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@alertType/GET_BY_ID_FAILED' })
        }
    }

    private create = async (req: Request, res: Response) => {
        try {
            const { type } = req.body
            if (type) {
                const result = await this.alertTypeService.create(type)
                res.json({ result })
            }
            throw new Error("@alertType/INVALID_INPUT")
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@alertType/CREATE_FAILED' })
        }
    }

    private update = async (req: Request, res: Response) => {
        try {
            const { id, type } = req.body
            if (!isNaN(parseInt(id)) && type) {
                const result = await this.alertTypeService.update(id, type)
                res.json({ result })
            }
            throw new Error("@alertType/INVALID_INPUT")
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@alertType/UPDATE_FAILED' })
        }
    }
}
