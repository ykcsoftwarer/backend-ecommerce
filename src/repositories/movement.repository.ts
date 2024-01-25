import Movement from "../models/movement.model"

interface IMovementRepository {
    row(productId: number): Promise<Movement | null>;
    list(userId: number): Promise<Array<Movement>>;
    basket(userId: number): Promise<Array<Movement>>;
    payHeaderInsert(userId: number, total: number, tax: number): Promise<Number>;
    payRowUpdate(userId: number, payId: number): Promise<Number>;
    insert(
        productId: number,
        userId: number,
        processType: string,
        price: number,
        discountPrice: number,
        quantity: number,
        tax: number,
        total: number,
        description: string
    ): Promise<Movement | null>;
}

class MovementRepository implements IMovementRepository {
    async row(productId: number): Promise<Movement | null> {
        console.log(productId);

        return await Movement.findOne({ where: { productId: productId } })
    }
    async list(userId: number): Promise<Array<Movement>> {
        try {
            return await Movement.findAll({ where: { userId } })
        } catch (error) {
            throw new Error("Couldn't find")
        }
    }
    async basket(userId: number): Promise<Array<Movement>> {
        try {
            return await Movement.findAll({ where: { userId, process_type: 'basket' } })
        } catch (error) {
            throw new Error("Couldn't find")
        }
    }
    async payHeaderInsert(userId: number, total: number, tax: number): Promise<number> {
      return Movement.create({
            userId, processType: "pay", tax, total, description: "Ödeme işlemi yapıldı"
        }).then((res) => {
            return res.dataValues.id
        }).catch(() => {
            return 0
        })
    }

    async payRowUpdate(userId: number, payId: number): Promise<number> {
        return Movement.update(
            { movementId: payId, type: false, processType: 'pay' }, 
            { where: { userId: userId, processType: 'basket' } })
            .then((res) => {
                return res[0]
            })
            .catch((error) => {
                return 0
            })
    }
    async insert(
        productId: number,
        userId: number,
        processType: string,
        price: number,
        discountPrice: number,
        quantity: number,
        tax: number,
        total: number,
        description: string
    ): Promise<Movement | null> {
        try {
            return Movement.create({
                productId, userId, processType, price, discountPrice, quantity, tax, total, description
            })
        } catch (error) {
            throw new Error("error")
        }
    }
}

export default new MovementRepository()