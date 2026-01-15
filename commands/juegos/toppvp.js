const fs = require("fs")
const path = require("path")
const { addJenny } = require("../../lib/economy")

const pvpPath = path.join(__dirname, "../../database/pvp.json")

const DAY = 24 * 60 * 60 * 1000
const SEASON_TIME = 30 * 24 * 60 * 60 * 1000

module.exports = {
  command: ["toppvp"],
  categoria: "juegos",

  run: async (client, m) => {
    // =========================
    // 📂 CARGAR DB
    // =========================
    if (!fs.existsSync(pvpPath)) {
      fs.writeFileSync(
        pvpPath,
        JSON.stringify(
          {
            season: 1,
            seasonStart: Date.now(),
            lastReward: 0,
            history: [],
            users: {}
          },
          null,
          2
        )
      )
    }

    const db = JSON.parse(fs.readFileSync(pvpPath))
    const now = Date.now()

    // =========================
    // 🏆 TEMPORADA PvP (RESET)
    // =========================
    if (!db.seasonStart) db.seasonStart = now

    if (now - db.seasonStart >= SEASON_TIME) {
      const finalTop = Object.entries(db.users)
        .sort((a, b) => b[1].wins - a[1].wins)
        .slice(0, 3)

      db.history.push({
        season: db.season,
        winners: finalTop,
        date: new Date().toISOString()
      })

      db.season++
      db.seasonStart = now
      db.users = {}
      db.lastReward = 0

      fs.writeFileSync(pvpPath, JSON.stringify(db, null, 2))
    }

    // =========================
    // 📦 RECOMPENSAS 24H
    // =========================
    if (now - (db.lastReward || 0) >= DAY) {
      const rewardTop = Object.entries(db.users)
        .sort((a, b) => b[1].wins - a[1].wins)
        .slice(0, 3)

      const rewards = [800, 500, 300]

      rewardTop.forEach((u, i) => {
        addJenny(u[0], rewards[i])
      })

      db.lastReward = now
      fs.writeFileSync(pvpPath, JSON.stringify(db, null, 2))
    }

    // =========================
    // 📊 MOSTRAR RANKING
    // =========================
    const users = Object.entries(db.users)

    if (!users.length) {
      return m.reply("❌ Aún no hay duelos PvP registrados.")
    }

    const ranking = users
      .sort((a, b) => b[1].wins - a[1].wins)
      .slice(0, 10)
      .map((u, i) => {
        const medal =
          i === 0 ? "🥇" :
          i === 1 ? "🥈" :
          i === 2 ? "🥉" : "🎖️"

        return `
${medal} *${i + 1}. @${u[0].split("@")[0]}*
⚔️ Victorias: ${u[1].wins}
💀 Derrotas: ${u[1].loses}
`
      })
      .join("")

    const nextReward = Math.max(0, DAY - (now - (db.lastReward || 0)))
    const hours = Math.ceil(nextReward / 3600000)

    const seasonLeft = Math.max(
      0,
      SEASON_TIME - (now - db.seasonStart)
    )
    const daysSeason = Math.ceil(seasonLeft / 86400000)

    // =========================
    // 📤 MENSAJE FINAL
    // =========================
    await client.sendMessage(
      m.chat,
      {
        text: `
🏆⚔️ *RANKING PvP — TEMPORADA ${db.season}*
━━━━━━━━━━━━━━━━━━━━
${ranking}
━━━━━━━━━━━━━━━━━━━━
📦 Recompensas automáticas cada 24h
⏳ Próxima entrega: *${hours}h*

🏁 Fin de temporada en: *${daysSeason} días*
`,
        mentions: users.map(u => u[0])
      },
      { quoted: m, ...global.channelInfo }
    )
  }
}

