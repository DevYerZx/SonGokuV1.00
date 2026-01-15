const { getUser, addJenny, removeJenny, saveEco } = require("../../lib/economy")

module.exports = {
  command: ["tragamonedas", "slots"],
  categoria: "juegos",

  run: async (client, m) => {
    const user = getUser(m.sender)
    const cost = 20

    if (user.jenny < cost) {
      return m.reply(`
🎰 *TRAGAMONEDAS KILLUA*
━━━━━━━━━━━━━━━━
❌ No tienes suficiente Jenny

💰 Jenny: ${user.jenny}
🎟️ Costo: ${cost}
`)
    }

    const win = Math.random() < 0.35

    if (win) {
      const reward = Math.floor(Math.random() * 60) + 40

      addJenny(m.sender, reward)

      if (user.mision && !user.mision.completada) {
        user.mision.progreso += reward
      }

      saveEco()

      return m.reply(`
🎰✨ *¡JACKPOT!*
━━━━━━━━━━━━━━━━
🎉 Ganaste la tirada

💰 +${reward} Jenny
📊 Nuevo saldo: ${getUser(m.sender).jenny}

🔥 La suerte está contigo
`)
    } else {
      removeJenny(m.sender, cost)
      saveEco()

      return m.reply(`
🎰💀 *MALA SUERTE*
━━━━━━━━━━━━━━━━
Perdiste la tirada

💰 -${cost} Jenny
📊 Nuevo saldo: ${getUser(m.sender).jenny}

⚠️ Inténtalo de nuevo
`)
    }
  }
}
