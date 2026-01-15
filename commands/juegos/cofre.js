const { getUser, addJenny, saveEco } = require("../../lib/economy")

module.exports = {
  command: ["cofre", "abrircofre"],
  categoria: "juegos",

  run: async (client, m) => {
    const user = getUser(m.sender)
    const now = Date.now()

    const cooldown = 30 * 60 * 1000 // 30 minutos

    // ⏳ Cooldown
    if (now - (user.lastChest || 0) < cooldown) {
      const wait = Math.ceil((cooldown - (now - user.lastChest)) / 60000)
      return m.reply(`⏳ Debes esperar *${wait} min* para abrir otro cofre.`)
    }

    const rewards = [
      { name: "Común", jenny: 100, chance: 0.5, emoji: "📦" },
      { name: "Raro", jenny: 300, chance: 0.3, emoji: "🔷" },
      { name: "Épico", jenny: 700, chance: 0.15, emoji: "🟣" },
      { name: "Legendario", jenny: 1500, chance: 0.05, emoji: "👑" }
    ]

    let roll = Math.random()
    let acc = 0
    let reward

    for (const r of rewards) {
      acc += r.chance
      if (roll <= acc) {
        reward = r
        break
      }
    }

    // 💰 Dinero
    addJenny(m.sender, reward.jenny)

    // 🎯 Misiones
    if (user.mision && !user.mision.completada) {
      user.mision.progreso += reward.jenny
    }

    // 🕒 Cooldown
    user.lastChest = now
    saveEco()

    client.reply(
      m.chat,
      `
${reward.emoji}✨ *COFRE ${reward.name.toUpperCase()}* ✨
━━━━━━━━━━━━━━━━━━
💰 Recompensa: +${reward.jenny} Jenny
🎲 Rareza: ${reward.name}

📊 Misión actualizada
⏳ Próximo cofre: 30 min
━━━━━━━━━━━━━━━━━━
🔥 *La suerte sonríe al Hunter*
`,
      m
    )
  }
}
