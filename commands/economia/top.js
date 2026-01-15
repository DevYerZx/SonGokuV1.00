const fs = require("fs")
const path = require("path")

const ecoPath = path.join(__dirname, "../../database/economy.json")

module.exports = {
  command: ["top", "ranking"],
  categoria: "economia",
  descripcion: "Ranking de los usuarios más ricos",

  run: async (client, m) => {
    if (!fs.existsSync(ecoPath)) {
      return m.reply("❌ No hay datos económicos aún.")
    }

    const data = JSON.parse(fs.readFileSync(ecoPath))
    const users = Object.entries(data.users || {})

    if (!users.length) {
      return m.reply("❌ No hay usuarios registrados aún.")
    }

    const top = users
      .map(([id, u]) => ({
        id,
        jenny: Number(u.jenny) || 0,
        bank: Number(u.bank) || 0,
        robos: Number(u.robos) || 0,
        score: (Number(u.jenny) || 0) + (Number(u.bank) || 0)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)

    let text =
`🏆 *RANKING — KILLUA BOT*
━━━━━━━━━━━━━━━━━━
`

    top.forEach((u, i) => {
      text +=
`\n${i + 1}. @${u.id.split("@")[0]}
💰 Jenny: ${u.jenny}
🏦 Banco: ${u.bank}
🔥 Total: ${u.score}
`
    })

    await client.sendMessage(
      m.chat,
      { text, mentions: top.map(u => u.id) },
      { quoted: m }
    )
  }
}
