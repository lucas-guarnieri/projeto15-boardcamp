import joi from "joi";

export  function validateGames(req, res, next) {
    const newGame = req.body;

    const gameSchema = joi.object({
        name: joi.string().required(),
        image: joi.string(),
        stockTotal: joi.number().min(1),
        categoryId: joi.number(),
        pricePerDay: joi.number().min(1)
    });

    const validation = gameSchema.validate(newGame);
    if(validation.error) {
        res.status(400).send(validation.error.details);
        return;
    }
    
    next();
}