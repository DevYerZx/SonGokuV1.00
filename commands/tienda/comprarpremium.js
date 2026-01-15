const { getUser, removeJenny, saveEco } = require("../../lib/economy")

module.exports = {
  command: ["comprarpremium", "buypremium"],
  categoria: "tienda",
  descripcion: "Comprar Premium Hunter",

  run: async (client, m) => {
    const user = getUser(m.sender)
    const precio = 2000

    if (user.premium) {
      return client.reply(m.chat, "👑 Ya eres *Premium Hunter*.", m)
    }

    if (user.jenny < precio) {
      return client.reply(
        m.chat,
        `❌ Jenny insuficiente\n💰 Precio: ${precio} Jenny`,
        m
      )
    }

    // Cobrar
    removeJenny(m.sender, precio)

    // Activar Premium completo
    user.premium = true
    user.bankSafe = true   // 🔐 Seguro bancario incluido
    user.dailyBonus = true

    saveEco()

    client.reply(
      m.chat,
      `
👑✨ *PREMIUM HUNTER ACTIVADO* ✨👑
━━━━━━━━━━━━━━━━━━━━━━
💎 Usuario Elite
🛡️ Seguro bancario ACTIVADO
🎵 Música y video gratis
🎮 Acceso a juegos VIP
🎁 Bonus diarios x2

🔥 *Killua reconoce tu poder*
`,
      m
    )
  }
}

