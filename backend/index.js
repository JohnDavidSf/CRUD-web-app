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

// GET all personnel
app.get("/personnel", (req, res) => {
  db.query("SELECT * FROM Personnel", (err, result) => {
    if (err) {
      console.error("Fetch personnel error:", err);
      res.status(500).json({ error: "Failed to fetch personnel" });
    } else {
      res.json(result);
    }
  });
});

// POST new personnel
app.post("/personnel", (req, res) => {
  const {
    SSN, first_name, last_name, date_of_birth, medicare_number,
    phone_number, email_address, address, city, province, postal_code, mandate
  } = req.body;

  const query = `
    INSERT INTO Personnel 
    (SSN, first_name, last_name, date_of_birth, medicare_number, 
     phone_number, email_address, address, city, province, postal_code, mandate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    SSN, first_name, last_name, date_of_birth, medicare_number,
    phone_number, email_address, address, city, province, postal_code, mandate
  ], (err, result) => {
    if (err) {
      console.error("Insert personnel error:", err);
      res.status(500).json({ error: "Failed to add personnel" });
    } else {
      res.status(201).json({ message: "Personnel added" });
    }
  });
});

// UPDATE personnel
app.put("/personnel/:id", (req, res) => {
  const id = req.params.id;
  const {
    SSN, first_name, last_name, date_of_birth, medicare_number,
    phone_number, email_address, address, city, province, postal_code, mandate
  } = req.body;

  const query = `
    UPDATE Personnel SET 
    SSN = ?, first_name = ?, last_name = ?, date_of_birth = ?, medicare_number = ?,
    phone_number = ?, email_address = ?, address = ?, city = ?, province = ?, postal_code = ?, mandate = ?
    WHERE personnel_ID = ?
  `;

  db.query(query, [
    SSN, first_name, last_name, date_of_birth, medicare_number,
    phone_number, email_address, address, city, province, postal_code, mandate,
    id
  ], (err, result) => {
    if (err) {
      console.error("Update personnel error:", err);
      res.status(500).json({ error: "Failed to update personnel" });
    } else {
      res.json({ message: "Personnel updated" });
    }
  });
});

//  DELETE personnel
app.delete("/personnel/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM Personnel WHERE personnel_ID = ?", [id], (err, result) => {
    if (err) {
      console.error("Delete personnel error:", err);
      res.status(500).json({ error: "Failed to delete personnel" });
    } else {
      res.json({ message: "Personnel deleted" });
    }
  });
});


//  GET all assignments (with names)
app.get("/worksAt", (req, res) => {
  const query = `
    SELECT w.*, 
           p.first_name AS personnel_first_name, 
           p.last_name AS personnel_last_name,
           l.name AS location_name
    FROM worksAt w
    JOIN Personnel p ON w.personnel_ID = p.personnel_ID
    JOIN Locations l ON w.location_ID = l.location_ID
    ORDER BY w.start_date DESC
  `;
  db.query(query, (err, result) => {
    if (err) {
      console.error("Fetch worksAt error:", err);
      res.status(500).json({ error: "Failed to fetch assignments" });
    } else {
      res.json(result);
    }
  });
});

// Assign personnel to a location
app.post("/worksAt", (req, res) => {
  const { personnel_ID, location_ID, start_date, end_date, role } = req.body;
  const query = `
    INSERT INTO worksAt (personnel_ID, location_ID, start_date, end_date, role)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [personnel_ID, location_ID, start_date, end_date || null, role], (err, result) => {
    if (err) {
      console.error("Insert worksAt error:", err);
      res.status(500).json({ error: "Failed to assign personnel" });
    } else {
      res.status(201).json({ message: "Assignment added" });
    }
  });
});

// Update assignment (using personnel_ID + start_date as key)
app.put("/worksAt", (req, res) => {
  const { personnel_ID, start_date, location_ID, end_date, role } = req.body;
  const query = `
    UPDATE worksAt SET 
      location_ID = ?, end_date = ?, role = ?
    WHERE personnel_ID = ? AND start_date = ?
  `;
  db.query(query, [location_ID, end_date || null, role, personnel_ID, start_date], (err, result) => {
    if (err) {
      console.error("Update worksAt error:", err);
      res.status(500).json({ error: "Failed to update assignment" });
    } else {
      res.json({ message: "Assignment updated" });
    }
  });
});

