const { getUser, saveEco } = require("../../lib/economy")

module.exports = {
  command: ["misiones", "mission"],
  categoria: "juegos",
  descripcion: "Ver tu misión semanal",

  run: async (client, m) => {
    const user = getUser(m.sender)

    // Inicializar misión si no existe
    if (!user.mision) {
      user.mision = {
        objetivo: 500,
        progreso: 0,
        completada: false
      }
    }

    // Barra visual
    const barra = (value, max) => {
      const total = 10
      const filled = Math.min(total, Math.floor((value / max) * total))
      return "█".repeat(filled) + "░".repeat(total - filled)
    }

    // Si completó misión pero aún no se marcó
    if (user.mision.progreso >= user.mision.objetivo && !user.mision.completada) {
      user.mision.completada = true
      user.jenny += 300
      user.xp = (user.xp || 0) + 100
    }

    saveEco()

    const text = `
🎯✨ *MISIÓN SEMANAL — KILLUA BOT* ✨🎯
━━━━━━━━━━━━━━━━━━━━━━

🎯 Objetivo:
Ganar *${user.mision.objetivo} Jenny*

📊 Progreso:
${barra(user.mision.progreso, user.mision.objetivo)}
💰 ${user.mision.progreso}/${user.mision.objetivo} Jenny

🎁 Recompensa:
💰 +300 Jenny
⚡ +100 XP

Estado:
${user.mision.completada ? "✅ COMPLETADA" : "⏳ EN PROGRESO"}

━━━━━━━━━━━━━━━━━━━━━━
🔥 *Killua sigue tu evolución…*
`

    client.reply(m.chat, text, m)
  }
}
