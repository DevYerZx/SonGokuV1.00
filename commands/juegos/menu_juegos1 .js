module.exports = {
  command: ["juegos"],
  categoria: "menu",
  descripcion: "Menú de juegos",

  run: async (client, m, { prefix }) => {
    const p = prefix || "."

    let lista = ""

    for (const cmd of global.comandos.values()) {
      if (cmd.categoria !== "juegos") continue
      if (!cmd.command?.length) continue

      lista += `🎮 ${p}${cmd.command[0]}\n   └ ${cmd.descripcion || "Sin descripción"}\n\n`
    }

    if (!lista) lista = "❌ No hay juegos disponibles."

    const text = `
⚡🎮 *MENÚ DE JUEGOS — KILLUA BOT* ⚡
━━━━━━━━━━━━━━━━━━
${lista}
━━━━━━━━━━━━━━━━━━
⚔️ PvP • Ruleta • Robos
`

    const buttons = [
      {
        buttonId: `${p}menu`,
        buttonText: { displayText: "🏠 Principal" },
        type: 1
      },
      {
        buttonId: `${p}menueconomia`,
        buttonText: { displayText: "💰 Economía" },
        type: 1
      },
      {
        buttonId: `${p}menubanco`,
        buttonText: { displayText: "🏦 Banco" },
        type: 1
      },
      {
        buttonId: `${p}menutienda`,
        buttonText: { displayText: "🛒 Tienda" },
        type: 1
      },
      {
        buttonId: `${p}menupremium`,
        buttonText: { displayText: "⭐ Premium" },
        type: 1
      }
    ]

    await client.sendMessage(
      m.chat,
      { text, buttons, footer: "⚡ Killua Bot • Juegos ⚡" },
      { quoted: m, ...global.channelInfo }
    )
  }
}
