module.exports = {
  command: ["menu_juegos", "juegos"],
  categoria: "menu",

  run: async (client, m, { prefix }) => {
    const usedPrefix = prefix && prefix.length ? prefix : "."

    const text = `
⚡🎮 *MENÚ DE JUEGOS — KILLUA BOT* ⚡

🧬 *ENTRENAMIENTO HUNTER*
━━━━━━━━━━━━━━━━━━
⚔️ ${usedPrefix}work
   └ Entrena y gana Jenny

🎁 ${usedPrefix}daily
   └ Recompensa diaria (24h)

🎰 ${usedPrefix}ruleta
   └ Apuesta Jenny

🧠 ${usedPrefix}adivinanza
   └ Desafío mental Hunter

🎯 ${usedPrefix}misiones
   └ Misiones especiales

━━━━━━━━━━━━━━━━━━
💰 *ECONOMÍA JENNY*
━━━━━━━━━━━━━━━━━━
💼 ${usedPrefix}balance
   └ Ver tu Jenny

🏆 ${usedPrefix}topcoins
   └ Ranking de Hunters

🛒 ${usedPrefix}shop
   └ Tienda Jenny

👑 ${usedPrefix}premium
   └ Comprar Premium

━━━━━━━━━━━━━━━━━━
🎵 *EXTRAS*
━━━━━━━━━━━━━━━━━━
🎧 ${usedPrefix}ytaudio
   └ Descargar audio (costo Jenny)

🎬 ${usedPrefix}ytvideo
   └ Descargar video (costo Jenny)

━━━━━━━━━━━━━━━━━━
📌 Cooldown activo
📌 Premium sin costo por juegos
📌 Jenny protegida
━━━━━━━━━━━━━━━━━━
⚡ *Killua observa tu progreso…*
`

    const buttons = [
      {
        buttonId: `${usedPrefix}juegos`,
        buttonText: { displayText: "juegos" },
        type: 1
      },
      {
        buttonId: `${usedPrefix}menueconomia`,
        buttonText: { displayText: "💰 Economía" },
        type: 1
      },
      {
        buttonId: `${usedPrefix}menubanco`,
        buttonText: { displayText: "🏦 Banco" },
        type: 1
      },
      {
        buttonId: `${usedPrefix}menutienda`,
        buttonText: { displayText: "🛒 Tienda" },
        type: 1
      },
      {
        buttonId: `${usedPrefix}menupremium`,
        buttonText: { displayText: "⭐ Premium" },
        type: 1
      },
      {
        buttonId: `${usedPrefix}menuowner`,
        buttonText: { displayText: "👑 Dueño" },
        type: 1
      }
    ]

    await client.sendMessage(
      m.chat,
      {
        text,
        buttons,
        footer: "⚡ Killua Bot • Sistema Jenny ⚡"
      },
      { quoted: m, ...global.channelInfo }
    )
  }
}
