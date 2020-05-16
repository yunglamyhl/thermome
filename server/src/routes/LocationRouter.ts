import { Router, Request, Response } from 'express'
import { LocationService } from '../services'

export class LocationRouter {
    constructor(private locationService: LocationService) {}

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
            const result = await this.locationService.get()
            res.json(result)
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@location/GET_ALL_FAILED' })
        }
    }

    private getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const result = await this.locationService.get(parseInt(id))
            res.json(result)
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@location/GET_BY_ID_FAILED' })
        }
    }

    private create = async (req: Request, res: Response) => {
        try {
            const { name } = req.body
            if (name) {
                const result = await this.locationService.create(name)
                res.json({ result })
            }
            throw new Error("@location/INVALID_INPUT")
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@location/CREATE_FAILED' })
        }
    }

    private update = async (req: Request, res: Response) => {
        try {
            const { id, name } = req.body
            if (!isNaN(parseInt(id)) && name) {
                const result = await this.locationService.update(id, name)
                res.json({ result })
            }
            throw new Error("@location/INVALID_INPUT")
        } catch(e) {
            console.error(e)
            res.status(400).json({ msg: '@location/UPDATE_FAILED' })
        }
    }
}
