const { getUser, addJenny, removeJenny, saveEco } = require("../../lib/economy")

module.exports = {
  command: ["duelo"],
  categoria: "juegos",

  run: async (client, m, args) => {
    const opponent = m.mentionedJid?.[0]
    const bet = parseInt(args[1])

    if (!opponent || !bet || bet < 50)
      return m.reply("⚔️ Usa: .duelo @usuario <apuesta>")

    if (opponent === m.sender)
      return m.reply("❌ No puedes retarte a ti mismo.")

    const user = getUser(m.sender)
    const enemy = getUser(opponent)

    if (user.jenny < bet || enemy.jenny < bet)
      return m.reply("❌ Ambos deben tener suficiente Jenny.")

    // 🎲 Decidir ganador
    const win = Math.random() < 0.5
    const winnerId = win ? m.sender : opponent
    const loserId = win ? opponent : m.sender

    // 💰 Transferencia
    removeJenny(loserId, bet)
    addJenny(winnerId, bet)

    // 📊 Stats PvP
    const winner = getUser(winnerId)
    const loser = getUser(loserId)

    winner.pvp ??= { wins: 0, loses: 0 }
    loser.pvp ??= { wins: 0, loses: 0 }

    winner.pvp.wins++
    loser.pvp.loses++

    // 🎯 Misiones
    if (winner.mision && !winner.mision.completada) {
      winner.mision.progreso += bet
    }

    saveEco()

    client.reply(
      m.chat,
      `
⚔️🔥 *DUELO HUNTER*
━━━━━━━━━━━━━━━━━━
🥇 Ganador: @${winnerId.split("@")[0]}
💰 Premio: +${bet} Jenny

💀 Perdedor: @${loserId.split("@")[0]}
💸 Perdió: -${bet} Jenny

📊 Récord:
🏆 ${winner.pvp.wins} | 💀 ${winner.pvp.loses}
━━━━━━━━━━━━━━━━━━
⚡ *El Nen decidió*
`,
      m,
      { mentions: [winnerId, loserId] }
    )
  }
}