//  Delete assignment
app.delete("/worksAt", (req, res) => {
  const { personnel_ID, start_date } = req.body;
  const query = "DELETE FROM worksAt WHERE personnel_ID = ? AND start_date = ?";
  db.query(query, [personnel_ID, start_date], (err, result) => {
    if (err) {
      console.error("Delete worksAt error:", err);
      res.status(500).json({ error: "Failed to delete assignment" });
    } else {
      res.json({ message: "Assignment deleted" });
    }
  });
});

//  GET all family members
app.get("/family-members", (req, res) => {
  db.query("SELECT * FROM familymembers", (err, result) => {
    if (err) {
      console.error("Fetch family members error:", err);
      res.status(500).json({ error: "Failed to fetch family members" });
    } else {
      res.json(result);
    }
  });
});

//  POST a new family member
app.post("/family-members", (req, res) => {
  const {
    first_name, last_name, date_of_birth, SSN, medicare_number,
    phone_number, email_address, address, city, province, postal_code, location_ID
  } = req.body;

  const query = `
    INSERT INTO FamilyMembers (
      first_name, last_name, date_of_birth, SSN, medicare_number,
      phone_number, email_address, address, city, province, postal_code, location_ID
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    first_name, last_name, date_of_birth, SSN, medicare_number,
    phone_number, email_address, address, city, province, postal_code, location_ID
  ], (err, result) => {
    if (err) {
      console.error("Insert family member error:", err);
      res.status(500).json({ error: "Failed to add family member" });
    } else {
      res.status(201).json({ message: "Family member added" });
    }
  });
});

//  PUT (Update) a family member
app.put("/family-members/:id", (req, res) => {
  const id = req.params.id;
  const {
    first_name, last_name, date_of_birth, SSN, medicare_number,
    phone_number, email_address, address, city, province, postal_code, location_ID
  } = req.body;

  const query = `
    UPDATE FamilyMembers SET 
      first_name = ?, last_name = ?, date_of_birth = ?, SSN = ?, medicare_number = ?,
      phone_number = ?, email_address = ?, address = ?, city = ?, province = ?, postal_code = ?, location_ID = ?
    WHERE family_member_ID = ?
  `;

  db.query(query, [
    first_name, last_name, date_of_birth, SSN, medicare_number,
    phone_number, email_address, address, city, province, postal_code, location_ID,
    id
  ], (err, result) => {
    if (err) {
      console.error("Update family member error:", err);
      res.status(500).json({ error: "Failed to update family member" });
    } else {
      res.json({ message: "Family member updated" });
    }
  });
});

//  DELETE a family member
app.delete("/family-members/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM FamilyMembers WHERE family_member_ID = ?", [id], (err, result) => {
    if (err) {
      console.error("Delete family member error:", err);
      res.status(500).json({ error: "Failed to delete family member" });
    } else {
      res.json({ message: "Family member deleted" });
    }
  });
});


//  GET all club members
app.get("/club-members", (req, res) => {
  db.query("SELECT * FROM ClubMembers", (err, result) => {
    if (err) {
      console.error("Fetch club members error:", err);
      res.status(500).json({ error: "Failed to fetch club members" });
    } else {
      res.json(result);
    }
  });
});

//  POST a new club member
app.post("/club-members", (req, res) => {
  const {
    first_name, last_name, date_of_birth, height, weight,
    phone_number, SSN, medicare_number, address, city, province,
    postal_code, family_member_id, location_ID
  } = req.body;

  const query = `
    INSERT INTO ClubMembers (
      first_name, last_name, date_of_birth, height, weight,
      phone_number, SSN, medicare_number, address, city, province,
      postal_code, family_member_id, location_ID
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    first_name, last_name, date_of_birth, height, weight,
    phone_number, SSN, medicare_number, address, city, province,
    postal_code, family_member_id, location_ID
  ], (err, result) => {
    if (err) {
      console.error("Insert club member error:", err);
      res.status(500).json({ error: "Failed to add club member" });
    } else {
      res.status(201).json({ message: "Club member added" });
    }
  });
});

