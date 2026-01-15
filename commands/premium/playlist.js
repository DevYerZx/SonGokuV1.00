const { getUser } = require("../../lib/economy")
const fs = require("fs")
const path = require("path")

const configPath = path.join(__dirname, "../../database/config.json")

module.exports = {
  command: ["playlist"],
  categoria: "premium",
  descripcion: "Playlists exclusivas Premium",

  run: async (client, m) => {

    // Asegurar que el sistema existe
    let config = { coinsSystem: true }
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath))
    }

    if (!config.coinsSystem) {
      return client.reply(
        m.chat,
        "⚠️ El sistema económico está desactivado.",
        m
      )
    }

    const user = getUser(m.sender)

    // Blindaje anti crash
    if (!user || typeof user !== "object") {
      return client.reply(m.chat, "❌ Error de perfil económico.", m)
    }

    if (!user.premium) {
      return client.reply(
        m.chat,
        `
🚫 *ACCESO PREMIUM*
━━━━━━━━━━━━━━━
Este contenido es exclusivo para *Premium Hunters*.

🛒 Usa *.shop* para comprar Premium
👑 Beneficios:
• Música sin límite
• Sin cooldown
• Contenido exclusivo
`,
        m
      )
    }

    const text = `
🎵👑 *PLAYLIST PREMIUM — KILLUA BOT* 👑🎵
━━━━━━━━━━━━━━━━━━

🎧 .play lofi
🎧 .play anime openings
🎧 .play chillstep
🎧 .play phonk
🎧 .play nightcore

━━━━━━━━━━━━━━━━━━
⚡ Sin cooldown
🎶 Sin anuncios
👑 Solo Premium
`

    client.reply(m.chat, text, m)
  }
}
