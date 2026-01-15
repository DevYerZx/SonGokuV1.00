const { getUser } = require("../../lib/economy")

module.exports = {
  command: ["balance", "bal", "money"],
  categoria: "economia",
  descripcion: "Ver tu dinero y estado premium",

  run: async (client, m) => {
    const user = getUser(m.sender)

    m.reply(
      `💰 *ECONOMÍA — KILLUA BOT*\n` +
      `━━━━━━━━━━━━━━━━━━\n\n` +
      `👤 Usuario: @${m.sender.split("@")[0]}\n\n` +
      `💰 Jenny: ${user.jenny}\n` +
      `🏦 Banco: ${user.bank}\n` +
      `👑 Premium: ${user.premium ? "✅ Activo" : "❌ No"}\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `⚡ Killua protege tu dinero`,
      { mentions: [m.sender] }
    )
  }
}