//  PUT (update) club member
app.put("/club-members/:id", (req, res) => {
  const id = req.params.id;
  const {
    first_name, last_name, date_of_birth, height, weight,
    phone_number, SSN, medicare_number, address, city, province,
    postal_code, family_member_id, location_ID
  } = req.body;

  const query = `
    UPDATE ClubMembers SET
      first_name = ?, last_name = ?, date_of_birth = ?, height = ?, weight = ?,
      phone_number = ?, SSN = ?, medicare_number = ?, address = ?, city = ?, province = ?,
      postal_code = ?, family_member_id = ?, location_ID = ?
    WHERE CMN = ?
  `;

  db.query(query, [
    first_name, last_name, date_of_birth, height, weight,
    phone_number, SSN, medicare_number, address, city, province,
    postal_code, family_member_id, location_ID, id
  ], (err, result) => {
    if (err) {
      console.error("Update club member error:", err);
      res.status(500).json({ error: "Failed to update club member" });
    } else {
      res.json({ message: "Club member updated" });
    }
  });
});

//  DELETE club member
app.delete("/club-members/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM ClubMembers WHERE CMN = ?", [id], (err, result) => {
    if (err) {
      console.error("Delete club member error:", err);
      res.status(500).json({ error: "Failed to delete club member" });
    } else {
      res.json({ message: "Club member deleted" });
    }
  });
});

//  GET all teams
app.get("/teams", (req, res) => {
  db.query("SELECT * FROM Teams", (err, result) => {
    if (err) {
      console.error("Fetch teams error:", err);
      res.status(500).json({ error: "Failed to fetch teams" });
    } else {
      res.json(result);
    }
  });
});

//  POST a new team
app.post("/teams", (req, res) => {
  const { team_name, category, location_ID } = req.body;
  db.query(
    "INSERT INTO Teams (team_name, category, location_ID) VALUES (?, ?, ?)",
    [team_name, category, location_ID],
    (err, result) => {
      if (err) {
        console.error("Insert team error:", err);
        res.status(500).json({ error: "Failed to add team" });
      } else {
        res.status(201).json({ message: "Team added" });
      }
    }
  );
});

//  UPDATE a team
app.put("/teams/:id", (req, res) => {
  const id = req.params.id;
  const { team_name, category, location_ID } = req.body;
  db.query(
    "UPDATE Teams SET team_name = ?, category = ?, location_ID = ? WHERE team_ID = ?",
    [team_name, category, location_ID, id],
    (err, result) => {
      if (err) {
        console.error("Update team error:", err);
        res.status(500).json({ error: "Failed to update team" });
      } else {
        res.json({ message: "Team updated" });
      }
    }
  );
});

//  DELETE a team
app.delete("/teams/:id", (req, res) => {
  db.query("DELETE FROM Teams WHERE team_ID = ?", [req.params.id], (err) => {
    if (err) {
      console.error("Delete team error:", err);
      res.status(500).json({ error: "Failed to delete team" });
    } else {
      res.json({ message: "Team deleted" });
    }
  });
});

//  GET all team assignments
app.get("/team-assignments", (req, res) => {
  db.query("SELECT * FROM ClubMemberTeam", (err, result) => {
    if (err) {
      console.error("Fetch assignments error:", err);
      res.status(500).json({ error: "Failed to fetch assignments" });
    } else {
      res.json(result);
    }
  });
});

//  Assign member to a team
app.post("/team-assignments", (req, res) => {
  const { CMN, team_ID, start_date, end_date } = req.body;
  db.query(
    "INSERT INTO ClubMemberTeam (CMN, team_ID, start_date, end_date) VALUES (?, ?, ?, ?)",
    [CMN, team_ID, start_date, end_date || null],
    (err, result) => {
      if (err) {
        console.error("Insert assignment error:", err);
        res.status(500).json({ error: "Failed to assign club member to team" });
      } else {
        res.status(201).json({ message: "Assignment added" });
      }
    }
  );
});

//  Update assignment
app.put("/team-assignments/:id/:date", (req, res) => {
  const { id, date } = req.params;
  const { team_ID, start_date, end_date } = req.body;

  const query = `
    UPDATE ClubMemberTeam 
    SET team_ID = ?, start_date = ?, end_date = ? 
    WHERE CMN = ? AND start_date = ?
  `;

  db.query(
    query,
    [team_ID, start_date, end_date || null, id, date],
    (err) => {
      if (err) {
        console.error("Update assignment error:", err);
        res.status(500).json({ error: "Failed to update assignment" });
      } else {
        res.json({ message: "Assignment updated" });
      }
    }
  );
});

//  Delete assignment
app.delete("/team-assignments/:id/:date", (req, res) => {
  const { id, date } = req.params;
  db.query(
    "DELETE FROM ClubMemberTeam WHERE CMN = ? AND start_date = ?",
    [id, date],
    (err) => {
      if (err) {
        console.error("Delete assignment error:", err);
        res.status(500).json({ error: "Failed to delete assignment" });
      } else {
        res.json({ message: "Assignment deleted" });
      }
    }
  );
});

