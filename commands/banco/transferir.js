const { getUser, addJenny, removeJenny } = require("../../lib/economy")

module.exports = {
  command: ["pay", "transferir"],
  categoria: "economia",
  descripcion: "Enviar Jenny a otro usuario",

  run: async (client, m, args) => {
    const target =
      m.mentionedJid?.[0] ||
      (args[0] ? args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net" : null)

    const amount = Number(args[1])

    if (!target || !Number.isInteger(amount) || amount <= 0) {
      return m.reply("❌ Usa: .pay @usuario 100")
    }

    if (target === m.sender) {
      return m.reply("❌ No puedes enviarte dinero a ti mismo.")
    }

    const sender = getUser(m.sender)
    const receiver = getUser(target)

    if (sender.jenny < amount) {
      return m.reply(
        `❌ Saldo insuficiente.\n\n💰 Tienes: ${sender.jenny} Jenny`
      )
    }

    removeJenny(m.sender, amount, `Transferencia a @${target.split("@")[0]}`)
    addJenny(target, amount, `Transferencia de @${m.sender.split("@")[0]}`)

    const updated = getUser(m.sender)

    m.reply(
      `💸 *Transferencia exitosa*\n\n` +
      `👤 Enviado a: @${target.split("@")[0]}\n` +
      `💰 Monto: ${amount} Jenny\n\n` +
      `📊 *Tu nuevo saldo*\n` +
      `💰 Jenny: ${updated.jenny}`,
      { mentions: [target] }
    )
  }
}

