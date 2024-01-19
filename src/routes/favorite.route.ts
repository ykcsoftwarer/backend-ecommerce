import { Router } from "express"
import FavoriteController from "../controllers/favorite.controller"

class FavoriteRoutes {
    router = Router()
    controller = new FavoriteController()

    constructor(){
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.get('/', this.controller.getFavorites)
    }
}

export default new FavoriteRoutes().router
