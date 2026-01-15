const axios = require("axios")
const { payOrBypass } = require("../../lib/pay")

// BOT
const BOT_NAME = "KILLUA-BOT v1.00"

// API Gawrgura
const GAW_API = "https://gawrgura-api.onrender.com/download/ytdl"

// Usuarios con descargas pendientes
global.pendingDownloads = global.pendingDownloads || new Map()

// 💰 COSTO DEL COMANDO
const COST = 70

module.exports = {
  command: ["ytdoc"],
  categoria: "descarga",
  description: "Descarga video de YouTube como documento (MP4)",

  run: async (client, m, args) => {
    try {
      if (global.pendingDownloads.get(m.sender)) {
        return client.reply(
          m.chat,
          "⚠️ Ya tienes un video en proceso. Espera un momento.",
          m,
          global.channelInfo
        )
      }

      const url = args[0]
      if (!url?.startsWith("http")) {
        return client.reply(
          m.chat,
          "❌ Usa:\n.ytdoc <link de YouTube>",
          m,
          global.channelInfo
        )
      }

      // 💳 Cobro inteligente
      const pay = await payOrBypass(m, COST, client)
      if (!pay.ok) return

      // 🧾 Avisos
      if (pay.free) {
        await client.reply(
          m.chat,
          m.isOwner
            ? "👑 *OWNER*\nDescarga gratuita activada."
            : "🤖 *BOT OFICIAL*\nDescarga gratuita activada.",
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

      global.pendingDownloads.set(m.sender, true)

      await client.reply(
        m.chat,
        "⚡ Procesando tu video...\nEsto puede tardar unos segundos.",
        m,
        global.channelInfo
      )

      const { data } = await axios.get(`${GAW_API}?url=${encodeURIComponent(url)}`)
      const result = data?.result

      if (!result?.mp4) throw new Error("Video no disponible")

      const safeTitle = (result.title || "video")
        .replace(/[\\/:*?"<>|]/g, "")
        .slice(0, 60)

      await client.sendMessage(
        m.chat,
        {
          document: { url: result.mp4 },
          mimetype: "video/mp4",
          fileName: `${safeTitle}.mp4`,
          caption: `🎬 ${safeTitle}\n🤖 ${BOT_NAME}`
        },
        { quoted: m, ...global.channelInfo }
      )

    } catch (err) {
      console.error("YTDOC ERROR:", err.message)
      await client.reply(
        m.chat,
        "❌ No se pudo procesar el video.",
        m,
        global.channelInfo
      )
    } finally {
      global.pendingDownloads.delete(m.sender)
    }
  }
}


