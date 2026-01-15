module.exports = {
  command: ["menuowner", "menu_owner"],
  categoria: "menu",
  descripcion: "Ver el menú de comandos del dueño",

  run: async (client, m, { prefix }) => {
    const p = prefix || "."
    let lista = ""

    for (const cmd of global.comandos.values()) {
      if (cmd.categoria !== "owner") continue
      if (!cmd.command?.length) continue

      lista += `👑 ${p}${cmd.command[0]}\n   └ ${cmd.descripcion || "Solo para el dueño"}\n\n`
    }

    if (!lista) lista = "❌ No hay comandos owner registrados."

    const text = `
👑 *MENÚ OWNER — KILLUA BOT*
━━━━━━━━━━━━━━━━━━
${lista}
━━━━━━━━━━━━━━━━━━
⚠️ *NOTA*
Este menú es visible para todos.
Solo el dueño del bot puede ejecutar estos comandos.
`

    const buttons = [
      {
        buttonId: `${p}menu`,
        buttonText: { displayText: "🏠 Menú Principal" },
        type: 1
      },
      {
        buttonId: `${p}menueconomia`,
        buttonText: { displayText: "💰 Economía" },
        type: 1
      }
    ]

    await client.sendMessage(
      m.chat,
      { text, buttons, footer: "⚡ Killua Bot • Owner Commands ⚡" },
      { quoted: m, ...global.channelInfo }
    )
  }
}
