const { getUser, saveEco } = require("../../lib/economy")

module.exports = {
  command: ["seguro"],
  categoria: "premium",
  descripcion: "Activar seguro bancario premium",

  run: async (client, m) => {
    const user = getUser(m.sender)

    // ❌ Si no es premium
    if (!user.premium) {
      return client.reply(
        m.chat,
        "❌ Solo los usuarios *Premium Hunter* pueden usar el seguro.\n🛒 Compra premium en *.shop*",
        m
      )
    }

    // Si no existe aún, créalo
    if (user.bankSafe === undefined) {
      user.bankSafe = false
    }

    // Activar seguro
    if (user.bankSafe) {
      return client.reply(
        m.chat,
        "🛡️ Tu *Seguro Bancario* ya está activo.\nTu banco está protegido al 100%.",
        m
      )
    }

    user.bankSafe = true
    saveEco()

    client.reply(
      m.chat,
      `
🛡️👑 *SEGURO BANCARIO ACTIVADO* 👑🛡️
━━━━━━━━━━━━━━━━━━━━━━

✅ Tu banco ahora está protegido
❌ Nadie podrá robarte Jenny del banco
⚡ Protección permanente

━━━━━━━━━━━━━━━━━━━━━━
🔥 *Killua protege tu fortuna*
`,
      m
    )
  }
}
