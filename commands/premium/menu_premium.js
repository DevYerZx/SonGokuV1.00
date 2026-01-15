module.exports = {
  command: ["menupremium"],
  categoria: "menu",
  descripcion: "Menú premium",

  run: async (client, m, { prefix }) => {
    const p = prefix || "."

    let lista = ""

    for (const cmd of global.comandos.values()) {
      if (cmd.categoria !== "premium") continue
      lista += `⭐ ${p}${cmd.command[0]}\n   └ ${cmd.descripcion || "Premium"}\n\n`
    }

    const text = `
⭐ *MENÚ PREMIUM — KILLUA BOT*
━━━━━━━━━━━━━━━━━━
${lista}
━━━━━━━━━━━━━━━━━━
✨ Beneficios exclusivos
`

    await client.sendMessage(
      m.chat,
      { text, footer: "⚡ Killua Bot • Premium ⚡" },
      { quoted: m, ...global.channelInfo }
    )
  }
}
