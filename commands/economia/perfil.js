const { getUser } = require("../../lib/economy")

module.exports = {
  command: ["perfil", "profile"],
  categoria: "economia",
  descripcion: "Ver tu perfil económico",

  run: async (client, m) => {
    const user = getUser(m.sender)

    const text =
`👤✨ *PERFIL — KILLUA BOT* ✨👤
━━━━━━━━━━━━━━━━━━━━━━

🆔 Usuario:
@${m.sender.split("@")[0]}

💰 *Economía*
• Jenny: ${user.jenny}
• Banco: ${user.bank}
• Premium: ${user.premium ? "✅ Activo" : "❌ No"}

🎯 *Progreso*
• Nivel: ${user.level}
• XP: ${user.xp}

🕵️ *Actividad*
• Robos: ${user.robos}
• Último work: ${user.lastWork ? new Date(user.lastWork).toLocaleDateString("es-PE") : "—"}
• Último daily: ${user.lastDaily ? new Date(user.lastDaily).toLocaleDateString("es-PE") : "—"}

━━━━━━━━━━━━━━━━━━━━━━
⚡ *Killua monitorea tu progreso…*
`

    await client.sendMessage(
      m.chat,
      { text, mentions: [m.sender] },
      { quoted: m }
    )
  }
}
