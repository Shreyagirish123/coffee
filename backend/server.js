require('dotenv').config();
const express=require('express');
const mysql=require('mysql2/promise');
const cors=require('cors');

const app=express();
app.use(cors());
app.use(express.json());

const pool=mysql.createPool({
 host:process.env.DB_HOST,
 user:process.env.DB_USER,
 password:process.env.DB_PASSWORD,
 database:process.env.DB_NAME
});

app.get('/api/products', async(req,res)=>{
 const [rows]=await pool.query("SELECT * FROM products");
 res.json(rows);
});

app.post('/api/products', async(req,res)=>{
 const {name,price,image_url}=req.body;
 const [r]=await pool.query("INSERT INTO products(name,price,image_url) VALUES(?,?,?)",[name,price,image_url]);
 const [prod]=await pool.query("SELECT * FROM products WHERE id=?", [r.insertId]);
 res.json(prod[0]);
});

app.put('/api/products/:id', async(req,res)=>{
 const {id}=req.params;
 const {name,price,image_url}=req.body;
 await pool.query("UPDATE products SET name=?,price=?,image_url=? WHERE id=?",[name,price,image_url,id]);
 const [prod]=await pool.query("SELECT * FROM products WHERE id=?", [id]);
 res.json(prod[0]);
});

app.delete('/api/products/:id', async(req,res)=>{
 await pool.query("DELETE FROM products WHERE id=?",[req.params.id]);
 res.json({success:true});
});

app.listen(process.env.PORT, ()=>console.log("Backend running"));
