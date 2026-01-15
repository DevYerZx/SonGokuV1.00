const fs = require("fs")
const path = require("path")

const ecoPath = path.join(__dirname, "../../database/economy.json")

module.exports = {
  command: ["toprobos", "rankingrobos"],
  categoria: "economia",
  descripcion: "Ranking de los usuarios con más robos",

  run: async (client, m) => {
    if (!fs.existsSync(ecoPath)) {
      return m.reply("❌ No hay datos económicos aún.")
    }

    const data = JSON.parse(fs.readFileSync(ecoPath))
    const users = Object.values(data.users || {})

    if (!users.length) {
      return m.reply("❌ No hay usuarios registrados aún.")
    }

    const top = users
      .filter(u => Number(u.robos) > 0)
      .sort((a, b) => Number(b.robos) - Number(a.robos))
      .slice(0, 10)

    if (!top.length) {
      return m.reply("😕 Nadie ha robado todavía.")
    }

    let text =
`🏆🕵️ *RANKING DE ROBOS — KILLUA BOT*
━━━━━━━━━━━━━━━━━━
`

    top.forEach((u, i) => {
      text += `\n${i + 1}️⃣ @${u.id.split("@")[0]} — 🕵️ ${u.robos}`
    })

    text += `
━━━━━━━━━━━━━━━━━━
🔥 *Los ladrones más temidos*
`

    await client.sendMessage(
      m.chat,
      { text, mentions: top.map(u => u.id) },
      { quoted: m }
    )
  }
}