app.get("/payments", (req, res) => {
  db.query("SELECT * FROM Payments", (err, result) => {
    if (err) {
      console.error("Fetch payments error:", err);
      res.status(500).json({ error: "Failed to fetch payments" });
    } else {
      res.json(result);
    }
  });
});

app.post("/payments", (req, res) => {
  const {
    family_member_ID,
    CMN,
    payment_date,
    payment_amount,
    donations,
    installment_num,
    payment_method,
    membership_payment_date
  } = req.body;

  const query = `
    INSERT INTO Payments (
      family_member_ID, CMN, payment_date,
      payment_amount, donations, installment_num,
      payment_method, membership_payment_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    family_member_ID || null,
    CMN || null,
    payment_date,
    payment_amount,
    donations || 0,
    installment_num || null,
    payment_method,
    membership_payment_date
  ], (err, result) => {
    if (err) {
      console.error("Insert payment error:", err);
      res.status(500).json({ error: "Failed to add payment" });
    } else {
      res.status(201).json({ message: "Payment added" });
    }
  });
});

app.put("/payments/:id", (req, res) => {
  const id = req.params.id;
  const {
    family_member_ID,
    CMN,
    payment_date,
    payment_amount,
    donations,
    installment_num,
    payment_method,
    membership_payment_date
  } = req.body;

  const query = `
    UPDATE Payments SET
      family_member_ID = ?, CMN = ?, payment_date = ?,
      payment_amount = ?, donations = ?, installment_num = ?,
      payment_method = ?, membership_payment_date = ?
    WHERE payment_ID = ?
  `;

  db.query(query, [
    family_member_ID || null,
    CMN || null,
    payment_date,
    payment_amount,
    donations || 0,
    installment_num || null,
    payment_method,
    membership_payment_date,
    id
  ], (err, result) => {
    if (err) {
      console.error("Update payment error:", err);
      res.status(500).json({ error: "Failed to update payment" });
    } else {
      res.json({ message: "Payment updated" });
    }
  });
});
app.delete("/payments/:id", (req, res) => {
  db.query("DELETE FROM Payments WHERE payment_ID = ?", [req.params.id], (err) => {
    if (err) {
      console.error("Delete payment error:", err);
      res.status(500).json({ error: "Failed to delete payment" });
    } else {
      res.json({ message: "Payment deleted" });
    }
  });
});
app.get("/sessions", (req, res) => {
  db.query("SELECT * FROM Sessions", (err, result) => {
    if (err) {
      console.error("Fetch sessions error:", err);
      res.status(500).json({ error: "Failed to fetch sessions" });
    } else {
      res.json(result);
    }
  });
});
app.post("/sessions", (req, res) => {
  const { personnel_id, session_date, start_time, end_time, type, address } = req.body;

  const query = `
    INSERT INTO Sessions (personnel_id, session_date, start_time, end_time, type, address)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    personnel_id || null,
    session_date,
    start_time,
    end_time,
    type,
    address
  ], (err, result) => {
    if (err) {
      console.error("Insert session error:", err);
      res.status(500).json({ error: "Failed to create session" });
    } else {
      res.status(201).json({ message: "Session created" });
    }
  });
});
app.put("/sessions/:id", (req, res) => {
  const session_id = req.params.id;
  const { personnel_id, session_date, start_time, end_time, type, address } = req.body;

  const query = `
    UPDATE Sessions SET
      personnel_id = ?, session_date = ?, start_time = ?, end_time = ?, type = ?, address = ?
    WHERE session_id = ?
  `;

  db.query(query, [
    personnel_id || null,
    session_date,
    start_time,
    end_time,
    type,
    address,
    session_id
  ], (err) => {
    if (err) {
      console.error("Update session error:", err);
      res.status(500).json({ error: "Failed to update session" });
    } else {
      res.json({ message: "Session updated" });
    }
  });
});
app.delete("/sessions/:id", (req, res) => {
  const session_id = req.params.id;

  db.query("DELETE FROM Sessions WHERE session_id = ?", [session_id], (err) => {
    if (err) {
      console.error("Delete session error:", err);
      res.status(500).json({ error: "Failed to delete session" });
    } else {
      res.json({ message: "Session deleted" });
    }
  });
});

