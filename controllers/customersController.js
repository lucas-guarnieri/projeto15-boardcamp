import db from "../db.js";
import dayjs from "dayjs";

export async function getCustomers(req, res) {
    const selectedCustomer = req.query.cpf;
    try {
        if (!selectedCustomer){
            const result = await db.query(`
                SELECT *
                FROM customers
            `);
            res.send(result.rows);
        } else {
            const result = await db.query(`
                SELECT *
                FROM customers
                WHERE cpf LIKE $1;
            `, [ selectedCustomer + '%' ]);
            res.send(result.rows);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("error getting user(s)");
    }
};

export async function getCustomer(req, res) {
    const customerId = req.params.id;
    try {
        const result = await db.query(`
            SELECT *
            FROM customers
            WHERE id = $1
        `, [ customerId ]);
        res.send(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send("error getting user");
    }
};

export async function postCustomers(req, res){
    const updatedCustomer = req.body;
    try {
        const check = await db.query(`
            SELECT * 
            FROM customers 
            WHERE cpf = $1;
        `, [updatedCustomer.cpf]);
        if (check.rows.length < 1){
            await db.query(`
            INSERT 
            INTO customers (name, phone, cpf, birthday) 
            VALUES ($1, $2, $3, $4);`,
            [updatedCustomer.name, updatedCustomer.phone, updatedCustomer.cpf, updatedCustomer.birthday]);
            res.sendStatus(201);
        } else {
            res.sendStatus(409);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("error registering new user");
    }
}

export async function updateCustomers(req, res){
    const updatedCustomer = req.body;
    const customerId = req.params.id;
    try {
        const check = await db.query(`
            SELECT * 
            FROM customers 
            WHERE id = $1;
        `, [customerId]);
        if (check.rows.length > 0){
            await db.query(`
            UPDATE customers 
            SET name = $1, phone = $2, cpf = $3, birthday = $4 
            WHERE id = $5;`,
            [updatedCustomer.name, updatedCustomer.phone, updatedCustomer.cpf, updatedCustomer.birthday, customerId]);
            res.sendStatus(201);
        } else {
            res.sendStatus(409);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("error updating user");
    }
}