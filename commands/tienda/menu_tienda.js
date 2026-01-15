module.exports = {
  command: ["menutienda", "tienda"],
  categoria: "menu",
  descripcion: "Menú de la tienda",

  run: async (client, m, { prefix }) => {
    const p = prefix || "."

    let lista = ""

    for (const cmd of global.comandos.values()) {
      if (cmd.categoria !== "tienda") continue
      if (!cmd.command?.length) continue

      lista += `🛒 ${p}${cmd.command[0]}\n   └ ${cmd.descripcion || "Sin descripción"}\n\n`
    }

    if (!lista) lista = "❌ No hay comandos en la tienda."

    const text = `
🛒 *MENÚ TIENDA — KILLUA BOT*
━━━━━━━━━━━━━━━━━━
${lista}
━━━━━━━━━━━━━━━━━━
🎨 Títulos • Insignias • Ítems PvP
`

    const buttons = [
      {
        buttonId: `${p}menujuegos`,
        buttonText: { displayText: "🎮 Juegos" },
        type: 1
      },
      {
        buttonId: `${p}menueconomia`,
        buttonText: { displayText: "💰 Economía" },
        type: 1
      },
      {
        buttonId: `${p}menupremium`,
        buttonText: { displayText: "⭐ Premium" },
        type: 1
      },
      {
        buttonId: `${p}menu`,
        buttonText: { displayText: "🏠 Principal" },
        type: 1
      }
    ]

    await client.sendMessage(
      m.chat,
      { text, buttons, footer: "⚡ Killua Bot • Tienda ⚡" },
      { quoted: m, ...global.channelInfo }
    )
  }
}
