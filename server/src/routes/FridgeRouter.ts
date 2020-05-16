import { Router, Request, Response } from 'express'
import { FridgeService } from '../services'

export class FridgeRouter {
    constructor(private fridgeService: FridgeService) {}

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
            const result = await this.fridgeService.get()
            res.json(result)
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@fridge/GET_ALL_FAILED' })
        }
    }

    private getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const result = await this.fridgeService.get(parseInt(id))
            res.json(result)
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@fridge/GET_BY_ID_FAILED' })
        }
    }

    private create = async (req: Request, res: Response) => {
        try {
            const { name, shopId, fridgeTypeId } = req.body
            if (name && !isNaN(parseInt(shopId)) && !isNaN(parseInt(fridgeTypeId))) {
                const result = await this.fridgeService.create(name, shopId, fridgeTypeId)
                res.json({ result })
            }
            throw new Error("@fridge/INVALID_INPUT")
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@fridge/CREATE_FAILED' })
        }
    }

    private update = async (req: Request, res: Response) => {
        try {
            const { id, name, shopId, fridgeTypeId, isActive } = req.body
            if (!isNaN(parseInt(id)) && name && !isNaN(parseInt(shopId)) && !isNaN(parseInt(fridgeTypeId))) {
                const result = await this.fridgeService.update(id, name, shopId, fridgeTypeId, isActive)
                res.json({ result })
            }
            throw new Error("@fridge/INVALID_INPUT")
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@fridge/UPDATE_FAILED' })
        }
    }
}
