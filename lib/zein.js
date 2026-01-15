const fs = require("fs")
const path = require("path")

const configPath = path.join(__dirname, "../database/config.json")

function isCoinsEnabled() {
  if (!fs.existsSync(configPath)) return true
  const cfg = JSON.parse(fs.readFileSync(configPath))
  return cfg.coinsSystem !== false
}

module.exports = { isCoinsEnabled }
