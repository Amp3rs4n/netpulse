// 📦 Всі необхідні залежності
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// 🔒 Middleware
app.use(cors({
  origin: "https://amp3rs4n.github.io"
}));
app.use(express.json());

// 📁 Підключення до SQLite
const db = new sqlite3.Database("results.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    ip TEXT,
    download REAL,
    upload REAL,
    ping REAL,
    jitter REAL
  )`);
});

// 📥 POST: зберегти результат
app.post("/api/results", (req, res) => {
  const { timestamp, ip, download, upload, ping, jitter } = req.body;

  db.run(
    `INSERT INTO test_results (timestamp, ip, download, upload, ping, jitter)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [timestamp, ip, download, upload, ping, jitter],
    function (err) {
      if (err) {
        console.error("❌ Insert error:", err.message);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ success: true, id: this.lastID });
    }
  );
});

// 📤 GET: отримати останні 100 результатів
app.get("/api/results", (req, res) => {
  db.all(
    "SELECT * FROM test_results ORDER BY id DESC LIMIT 100",
    (err, rows) => {
      if (err) {
        console.error("❌ Fetch error:", err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// 🔄 Для перевірки бекенда
app.get("/", (req, res) => {
  res.send("NetPulse API is running ✅");
});

// 🚀 Запуск сервера
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
