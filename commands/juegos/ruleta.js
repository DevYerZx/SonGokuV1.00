const { getUser, addJenny, removeJenny, saveEco } = require("../../lib/economy")

module.exports = {
  command: ["ruleta"],
  categoria: "juegos",

  run: async (client, m, args) => {
    const bet = parseInt(args[0])
    if (!bet || bet < 10) return m.reply("🎲 Usa: .ruleta <cantidad>")

    const user = getUser(m.sender)
    if (user.jenny < bet) return m.reply("❌ No tienes suficiente Jenny.")

    const win = Math.random() < 0.45

    if (win) {
      addJenny(m.sender, bet)

      // 👉 avanzar misión
      if (user.mision && !user.mision.completada) {
        user.mision.progreso += bet
      }

      saveEco()
      return m.reply(`🎉 GANASTE\n💰 +${bet} Jenny`)
    } else {
      removeJenny(m.sender, bet)
      saveEco()
      return m.reply(`💀 PERDISTE\n💰 -${bet} Jenny`)
    }
  }
}

