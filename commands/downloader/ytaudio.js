const axios = require("axios")
const yts = require("yt-search")
const fs = require("fs")

const { payOrBypass } = require("../../lib/pay")

const BOT_NAME = "KILLUA-BOT v1.00"
const ADONIX_API = "https://api-adonix.ultraplus.click/download/ytaudio"
const APIKEY = "dvyer"

// 💰 COSTO
const COSTO_AUDIO = 60

module.exports = {
  command: ["ytaudio"],
  categoria: "descarga",
  descripcion: "Descarga audio de YouTube",

  run: async (client, m, args) => {
    try {
      const pay = await payOrBypass(m, COSTO_AUDIO, client)
      if (!pay.ok) return

      if (!args.length) {
        return client.reply(
          m.chat,
          "❌ Usa: .ytaudio <nombre o link de YouTube>",
          m
        )
      }

      let videoUrl = args.join(" ")
      let title = "audio"

      // 🔎 Buscar si no es link
      if (!videoUrl.startsWith("http")) {
        const search = await yts(videoUrl)
        if (!search.videos.length) {
          return client.reply(m.chat, "❌ No se encontraron resultados.", m)
        }
        videoUrl = search.videos[0].url
        title = search.videos[0].title
      }

      await client.reply(
        m.chat,
        `⏳ Descargando audio...\n${pay.free ? "👑 Gratis" : `💰 -${COSTO_AUDIO} ZEIN`}\n🤖 ${BOT_NAME}`,
        m
      )

      // 📡 LLAMADA API (IMPORTANTE)
      const res = await axios.get(ADONIX_API, {
        params: {
          apikey: APIKEY,
          url: videoUrl
        },
        timeout: 120000
      })

      const data = res.data

      // 🔎 Compatibilidad con distintas respuestas
      const result = data.result || data.data || data

      if (!result.url) throw "Audio no generado"

      const safeTitle = (result.title || title)
        .replace(/[\\/:*?"<>|]/g, "")
        .slice(0, 60)

      // ⬇️ Descargar mp3
      const audio = await axios.get(result.url, {
        responseType: "arraybuffer",
        timeout: 120000
      })

      fs.writeFileSync("./temp.mp3", audio.data)

      await client.sendMessage(
        m.chat,
        {
          audio: fs.readFileSync("./temp.mp3"),
          mimetype: "audio/mpeg",
          fileName: `${safeTitle}.mp3`
        },
        { quoted: m }
      )

      fs.unlinkSync("./temp.mp3")

    } catch (e) {
      console.error("YTAUDIO:", e)
      client.reply(
        m.chat,
        "❌ La API tardó demasiado o falló.\nIntenta nuevamente.",
        m
      )
    }
  }
}