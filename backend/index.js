const express = require("express");
const mysql = require("mysql2");
const cors= require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// sql connection setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "MYVC"

});

//test connection
db.connect((err) => {
  if(err) {
    console.error("DB connection failed", err);
    
  }else{
    console.log("Connected to MySQL Database!");
  }
});

//create GET /locations API
app.get("/locations", (req, res)=> {
  const query = "SELECT * FROM Locations";
  db.query(query, (err, result)=>{
    if (err){
      console.error("Failed to fetch locations", err);
      res.status(500).json({error: "DB error"});

    }else{
      res.json(result);
    }
  });
});

app.post("/locations", (req, res) => {
  const {
    name,
    type,
    address,
    city,
    province,
    postal_code,
    phone_number,
    web_address,
    max_capacity,
  } = req.body;

  const query = `
    INSERT INTO Locations 
    (name, type, address, city, province, postal_code, phone_number, web_address, max_capacity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [name, type, address, city, province, postal_code, phone_number, web_address, max_capacity],
    (err, result) => {
      if (err) {
        console.error("Error inserting location:", err);
        res.status(500).json({ error: "Insert failed" });
      } else {
        res.status(201).json({ message: "Location added successfully!" });
      }
    }
  );
});

app.put("/locations/:id", (req, res) => {
  const id = req.params.id;
  const {
    name,
    type,
    address,
    city,
    province,
    postal_code,
    phone_number,
    web_address,
    max_capacity,
  } = req.body;

  const query = `
    UPDATE Locations SET
      name = ?, type = ?, address = ?, city = ?, province = ?, 
      postal_code = ?, phone_number = ?, web_address = ?, max_capacity = ?
    WHERE location_ID = ?
  `;

  db.query(
    query,
    [name, type, address, city, province, postal_code, phone_number, web_address, max_capacity, id],
    (err, result) => {
      if (err) {
        console.error("Error updating location:", err);
        res.status(500).json({ error: "Update failed" });
      } else {
        res.json({ message: "Location updated successfully" });
      }
    }
  );
});

//  DELETE location
app.delete("/locations/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM Locations WHERE location_ID = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting location:", err);
      res.status(500).json({ error: "Delete failed" });
    } else {
      res.json({ message: "Location deleted successfully" });
    }
  });
});



//start server
app.listen(PORT,() => {
  console.log('Server is running on http://localhost::${PORT}');

});


