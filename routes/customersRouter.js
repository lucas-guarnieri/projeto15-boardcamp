import { Router } from "express";

import { getCustomers, getCustomer, postCustomers, updateCustomers } from "../controllers/customersController.js";
import { validateCustomer } from "../middlewares/customersValidator.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomer);
customersRouter.post("/customers", validateCustomer, postCustomers);
customersRouter.put("/customers/:id", validateCustomer, updateCustomers);

export default customersRouter;