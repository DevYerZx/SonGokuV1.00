const fs = require("fs")
const path = require("path")
const { getUser, addJenny, removeJenny, saveEco } = require("../../lib/economy")

const pvpPath = path.join(__dirname, "../../database/pvp.json")

module.exports = {
  command: ["pvp"],
  categoria: "juegos",
  isGroup: true,

  run: async (client, m, args) => {
    if (!m.mentionedJid[0])
      return m.reply("⚔️ Usa: .pvp @user <apuesta>")

    const bet = parseInt(args[1])
    if (!bet || bet < 50)
      return m.reply("💰 Apuesta mínima: 50 Jenny")

    const challenger = getUser(m.sender)
    const rivalId = m.mentionedJid[0]
    const rival = getUser(rivalId)

    if (challenger.jenny < bet || rival.jenny < bet)
      return m.reply("❌ Ambos deben tener suficiente Jenny.")

    const db = JSON.parse(fs.readFileSync(pvpPath))
    db.users[m.sender] ??= { wins: 0, loses: 0 }
    db.users[rivalId] ??= { wins: 0, loses: 0 }

    const win = Math.random() < 0.5
    const winner = win ? m.sender : rivalId
    const loser = win ? rivalId : m.sender

    removeJenny(loser, bet)
    addJenny(winner, bet)

    if (winner === m.sender && challenger.mision && !challenger.mision.completada)
      challenger.mision.progreso += bet

    if (winner === rivalId && rival.mision && !rival.mision.completada)
      rival.mision.progreso += bet

    db.users[winner].wins++
    db.users[loser].loses++

    fs.writeFileSync(pvpPath, JSON.stringify(db, null, 2))
    saveEco()

    client.reply(m.chat, `
⚔️ *ARENA KILLUA*
━━━━━━━━━━━━━━━━
🏆 Ganador: @${winner.split("@")[0]}
💀 Perdedor: @${loser.split("@")[0]}
💰 Apuesta: ${bet} Jenny

🔥 El más fuerte se impone
`, m, { mentions: [winner, loser] })
  }
}


