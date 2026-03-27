const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* ver stock */

app.get("/materiales", (req,res)=>{
    db.all("SELECT * FROM materiales", (err,rows)=>{
        if(err) throw err;
        res.json(rows);
    });
});

/* agregar material */

app.post("/materiales",(req,res)=>{

    const {nombre,cantidad,unidad} = req.body;

    db.run(
        "INSERT INTO materiales(nombre,cantidad,unidad) VALUES (?,?,?)",
        [nombre,cantidad,unidad],
        function(err){
            if(err){
                res.status(400).json({error:"material duplicado"});
            }else{
                res.json({id: this.lastID});
            }
        }
    );

});

/* comprar (sumar stock) */

app.put("/comprar/:id",(req,res)=>{

    const cantidad = req.body.cantidad;
    const id = req.params.id;

    db.run(
        "UPDATE materiales SET cantidad = cantidad + ? WHERE id=?",
        [cantidad,id],
        (err)=>{
            if(err) res.status(400).json({error: err.message});
            else res.json({});
        }
    );

});

/* vender (restar stock sin negativo) */

app.put("/vender/:id",(req,res)=>{

    const cantidad = req.body.cantidad;
    const id = req.params.id;

    db.get("SELECT cantidad FROM materiales WHERE id=?", [id], (err, row) => {
        if (err) {
            res.status(400).json({error: err.message});
        } else if (!row) {
            res.status(404).json({error: "material not found"});
        } else if (row.cantidad < cantidad) {
            res.status(400).json({error: "insufficient stock"});
        } else {
            db.run("UPDATE materiales SET cantidad = cantidad - ? WHERE id=?", [cantidad, id], (err) => {
                if(err) res.status(400).json({error: err.message});
                else res.json({});
            });
        }
    });

});

app.listen(3000,()=>{
    console.log("Servidor en puerto 3000");
});