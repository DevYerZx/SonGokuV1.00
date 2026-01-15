const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../database/stats.json");

function loadDB() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({
      users: {},
      commands: {},
      totalCommands: 0
    }, null, 2));
  }
  return JSON.parse(fs.readFileSync(dbPath));
}

function saveDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function registerUse(sender, command) {
  const db = loadDB();

  // TOTAL comandos
  db.totalCommands++;

  // USUARIOS
  if (!db.users[sender]) {
    db.users[sender] = {
      id: sender,
      uses: 1,
      firstSeen: Date.now(),
      xp: 0,        // 🔥 listo para juegos
      level: 1      // 🔥 listo para juegos
    };
  } else {
    db.users[sender].uses++;
  }

  // XP FUTURA (juegos)
  db.users[sender].xp += 5;

  // COMANDOS
  if (!db.commands[command]) {
    db.commands[command] = 1;
  } else {
    db.commands[command]++;
  }

  saveDB(db);
}

module.exports = {
  registerUse,
  loadDB
};
