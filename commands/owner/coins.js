const fs = require("fs")
const path = require("path")

const configPath = path.join(__dirname, "../../database/config.json")

function getConfig() {
  if (!fs.existsSync(configPath)) {
    const base = { coinsSystem: true }
    fs.writeFileSync(configPath, JSON.stringify(base, null, 2))
    return base
  }
  return JSON.parse(fs.readFileSync(configPath))
}

function saveConfig(cfg) {
  fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2))
}

module.exports = {
  command: ["coins"],
  categoria: "owner",
  isOwner: true,
  descripcion: "Activar o desactivar el sistema de economía",

  run: async (client, m, args) => {
    const cfg = getConfig()

    if (!args[0]) {
      return m.reply(
        `⚙️ *SISTEMA DE ECONOMÍA*\n\n` +
        `Estado: ${cfg.coinsSystem ? "✅ ACTIVO" : "❌ DESACTIVADO"}\n\n` +
        `Usa:\n` +
        `.coins on\n` +
        `.coins off`
      )
    }

    if (args[0].toLowerCase() === "on") {
      cfg.coinsSystem = true
      saveConfig(cfg)
      return m.reply("✅ Sistema de economía ACTIVADO")
    }

    if (args[0].toLowerCase() === "off") {
      cfg.coinsSystem = false
      saveConfig(cfg)
      return m.reply("❌ Sistema de economía DESACTIVADO")
    }

    return m.reply("❌ Usa: .coins on / off")
  }
}
