import db from "../db.js";
import dayjs from "dayjs";


export async function getRentals(req, res) {
    const {customerId, gameId} = req.query;

    try {
        if (customerId && gameId){
            const result = await db.query(`
                SELECT *
                FROM rentals
                JOIN customers
                ON customerId = customer.id
                JOIN games
                ON gameId = games.id
                WHERE custormerId = $1
                AND gameId = $2
            `, [customerId, gameId]);
            return res.send(result.rows);
        } else if (customerId){
            const result = await db.query(`
                SELECT *
                FROM rentals
                JOIN customers
                ON customerId = customer.id
                JOIN games
                ON gameId = games.id
                WHERE custormerId = $1
            `, [customerId]);
            return res.send(result.rows);
        } else if (gameId){
            const result = await db.query(`
                SELECT *
                FROM rentals
                JOIN customers
                ON customerId = customer.id
                JOIN games
                ON gameId = games.id
                WHERE gameId = $1
            `, [gameId]);
            return res.send(result.rows);
        } else {
            const result = await db.query(`
                SELECT *
                FROM rentals
                JOIN customers
                ON customerId = customer.id
                JOIN games
                ON gameId = games.id
            `);
            return res.send(result.rows);
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("error getting games");
    }
}

export async function postRentals(req, res) {
    const newRental = req.body;
    const today = dayjs().format("YYYY-MM-DD");
    let priceRent = null;
    let quantity = null; 
    try {
        const checkCustomer = await db.query(`
        SELECT *
        FROM customers
        WHERE id = $1
        `, [newRental.customerId]);
        if (checkCustomer.rows.length < 1) {
            return res.status(400).send("usuário não existe");
        }
        const checkGame = await db.query(`
        SELECT *
        FROM games
        WHERE id = $1
        `, [newRental.gameId]);
        if (checkGame.rows.length < 1) {
            return res.status(400).send("jogo não existe");
        } else {
            quantity = checkGame.rows[0].stockTotal;
            priceRent = checkGame.rows[0].pricePerDay*newRental.daysRented;
            
        }
        const checkAvailable = await db.query(`
            SELECT *
            FROM rentals
            WHERE "gameId" = $1
            AND "returnDate" IS NULL
        `, [newRental.gameId]);
        if (checkAvailable.rows.length >= quantity){
            return res.status(400).send("jogo não disponivel");
        }
        const result = await db.query(`
            INSERT
            INTO rentals
            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [newRental.customerId, newRental.gameId, today, newRental.daysRented, null, priceRent, null]);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.status(500).send("error creating new rental");
    }
}

export async function postRentalReturn(req, res) {
    const rentalId = req.params.id;
    try {
        const checkRental = await db.query(`
            SELECT *
            FROM rentals
            WHERE id = $1
        `, [rentalId]);
        if (checkRental.rows.length < 1){
            return res.sendStatus(404);
        };
        if (checkRental.rows[0].returnDate) {
            return res.sendStatus(400);
        };
        let endDay = dayjs().add(checkRental.rows[0].daysRented, "day").format("YYYY-MM-DD");
        let priceFee = 0;
        const today = dayjs().format("YYYY-MM-DD");
        if (Date.parse(today) > Date.parse(endDay)) {
            let dif = prazo.diff(today, "day");
            priceFee = dif*checkRental.rows[0].originalPrice;
        }

        const result = await db.query(`
            UPDATE rentals
            SET "returnDate" = $1, "delayFee" = $2
            WHERE id = $3
        `, [today, priceFee, rentalId]);
        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.status(500).send("error updating rental");
    }
}

export async function deleteRental(req, res) {
    const rentalId = req.params.id;

    try {
        const checkRental = await db.query(`
            SELECT *
            FROM rentals
            WHERE id = $1
        `, [rentalId]);
        if (checkRental.rows.length < 1){
            return res.sendStatus(404);
        };
        if (checkRental.rows[0].returnDate) {
            return res.sendStatus(400);
        };
        const result = await db.query(`
            DELETE 
            FROM rentals
            WHERE id = $1
        `, [rentalId]);
        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.status(500).send("error deleting rental");
    }
}