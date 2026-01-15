const { getUser } = require("../../lib/economy")

module.exports = {
  command: ["banco", "bank"],
  categoria: "economy",
  descripcion: "Muestra tu dinero y tu banco",

  run: async (client, m) => {
    const user = getUser(m.sender)

    const text = `
🏦💰 *BANCO HUNTER*
━━━━━━━━━━━━━━━━
👤 Usuario: @${m.sender.split("@")[0]}

💰 Jenny: ${user.jenny}
🏦 Banco: ${user.bank}
👑 Premium: ${user.premium ? "Sí" : "No"}

━━━━━━━━━━━━━━━━
`

    client.sendMessage(
      m.chat,
      { text, mentions: [m.sender] },
      { quoted: m }
    )
  }
}
