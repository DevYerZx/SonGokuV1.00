const { getUser, removeJenny, saveEco } = require("../../lib/economy")

const items = {
  titulo: { price: 500, name: "🏷️ Título PvP" },
  color: { price: 400, name: "🎨 Color PvP" },
  insignia: { price: 700, name: "🛡️ Insignia PvP" }
}

module.exports = {
  command: ["shoppvp"],
  categoria: "juegos",
  descripcion: "Tienda de objetos PvP",

  run: async (client, m, args) => {
    const user = getUser(m.sender)

    if (!args[0]) {
      return m.reply(`
🛒⚔️ *SHOP PvP*
━━━━━━━━━━━━━━
🏷️ titulo — 500 Jenny
🎨 color — 400 Jenny
🛡️ insignia — 700 Jenny

Usa:
.shoppvp comprar <item>
`)
    }

    if (args[0] !== "comprar") {
      return m.reply("❌ Usa: .shoppvp comprar <item>")
    }

    const item = items[args[1]]
    if (!item) return m.reply("❌ Item no válido.")

    if (user.jenny < item.price) {
      return m.reply(`❌ Jenny insuficiente.\n💰 Tienes: ${user.jenny}`)
    }

    // Inicializar PvP
    if (!user.pvp) user.pvp = {}

    if (user.pvp[item.name]) {
      return m.reply("⚠️ Ya posees este item.")
    }

    // Cobrar
    removeJenny(m.sender, item.price)

    // Guardar item
    user.pvp[item.name] = true

    // Guardar en economy.json
    saveEco()

    m.reply(`
✅ *COMPRA EXITOSA*
━━━━━━━━━━━━━━
${item.name}
💰 -${item.price} Jenny
`)
  }
}
