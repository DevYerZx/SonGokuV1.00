const { getUser, addJenny, saveEco } = require("../../lib/economy")

module.exports = {
  command: ["trabajar", "work"],
  categoria: "juegos",
  descripcion: "Trabaja para ganar Jenny",

  run: async (client, m) => {
    const user = getUser(m.sender)

    const now = Date.now()
    const cooldown = 10 * 60 * 1000 // 10 minutos

    if (now - user.lastWork < cooldown) {
      const wait = Math.ceil((cooldown - (now - user.lastWork)) / 60000)
      return m.reply(`⏳ Debes esperar *${wait} minutos* para volver a trabajar.`)
    }

    const reward = Math.floor(Math.random() * 100) + 50

    // Dinero
    addJenny(m.sender, reward)

    // Misiones
    if (user.mision && !user.mision.completada) {
      user.mision.progreso += reward
    }

    // Cooldown
    user.lastWork = now

    saveEco()

    m.reply(
      `🛠️ *TRABAJO COMPLETADO*\n` +
      `━━━━━━━━━━━━━━\n` +
      `💰 +${reward} Jenny\n` +
      `⏳ Próximo trabajo en 10 min`
    )
  }
}
