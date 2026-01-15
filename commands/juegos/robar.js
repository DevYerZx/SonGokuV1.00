const { getUser, addJenny, removeJenny, removeBank, saveEco } = require("../../lib/economy")

module.exports = {
  command: ["robar"],
  categoria: "juegos",

  run: async (client, m) => {
    const user = getUser(m.sender)
    const now = Date.now()
    const cooldown = 15 * 60 * 1000

    if (now - user.lastRob < cooldown) {
      const wait = Math.ceil((cooldown - (now - user.lastRob)) / 60000)
      return m.reply(`⏳ Espera ${wait} minutos.`)
    }

    const eco = require("../../database/economy.json")
    const victims = Object.keys(eco.users).filter(id =>
      id !== m.sender && eco.users[id].jenny >= 50 && !eco.users[id].premium
    )

    if (!victims.length) {
      user.lastRob = now
      saveEco()
      return m.reply("😕 No hay víctimas disponibles.")
    }

    const victimId = victims[Math.floor(Math.random() * victims.length)]
    const victim = getUser(victimId)

    const success = Math.random() < 0.45

    if (!success) {
      let penalty = Math.floor(Math.random() * 100) + 50

      let fromBank = Math.min(penalty, user.bank || 0)
      let fromJenny = Math.min(penalty - fromBank, user.jenny)

      if (fromBank > 0) removeBank(m.sender, fromBank)
      if (fromJenny > 0) removeJenny(m.sender, fromJenny)

      addJenny(victimId, fromBank + fromJenny)

      user.lastRob = now
      saveEco()

      return m.reply(`
🚓 *ROBO FALLIDO*
━━━━━━━━━━━━━━━━
💸 Multa pagada a @${victimId.split("@")[0]}
🏦 Banco: -${fromBank}
💰 Jenny: -${fromJenny}
`, { mentions: [victimId] })
    }

    const stolen = Math.min(100 + Math.floor(Math.random() * 100), victim.jenny)

    removeJenny(victimId, stolen)
    addJenny(m.sender, stolen)

    if (user.mision && !user.mision.completada)
      user.mision.progreso += stolen

    user.robos++
    user.lastRob = now
    saveEco()

    m.reply(`
🕵️ *ROBO EXITOSO*
━━━━━━━━━━━━━━━━
💰 Robaste: ${stolen} Jenny
👤 Víctima: @${victimId.split("@")[0]}

🔥 Nadie vio nada...
`, { mentions: [victimId] })
  }
}

