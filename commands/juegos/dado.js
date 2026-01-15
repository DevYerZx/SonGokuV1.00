const { getUser, addJenny, saveEco } = require("../../lib/economy")

module.exports = {
  command: ["dado"],
  categoria: "juegos",

  run: async (client, m) => {
    const user = getUser(m.sender)
    const now = Date.now()

    const cooldown = 2 * 60 * 1000 // 2 minutos

    // ⏳ Cooldown
    if (now - (user.lastDice || 0) < cooldown) {
      const wait = Math.ceil((cooldown - (now - user.lastDice)) / 60000)
      return m.reply(`⏳ Debes esperar *${wait} min* para volver a lanzar.`)
    }

    const n = Math.floor(Math.random() * 6) + 1

    let reward = 0
    if (n === 6) reward = 80
    else if (n >= 4) reward = 40
    else reward = 10

    // 💰 Dinero
    addJenny(m.sender, reward)

    // 🎯 Misiones
    if (user.mision && !user.mision.completada) {
      user.mision.progreso += reward
    }

    // 🕒 Guardar cooldown
    user.lastDice = now
    saveEco()

    m.reply(`
🎲✨ *DADO HUNTER*
━━━━━━━━━━━━━━━━━━
🔢 Resultado: *${n}*

💰 Recompensa: +${reward} Jenny
📊 Misión actualizada

⏳ Cooldown: 2 minutos
`)
  }
}
