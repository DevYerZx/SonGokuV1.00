const fs = require("fs")
const path = require("path")

const dbPath = path.join(__dirname, "../../database/stats.json")

function safeDB() {
  return {
    total: 0,
    users: {},
    commands: {},
    groups: {}
  }
}

function loadDB() {
  if (!fs.existsSync(dbPath)) {
    const init = safeDB()
    fs.writeFileSync(dbPath, JSON.stringify(init, null, 2))
    return init
  }

  let db
  try {
    db = JSON.parse(fs.readFileSync(dbPath))
  } catch {
    db = safeDB()
  }

  // 🔒 BLINDAJE TOTAL
  if (typeof db.total !== "number") db.total = 0
  if (!db.users || typeof db.users !== "object") db.users = {}
  if (!db.commands || typeof db.commands !== "object") db.commands = {}
  if (!db.groups || typeof db.groups !== "object") db.groups = {}

  return db
}

function saveDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
}

function registerUse(sender, command, from, isGroup, pushName, onFirstUse) {
  const db = loadDB()

  // ===== TOTAL =====
  db.total++

  const number = sender.split("@")[0]

  // ===== USUARIO =====
  if (!db.users[sender]) {
    db.users[sender] = {
      id: sender,
      number,
      name: pushName || "Sin nombre",
      uses: 1,
      xp: 5,
      level: 1,
      firstSeen: Date.now()
    }

    if (typeof onFirstUse === "function") {
      onFirstUse({
        id: sender,
        number,
        name: pushName || "Sin nombre"
      })
    }
  } else {
    db.users[sender].uses++
    db.users[sender].xp += 5
  }

  // ===== COMANDO =====
  db.commands[command] = (db.commands[command] || 0) + 1

  // ===== GRUPO (PROTEGIDO) =====
  if (isGroup === true && typeof from === "string") {
    if (!db.groups[from]) {
      db.groups[from] = {
        id: from,
        uses: 1,
        firstSeen: Date.now()
      }
    } else {
      db.groups[from].uses++
    }
  }

  saveDB(db)
}

module.exports = {
  registerUse,
  loadDB
}
