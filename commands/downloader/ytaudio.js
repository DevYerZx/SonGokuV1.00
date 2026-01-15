const axios = require("axios")
const yts = require("yt-search")
const fs = require("fs")

const { payOrBypass } = require("../../lib/pay")

const BOT_NAME = "KILLUA-BOT v1.00"
const SOYMAYCOL_API = "https://api.soymaycol.icu/ytdl"
const API_KEY = "may-3697c22b"

// 💰 COSTO
const COSTO_AUDIO = 60

module.exports = {
  command: ["ytaudio"],
  categoria: "descarga",
  descripcion: "Descarga audio de YouTube",

  run: async (client, m, args) => {
    try {

      // 💰 COBRAR O BYPASS
      const pay = await payOrBypass(m, COSTO_AUDIO, client)
      if (!pay.ok) return

      if (!args.length) {
        return client.reply(
          m.chat,
          "❌ Usa: .ytaudio <nombre o link de YouTube>",
          m,
          global.channelInfo
        )
      }

      let videoUrl = args.join(" ")
      let title = "audio"

      // 🔎 Buscar si no es enlace
      if (!videoUrl.startsWith("http")) {
        const search = await yts(videoUrl)
        if (!search.videos?.length) {
          return client.reply(
            m.chat,
            "❌ No se encontraron resultados.",
            m,
            global.channelInfo
          )
        }
        videoUrl = search.videos[0].url
        title = search.videos[0].title || title
      }

      await client.reply(
        m.chat,
        `⏳ Procesando audio...\n${pay.free ? "👑 Uso gratuito" : `💰 Costo: ${COSTO_AUDIO} ZEIN`}\n🤖 ${BOT_NAME}`,
        m,
        global.channelInfo
      )

      // 📡 API
      const res = await axios.get(
        `${SOYMAYCOL_API}?url=${encodeURIComponent(videoUrl)}&type=mp3&apikey=${API_KEY}`,
        { timeout: 60000 }
      )

      const result = res.data?.result
      if (!result?.url) throw new Error("No se pudo obtener audio")

      const safeTitle = (result.title || title)
        .replace(/[\\/:*?"<>|]/g, "")
        .trim()
        .slice(0, 60)

      // Descargar audio
      const audioRes = await axios.get(result.url, {
        responseType: "arraybuffer",
        timeout: 120000
      })

      fs.writeFileSync("./temp.mp3", audioRes.data)

      // Enviar
      await client.sendMessage(
        m.chat,
        {
          audio: fs.readFileSync("./temp.mp3"),
          mimetype: "audio/mpeg",
          fileName: `${safeTitle}.mp3`,
          caption:
            `🎧 ${safeTitle}\n` +
            (pay.free ? "👑 Gratis" : `💰 -${COSTO_AUDIO} ZEIN`) +
            `\n🤖 ${BOT_NAME}`
        },
        { quoted: m, ...global.channelInfo }
      )

      fs.unlinkSync("./temp.mp3")

    } catch (err) {
      console.error("YTAUDIO ERROR:", err.response?.data || err.message)
      client.reply(
        m.chat,
        "❌ Error al descargar el audio.",
        m,
        global.channelInfo
      )
    }
  }
}


