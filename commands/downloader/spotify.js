const axios = require("axios")
const { payOrBypass } = require("../../lib/pay")

const API_URL = "https://api-adonix.ultraplus.click/download/spotify"
const API_KEY = "dvyer"

const BOT_NAME = "KILLUA-BOT v1.00"

// 💰 COSTO (puedes cambiarlo cuando quieras)
const COST = 45

module.exports = {
  command: ["spotify", "sp"],
  categoria: "descarga",
  description: "Descarga audio de Spotify",

  run: async (client, m, args) => {
    try {
      if (!args.length) {
        return client.reply(
          m.chat,
          "📌 Usa:\n.spotify <nombre de la canción>\n\nEjemplo:\n.spotify del mar ozuna",
          m,
          global.channelInfo
        )
      }

      // 💳 Cobro inteligente
      const pay = await payOrBypass(m, COST, client)
      if (!pay.ok) return

      // 📢 Avisos
      if (pay.free) {
        await client.reply(
          m.chat,
          m.isOwner
            ? "👑 *OWNER*\nDescarga Spotify gratuita."
            : "🤖 *BOT OFICIAL*\nDescarga Spotify gratuita.",
          m
        )
      } else {
        await client.reply(
          m.chat,
          `
💸 *ZEIN PAGADO*
━━━━━━━━━━━━━━
🏦 Banco: -${pay.fromBank}
💰 Jenny: -${pay.fromJenny}
💵 Total: ${COST}
`,
          m
        )
      }

      const query = args.join(" ")

      // ⏳ Mensaje UX
      await client.reply(
        m.chat,
        `⏳ Buscando en Spotify...\n💰 Costo: ${COST} ZEIN\n🤖 ${BOT_NAME}`,
        m,
        global.channelInfo
      )

      const res = await axios.get(API_URL, {
        params: {
          q: query,
          apikey: API_KEY
        },
        timeout: 60000
      })

      if (!res.data?.status || !res.data?.downloadUrl || !res.data?.song) {
        console.log("RESPUESTA ADONIX:", res.data)
        return client.reply(
          m.chat,
          "❌ No se pudo obtener la canción.",
          m,
          global.channelInfo
        )
      }

      const song = res.data.song
      const audioUrl = res.data.downloadUrl

      const title = (song.title || "Spotify Audio")
        .replace(/[\\/:*?"<>|]/g, "")
        .slice(0, 60)

      const artist = song.artist || "Desconocido"
      const duration = song.duration || "--:--"

      const caption =
        `🎵 *Spotify*\n` +
        `🎧 ${title}\n` +
        `👤 ${artist}\n` +
        `⏱️ ${duration}\n` +
        `🤖 ${BOT_NAME}`

      await client.sendMessage(
        m.chat,
        {
          audio: { url: audioUrl },
          mimetype: "audio/mpeg",
          fileName: `${title}.mp3`,
          caption
        },
        { quoted: m, ...global.channelInfo }
      )

    } catch (err) {
      console.error("SPOTIFY ERROR:", err.response?.data || err.message)
      await client.reply(
        m.chat,
        "❌ Error al descargar la canción.",
        m,
        global.channelInfo
      )
    }
  }
}

