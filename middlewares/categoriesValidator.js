import joi from "joi";

export  function validateCategorie(req, res, next) {
    const newCategorie = req.body;

    const categorieSchema = joi.object({
        name: joi.string().required()
    });

    const validation = categorieSchema.validate(newCategorie);
    if(validation.error) {
        res.status(400).send(validation.error.details);
        return;
    }
    
    next();
}