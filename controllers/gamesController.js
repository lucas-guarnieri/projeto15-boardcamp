import db from "../db.js";

export async function getGames(req, res) {
    const selectedName = req.query.name;
    try {
        if (!selectedName){
            const result = await db.query(`
                SELECT games.*, categories.name as "categoryName" 
                FROM games 
                JOIN categories 
                ON games."categoryId" = categories.id;
            `);
            res.send(result.rows);
        } else {
            await db.query(`
                SELECT games.*, categories.name as "categoryName" 
                FROM games 
                JOIN categories 
                ON games."categoryId" = categories.id;
            `);
            const result = await db.query(`
                SELECT *
                FROM games
                WHERE upper(name) LIKE upper($1);
            `, [selectedName + '%']);
            res.send(result.rows);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("error getting games");
    }
}

export async function postGames(req, res){
    const newGame = req.body;
    try {
        const idCheck = await db.query(`
            SELECT *
            FROM categories
            WHERE id = $1
        `, [newGame.categoryId]);
        if (idCheck.rows.length < 1) {
            res.status(400).send("Non existing category");
            return;
        }

        const nameCheck = await db.query(`
            SELECT * 
            FROM games 
            WHERE name = $1;
        `,[newGame.name]);
        if (nameCheck.rows.length < 1){
            const result = await db.query(`
            INSERT 
            INTO games (name, "image", "stockTotal", "categoryId", "pricePerDay") 
            VALUES ($1, $2, $3, $4, $5);`,
            [newGame.name, newGame.image, newGame.stockTotal, newGame.categoryId, newGame.pricePerDay]);
            res.sendStatus(201);
        } else {
            res.sendStatus(409);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("error creating new game");
    }
}