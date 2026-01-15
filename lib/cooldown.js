const fs = require("fs")
const path = require("path")

const cdPath = path.join(__dirname, "../database/cooldowns.json")

function loadCD() {
  if (!fs.existsSync(cdPath)) {
    fs.writeFileSync(cdPath, JSON.stringify({}, null, 2))
  }
  return JSON.parse(fs.readFileSync(cdPath))
}

function saveCD(db) {
  fs.writeFileSync(cdPath, JSON.stringify(db, null, 2))
}

module.exports = function cooldown(m, command, seconds) {
  const db = loadCD()
  const key = `${m.sender}-${command}`
  const now = Date.now()

  if (db[key] && now < db[key]) {
    const wait = Math.ceil((db[key] - now) / 1000)
    m.reply(`⏳ Espera ${wait}s para usar este comando`)
    return false
  }

  db[key] = now + seconds * 1000
  saveCD(db)
  return true
}
