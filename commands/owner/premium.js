const { getUser, setPremium, saveEco } = require("../../lib/economy")

module.exports = {
  command: ["premium"],
  categoria: "owner",
  isOwner: true,
  descripcion: "Dar o quitar premium a un usuario",

  run: async (client, m, args) => {
    if (args.length < 2) {
      return m.reply("⚙️ Uso correcto:\n.premium @user on | off")
    }

    const target =
      m.mentionedJid?.[0] ||
      (args[0] ? args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net" : null)

    const action = args[1].toLowerCase()

    if (!target) return m.reply("❌ Usuario inválido.")

    const user = getUser(target)

    if (action === "on") {
      user.premium = true
      saveEco()
      return m.reply(
        `⭐ *Premium activado*\n\n👤 @${target.split("@")[0]}`,
        { mentions: [target] }
      )
    }

    if (action === "off") {
      user.premium = false
      saveEco()
      return m.reply(
        `❌ *Premium removido*\n\n👤 @${target.split("@")[0]}`,
        { mentions: [target] }
      )
    }

    return m.reply("❌ Usa: .premium @user on | off")
  }
}

