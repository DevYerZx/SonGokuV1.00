const axios = require("axios")
const { payOrBypass } = require("../../lib/pay")

// 🔍 API
const SEARCH_API = "https://gawrgura-api.onrender.com/search/tiktok"

// 🤖 BOT
const BOT_NAME = "KILLUA-BOT v1.00"

// 💰 COSTO EN ZEIN
const COST = 15

module.exports = {
  command: ["tiktoksearch", "tiktokbuscar", "ttks"],
  categoria: "busqueda",
  descripcion: "Busca videos virales de TikTok (con costo)",

  run: async (client, m, args) => {
    try {
      const query = args.join(" ").trim()

      if (!query) {
        return client.reply(
          m.chat,
          "❌ Usa:\n.tiktoksearch <palabra>\nEjemplo:\n.tiktoksearch goku",
          m,
          global.channelInfo
        )
      }

      // 💳 Cobro inteligente (banco + mano + owner + bot free)
      const pay = await payOrBypass(m, COST, client)
      if (!pay.ok) return

      // 🧾 Mostrar pago si no fue gratis
      if (!pay.free) {
        await client.reply(
          m.chat,
          `
💸 *ZEIN PAGADO*
━━━━━━━━━━━━━━
🏦 Banco: -${pay.fromBank}
💰 Mano: -${pay.fromJenny}
💵 Total: ${COST}
`,
          m
        )
      }

      // ⏳ UX
      await client.reply(
        m.chat,
        `🔍 *Buscando en TikTok...*\n📌 ${query}\n🤖 ${BOT_NAME}`,
        m,
        global.channelInfo
      )

      // 📡 API
      const res = await axios.get(
        `${SEARCH_API}?q=${encodeURIComponent(query)}`,
        { timeout: 60000 }
      )

      const results = res.data?.result
      if (!Array.isArray(results) || results.length === 0) {
        return client.reply(
          m.chat,
          "❌ No se encontraron resultados.",
          m,
          global.channelInfo
        )
      }

      const videos = results.slice(0, 5)

      await client.reply(
        m.chat,
        `🎬 *${videos.length} resultados encontrados*`,
        m,
        global.channelInfo
      )

      let i = 1
      for (const v of videos) {
        const caption =
          `🎵 *TikTok #${i}*\n` +
          `━━━━━━━━━━━━━━\n` +
          `👤 ${v.author?.nickname || "Desconocido"}\n` +
          `❤️ ${v.digg_count || 0} | 👁 ${v.play_count || 0}\n` +
          `⏱ ${v.duration || 0}s\n\n` +
          `🔗 ${v.url || "Sin link"}\n\n` +
          `🤖 ${BOT_NAME}`

        await client.sendMessage(
          m.chat,
          {
            video: { url: v.play },
            caption
          },
          { quoted: m, ...global.channelInfo }
        )
        i++
      }

    } catch (err) {
      console.error("TIKTOK SEARCH ERROR:", err.response?.data || err.message)
      await client.reply(
        m.chat,
        "❌ Error al buscar en TikTok.",
        m,
        global.channelInfo
      )
    }
  }
}
