const fs = require("fs")
const path = require("path")
const { addJenny, addHistory, getUser } = require("../../lib/economy")

const pvpPath = path.join(__dirname, "../../database/pvp.json")

module.exports = {
  command: ["pvpweekly"],
  categoria: "owner",
  isOwner: true,

  run: async (client, m) => {

    // Crear archivo si no existe
    if (!fs.existsSync(pvpPath)) {
      fs.writeFileSync(
        pvpPath,
        JSON.stringify({ lastWeekly: 0, users: {} }, null, 2)
      )
    }

    const db = JSON.parse(fs.readFileSync(pvpPath))

    const now = Date.now()
    const WEEK = 7 * 24 * 60 * 60 * 1000

    if (now - db.lastWeekly < WEEK) {
      const left = Math.ceil((WEEK - (now - db.lastWeekly)) / 86400000)
      return m.reply(`⏳ Aún faltan *${left} días* para las recompensas PvP.`)
    }

    const ranking = Object.entries(db.users)
      .sort((a, b) => (b[1].wins || 0) - (a[1].wins || 0))
      .slice(0, 3)

    if (!ranking.length) {
      return m.reply("❌ No hubo batallas PvP esta semana.")
    }

    const rewards = [1000, 700, 400]
    let text = `
📦🏆 *RECOMPENSAS PvP — KILLUA*
━━━━━━━━━━━━━━━━━━
`

    ranking.forEach(([id, data], i) => {
      const reward = rewards[i]
      getUser(id)
      addJenny(id, reward)
      addHistory(id, `🏆 Recompensa PvP semanal (${["🥇","🥈","🥉"][i]}) +${reward} Jenny`)

      text += `
${["🥇","🥈","🥉"][i]} @${id.split("@")[0]}
💰 +${reward} Jenny
`
    })

    db.lastWeekly = now
    fs.writeFileSync(pvpPath, JSON.stringify(db, null, 2))

    client.sendMessage(
      m.chat,
      { text, mentions: ranking.map(u => u[0]) },
      { quoted: m, ...global.channelInfo }
    )
  }
}

