import joi from "joi";

export  function validateRental(req, res, next) {
    const newGame = req.body;

    const rentalSchema = joi.object({
        customerId: joi.number().required(),
        gameId: joi.number().required(),
        daysRented: joi.number().min(1)
    });

    const validation = rentalSchema.validate(newGame);
    if(validation.error) {
        res.status(400).send(validation.error.details);
        return;
    }
    
    next();
}