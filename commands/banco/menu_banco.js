module.exports = {
  command: ["menubanco", "bankmenu"],
  categoria: "menu",
  descripcion: "Menú del sistema bancario",

  run: async (client, m, { prefix }) => {
    const p = prefix || "."
    let lista = ""

    for (const cmd of global.comandos.values()) {
      if (cmd.categoria !== "banco") continue
      lista += `🏦 *${p}${cmd.command[0]}*\n   └ ${cmd.descripcion || "Sin descripción"}\n\n`
    }

    if (!lista) {
      lista = "⚠️ No hay comandos bancarios registrados.\n"
    }

    const text =
`🏦 *BANCO — KILLUA BOT*
━━━━━━━━━━━━━━━━━━
${lista}
━━━━━━━━━━━━━━━━━━
💰 *Sistema financiero activo*
🔒 Datos protegidos
📈 Intereses diarios
`

    const buttons = [
      { buttonId: `${p}menueconomia`, buttonText: { displayText: "💰 Economía" }, type: 1 },
      { buttonId: `${p}menujuegos`, buttonText: { displayText: "🎮 Juegos" }, type: 1 }
    ]

    await client.sendMessage(
      m.chat,
      {
        text,
        buttons,
        footer: "⚡ Killua Bot • Sistema Bancario ⚡"
      },
      { quoted: m, ...global.channelInfo }
    )
  }
}
