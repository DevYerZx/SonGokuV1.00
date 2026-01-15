const fs = require("fs")
const path = require("path")

const statsPath = path.join(__dirname, "../database/stats.json")
const configPath = path.join(__dirname, "../database/config.json")

module.exports = function checkCoins(m, cost) {
  const db = JSON.parse(fs.readFileSync(statsPath))
  const config = JSON.parse(fs.readFileSync(configPath))

  // Si el sistema está desactivado → gratis
  if (!config.coinsSystem) return true

  const user = db.users[m.sender]
  if (!user) return false

  if (user.money < cost) {
    m.reply(`
💸 *MONEDAS INSUFICIENTES*
━━━━━━━━━━━━━━━━
💰 Necesitas: ${cost}
💸 Tienes: ${user.money}

🎮 Juega para ganar monedas
`)
    return false
  }

  // Descontar
  user.money -= cost
  fs.writeFileSync(statsPath, JSON.stringify(db, null, 2))

  return true
}
