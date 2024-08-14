import mysql from "mysql2";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3003;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Veritabanı bağlantısı
const connection = mysql.createConnection({
  host: "sql8.freemysqlhosting.net",
  user: "sql8725721",
  password: "PKvdhyrlUE",
  database: "sql8725721",
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error("Veritabanına bağlanırken hata oluştu:", err);
    return;
  }
  console.log("Veritabanına başarıyla bağlanıldı!");
});
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend uygulamanızın URL'si
    methods: ["GET", "POST", "PUT", "DELETE"], // İzin verilen HTTP metodları
    allowedHeaders: ["Content-Type", "Authorization"], // İzin verilen başlıklar
  })
);
// Ürünleri listeleme
app.get("/products", (req, res) => {
  connection.query("SELECT * FROM products", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});
// CORS ayarlarını yapılandırın

// Ürün ekleme
app.post("/products", (req, res) => {
  const { product_name, price, product_desc } = req.body;
  connection.query(
    "INSERT INTO products (product_name, price, product_desc) VALUES (?, ?, ?)",
    [product_name, price, product_desc],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res
        .status(201)
        .json({ id: results.insertId, product_name, price, product_desc });
    }
  );
});

// Ürün güncelleme
app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { product_name, price, product_desc } = req.body;
  connection.query(
    "UPDATE products SET product_name = ?, price = ?, product_desc = ? WHERE id = ?",
    [product_name, price, product_desc, id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ message: "Ürün bulunamadı" });
        return;
      }
      res.json({ id, product_name, price, product_desc });
    }
  );
});

// Ürün silme
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "DELETE FROM products WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ message: "Ürün bulunamadı" });
        return;
      }
      res.status(204).end();
    }
  );
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor.`);
});
