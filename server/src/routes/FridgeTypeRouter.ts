import { Router, Request, Response } from 'express'
import { FridgeTypeService } from '../services'

export class FridgeTypeRouter {
    constructor(private fridgeTypeService: FridgeTypeService) {}

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
            const result = await this.fridgeTypeService.get()
            res.json(result)
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@fridgeType/GET_ALL_FAILED' })
        }
    }

    private getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            if (!isNaN(parseInt(id))) {
                const result = await this.fridgeTypeService.get(parseInt(id))
                res.json({ result })
            }
            throw new Error("@fridgeType/INVALID_INPUT")
        } catch(e) {
            // console.error(e.message)
            res.status(400).json({ msg: '@fridgeType/GET_BY_ID_FAILED' })
        }
    }

    private create = async (req: Request, res: Response) => {
        try {
            const { name } = req.body
            if (name) {
                const result = await this.fridgeTypeService.create(name)
                res.json({ result })
            }
            throw new Error("@fridgeType/INVALID_INPUT")
        } catch(e) {
            // console.error(e)
            res.status(400).json({ msg: '@fridgeType/CREATE_FAILED' })
        }
    }

    private update = async (req: Request, res: Response) => {
        try {
            const { id, name, shopId, fridgeTypeId, isActive } = req.body
            if (!isNaN(parseInt(id)) && name && !isNaN(parseInt(shopId)) && !isNaN(parseInt(fridgeTypeId))) {
                const result = await this.fridgeTypeService.update(id, name, isActive)
                res.json({ result })
            }
            throw new Error("@fridgeType/INVALID_INPUT")
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@fridgeType/UPDATE_FAILED' })
        }
    }
}
