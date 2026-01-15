const { loadDB } = require("../../lib/stats")

module.exports = {
  command: ["topusers", "topuso"],
  categoria: "info",
  descripcion: "Ranking de usuarios más activos",

  run: async (client, m) => {
    const db = loadDB()

    if (!db.users) db.users = {}

    const users = Object.values(db.users)
      .filter(u => u.uses)
      .sort((a, b) => b.uses - a.uses)
      .slice(0, 10)

    if (!users.length) {
      return client.reply(m.chat, "📭 No hay estadísticas todavía.", m)
    }

    let text = `🏆 *TOP USUARIOS — KILLUA BOT*\n━━━━━━━━━━━━━━━━━━\n`

    users.forEach((u, i) => {
      const id = u.id.replace("@s.whatsapp.net", "")
      text += `
${i + 1}. @${id}
⚡ Usos: ${u.uses}
⭐ Nivel: ${u.level || 1}
`
    })

    client.reply(m.chat, text, m, {
      mentions: users.map(u => u.id)
    })
  }
}
