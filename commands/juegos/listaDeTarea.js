const { getUser } = require("../../lib/economy")

module.exports = {
  command: ["cooldowns", "cd"],
  categoria: "juegos",

  run: async (client, m) => {
    const user = getUser(m.sender)
    const now = Date.now()

    // Blindar valores que no existen
    user.lastWork ??= 0
    user.lastDaily ??= 0
    user.lastRob ??= 0

    const format = (ms) => {
      if (ms <= 0) return "✅ Listo"
      const mns = Math.ceil(ms / 60000)
      return `⏳ ${mns} min`
    }

    const workCD = 10 * 60 * 1000
    const dailyCD = 24 * 60 * 60 * 1000
    const robCD = 15 * 60 * 1000

    const text = `
🕒⏱️ *COOLDOWNS — HUNTER*
━━━━━━━━━━━━━━━━━━

🛠️ *Trabajar*
${format(workCD - (now - user.lastWork))}

🎁 *Daily*
${format(dailyCD - (now - user.lastDaily))}

🕵️ *Robar*
${format(robCD - (now - user.lastRob))}

━━━━━━━━━━━━━━━━━━
⚡ Usa tu tiempo con inteligencia
`

    m.reply(text)
  }
}
