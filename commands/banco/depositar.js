const { getUser, removeJenny, addBank } = require("../../lib/economy")

module.exports = {
  command: ["depositar", "dep"],
  categoria: "economy",
  descripcion: "Deposita tu Jenny al banco",

  run: async (client, m, args) => {
    const amount = Number(args[0])

    if (!args[0] || !Number.isInteger(amount) || amount <= 0) {
      return m.reply("❌ Usa: .depositar 100")
    }

    const user = getUser(m.sender)

    if (user.jenny < amount) {
      return m.reply(
        `❌ No tienes suficiente dinero.\n\n` +
        `💰 Jenny: ${user.jenny}\n` +
        `🏦 Banco: ${user.bank}`
      )
    }

    removeJenny(m.sender, amount)
    addBank(m.sender, amount)

    const updated = getUser(m.sender)

    m.reply(
      `🏦 *Depósito exitoso*\n\n` +
      `➕ Depositaste: 💰 ${amount} Jenny\n\n` +
      `📊 *Nuevo saldo*\n` +
      `💰 Jenny: ${updated.jenny}\n` +
      `🏦 Banco: ${updated.bank}`
    )
  }
}
