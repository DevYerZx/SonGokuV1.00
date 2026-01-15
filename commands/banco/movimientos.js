const { getHistory } = require("../../lib/economy")

module.exports = {
  command: ["movimientos", "historial"],
  categoria: "economia",

  run: async (client, m) => {
    const target =
      m.mentionedJid?.[0] ||
      m.sender

    const history = getHistory(target)

    if (!history.length) {
      return m.reply("📭 No tienes movimientos registrados aún.")
    }

    const lista = history
      .slice(0, 10)
      .map((h, i) => {
        const date = new Date(h.date).toLocaleString("es-PE")
        return `*${i + 1}.* ${h.text}\n🕒 ${date}`
      })
      .join("\n\n")

    const text = `
📒 *HISTORIAL DE MOVIMIENTOS*
━━━━━━━━━━━━━━━━━━
👤 Usuario: @${target.split("@")[0]}

${lista}

━━━━━━━━━━━━━━━━━━
📌 Mostrando últimos 10 movimientos
`

    await client.sendMessage(
      m.chat,
      {
        text,
        mentions: [target]
      },
      { quoted: m, ...global.channelInfo }
    )
  }
}
