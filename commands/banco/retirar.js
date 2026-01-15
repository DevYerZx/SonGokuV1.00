const { getUser, removeBank, addJenny } = require("../../lib/economy")

module.exports = {
  command: ["retirar", "with"],
  categoria: "banco",
  descripcion: "Retira tu dinero del banco",

  run: async (client, m, args) => {
    const amount = Number(args[0])

    if (!args[0] || !Number.isInteger(amount) || amount <= 0) {
      return m.reply("❌ Usa: .retirar 100")
    }

    const user = getUser(m.sender)

    if (user.bank < amount) {
      return m.reply(
        `❌ Fondos insuficientes.\n\n` +
        `🏦 Banco: ${user.bank}\n` +
        `💰 Jenny: ${user.jenny}`
      )
    }

    removeBank(m.sender, amount, "Retiro del banco")
    addJenny(m.sender, amount, "Retiro del banco")

    const updated = getUser(m.sender)

    m.reply(
      `🏦 *Retiro exitoso*\n\n` +
      `➖ Retiraste: 💰 ${amount} Jenny\n\n` +
      `📊 *Nuevo saldo*\n` +
      `💰 Jenny: ${updated.jenny}\n` +
      `🏦 Banco: ${updated.bank}`
    )
  }
}
