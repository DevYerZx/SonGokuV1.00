const { getUser, addJenny, saveEco } = require("../../lib/economy")

module.exports = {
  command: ["daily"],
  categoria: "juegos",

  run: async (client, m) => {
    const user = getUser(m.sender)
    const now = Date.now()
    const cooldown = 24 * 60 * 60 * 1000

    // ⏳ Cooldown
    if (now - user.lastDaily < cooldown) {
      const wait = Math.ceil((cooldown - (now - user.lastDaily)) / 3600000)
      return m.reply(`⏳ Ya reclamaste tu recompensa.\nVuelve en *${wait} horas*.`)
    }

    const reward = 150

    // 💰 Dinero
    addJenny(m.sender, reward)

    // 🎯 Misiones
    if (user.mision && !user.mision.completada) {
      user.mision.progreso += reward
    }

    // 🕒 Cooldown
    user.lastDaily = now

    saveEco()

    m.reply(`
🎁✨ *RECOMPENSA DIARIA*
━━━━━━━━━━━━━━━━━━
💰 +${reward} Jenny
📊 Progreso de misión actualizado

🔥 ¡Vuelve mañana por más!
`)
  }
}
