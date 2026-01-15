module.exports = {
  command: ["menueconomia", "economiamenu"],
  categoria: "menu",
  descripcion: "Menú del sistema económico",

  run: async (client, m, { prefix }) => {
    const p = prefix || "."
    let lista = ""

    for (const cmd of global.comandos.values()) {
      if (cmd.categoria !== "economia") continue
      lista += `💰 *${p}${cmd.command[0]}*\n   └ ${cmd.descripcion || "Sin descripción"}\n\n`
    }

    if (!lista) lista = "⚠️ No hay comandos económicos registrados.\n"

    const text =
`💰 *ECONOMÍA — KILLUA BOT*
━━━━━━━━━━━━━━━━━━
${lista}
━━━━━━━━━━━━━━━━━━
💸 Moneda oficial: *Jenny*
`

    const buttons = [
      { buttonId: `${p}menujuegos`, buttonText: { displayText: "🎮 Juegos" }, type: 1 },
      { buttonId: `${p}menubanco`, buttonText: { displayText: "🏦 Banco" }, type: 1 },
      { buttonId: `${p}menutienda`, buttonText: { displayText: "🛒 Tienda" }, type: 1 }
    ]

    await client.sendMessage(
      m.chat,
      { text, buttons, footer: "⚡ Killua Bot • Economía ⚡" },
      { quoted: m, ...global.channelInfo }
    )
  }
}
