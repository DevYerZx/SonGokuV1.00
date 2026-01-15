const { getUser, addJenny, removeJenny } = require("../../lib/economy")

module.exports = {
  command: ["jenny"],
  categoria: "owner",
  isOwner: true,
  descripcion: "Agregar o quitar Jenny a un usuario",

  run: async (client, m, args) => {
    if (args.length < 3) {
      return m.reply(
        "⚙️ *USO DEL COMANDO*\n\n" +
        ".jenny add @usuario 100\n" +
        ".jenny remove @usuario 100"
      )
    }

    const action = args[0].toLowerCase()

    const target =
      m.mentionedJid?.[0] ||
      (args[1] ? args[1].replace(/[^0-9]/g, "") + "@s.whatsapp.net" : null)

    const amount = Number(args[2])

    if (!target || !Number.isInteger(amount) || amount <= 0) {
      return m.reply("❌ Usuario o cantidad inválida.")
    }

    // Asegurar usuario en DB
    getUser(target)

    if (action === "add") {
      addJenny(target, amount)
      return client.reply(
        m.chat,
        `👑 *ADMIN ECONOMY*\n\n` +
        `➕ ${amount} Jenny añadidos\n` +
        `👤 @${target.split("@")[0]}`,
        m,
        { mentions: [target] }
      )
    }

    if (action === "remove") {
      removeJenny(target, amount)
      return client.reply(
        m.chat,
        `👑 *ADMIN ECONOMY*\n\n` +
        `➖ ${amount} Jenny removidos\n` +
        `👤 @${target.split("@")[0]}`,
        m,
        { mentions: [target] }
      )
    }

    m.reply("❌ Acción inválida. Usa: add o remove")
  }
}

