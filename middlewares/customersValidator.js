import joi from "joi";
import Regex from "regex";

export  function validateCustomer(req, res, next) {
    const newCustomer = req.body;

    const customerSchema = joi.object({
        name: joi.string().required(),
        phone: joi.string().min(10).max(11).required(),
        cpf: joi.string().length(11).required(),
        birthday: joi.date().iso().required(),
    });

    const validation = customerSchema.validate(newCustomer);
    if(validation.error) {
        res.status(400).send(validation.error.details);
        return;
    }
    
    next();
}