app.get("/participations", (req, res) => {
  db.query("SELECT * FROM ParticipatesIn", (err, result) => {
    if (err) {
      console.error("Fetch participation error:", err);
      res.status(500).json({ error: "Failed to fetch participation" });
    } else {
      res.json(result);
    }
  });
});
app.post("/participations", (req, res) => {
  const { session_ID, CMN, team_ID, role } = req.body;

  const query = `
    INSERT INTO ParticipatesIn (session_ID, CMN, team_ID, role)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [session_ID, CMN, team_ID, role], (err, result) => {
    if (err) {
      console.error("Insert participation error:", err);
      res.status(500).json({ error: "Failed to add participation" });
    } else {
      res.status(201).json({ message: "Participation added" });
    }
  });
});

app.put("/participations/:session_ID/:CMN", (req, res) => {
  const { session_ID, CMN } = req.params;
  const { team_ID, role } = req.body;

  const query = `
    UPDATE ParticipatesIn SET team_ID = ?, role = ?
    WHERE session_ID = ? AND CMN = ?
  `;

  db.query(query, [team_ID, role, session_ID, CMN], (err) => {
    if (err) {
      console.error("Update participation error:", err);
      res.status(500).json({ error: "Failed to update participation" });
    } else {
      res.json({ message: "Participation updated" });
    }
  });
});
app.delete("/participations/:session_ID/:CMN", (req, res) => {
  const { session_ID, CMN } = req.params;

  db.query("DELETE FROM ParticipatesIn WHERE session_ID = ? AND CMN = ?", [session_ID, CMN], (err) => {
    if (err) {
      console.error("Delete participation error:", err);
      res.status(500).json({ error: "Failed to delete participation" });
    } else {
      res.json({ message: "Participation deleted" });
    }
  });
});
app.get("/email-logs", (req, res) => {
  const query = `
    SELECT e.*, c.CMN, c.type
    FROM EmailLog e
    LEFT JOIN ClubMemberEmails c ON e.log_ID = c.log_ID
  `;
  db.query(query, (err, result) => {
    if (err) {
      console.error("Fetch email logs error:", err);
      res.status(500).json({ error: "Failed to fetch email logs" });
    } else {
      res.json(result);
    }
  });
});
app.post("/email-logs", (req, res) => {
  const { email_date, subject, sender_email, recipient_email, preview, cc_list, CMN, type } = req.body;

  const insertEmail = `
    INSERT INTO EmailLog (email_date, subject, sender_email, recipient_email, preview, cc_list)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(insertEmail, [email_date, subject, sender_email, recipient_email, preview, cc_list], (err, result) => {
    if (err) {
      console.error("Insert email error:", err);
      return res.status(500).json({ error: "Failed to insert email" });
    }

    const log_ID = result.insertId;

    if (!CMN || !type) return res.status(201).json({ message: "Email log created without club member." });

    const linkQuery = `
      INSERT INTO ClubMemberEmails (log_ID, CMN, type)
      VALUES (?, ?, ?)
    `;

    db.query(linkQuery, [log_ID, CMN, type], (err) => {
      if (err) {
        console.error("Link club member error:", err);
        return res.status(500).json({ error: "Failed to link club member to email" });
      }

      res.status(201).json({ message: "Email log created and linked" });
    });
  });
});
app.put("/email-logs/:id", (req, res) => {
  const { id } = req.params;
  const { email_date, subject, sender_email, recipient_email, preview, cc_list } = req.body;

  const query = `
    UPDATE EmailLog SET email_date = ?, subject = ?, sender_email = ?, recipient_email = ?, preview = ?, cc_list = ?
    WHERE log_ID = ?
  `;

  db.query(query, [email_date, subject, sender_email, recipient_email, preview, cc_list, id], (err) => {
    if (err) {
      console.error("Update email log error:", err);
      res.status(500).json({ error: "Failed to update email log" });
    } else {
      res.json({ message: "Email log updated" });
    }
  });
});
app.delete("/email-logs/:id", (req, res) => {
  db.query("DELETE FROM EmailLog WHERE log_ID = ?", [req.params.id], (err) => {
    if (err) {
      console.error("Delete email log error:", err);
      res.status(500).json({ error: "Failed to delete email log" });
    } else {
      res.json({ message: "Email log deleted" });
    }
  });
});

//start server
app.listen(PORT,() => {
  console.log('Server is running on http://localhost::${PORT}');

});


