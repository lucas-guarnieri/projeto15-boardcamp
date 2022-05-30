import { Router } from "express";

import { getRentals, postRentals, postRentalReturn, deleteRental } from "../controllers/rentalsController.js";
import { validateRental } from "../middlewares/rentalsValidator.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateRental, postRentals);
rentalsRouter.post("/rentals/:id/return", postRentalReturn);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;