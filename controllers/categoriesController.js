import db from "../db.js";

export async function getCategories(req, res) {
    try {
        const result = await db.query("SELECT * FROM categories");
        res.send(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send("error getting categories");
    }
}

export async function postCategories(req, res){
    const newCategorie = req.body;
    try {
        const check = await db.query(`SELECT * FROM categories WHERE name = $1;`,
        [newCategorie.name]);
        if (check.rows.length < 1){
            const result = await db.query(`
            INSERT INTO categories (name) VALUES ($1);`,
            [newCategorie.name]);
            res.sendStatus(201);
        } else {
            res.sendStatus(409);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("error registering new categorie");
    }
}