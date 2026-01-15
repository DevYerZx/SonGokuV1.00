const yts = require("yt-search")

module.exports = {
  command: ["play"],
  categoria: "descarga",
  description: "Buscar música en YouTube",

  run: async (client, m, args) => {
    try {
      if (!args.length) {
        return client.reply(m.chat, "⚠️ Ingresa el nombre de la canción.", m)
      }

      const query = args.join(" ")
      const search = await yts(query)

      if (!search.videos || !search.videos.length) {
        return client.reply(m.chat, "❌ No se encontraron resultados.", m)
      }

      // 🔹 Guardamos resultados para "siguiente"
      global.youtubeSearches.set(m.sender, {
        results: search.videos,
        index: 0
      })

      const video = search.videos[0]

      const caption =
        `🎬 *Título:* ${video.title}\n` +
        `📌 *Canal:* ${video.author.name}\n` +
        `⏱ *Duración:* ${video.timestamp}\n` +
        `👁 *Vistas:* ${video.views.toLocaleString()}\n\n` +
        `👇 Elige una opción`

      const buttons = [
        {
          buttonId: `.ytaudio ${video.url}`,
          buttonText: { displayText: "🎵 Audio" },
          type: 1
        },
        {
          buttonId: `.ytvideo ${video.url}`,
          buttonText: { displayText: "🎬 Video" },
          type: 1
        },
        {
          buttonId: `.ytdoc ${video.url}`,
          buttonText: { displayText: "📂 Documento" },
          type: 1
        },
        {
          buttonId: `.play_siguiente`,
          buttonText: { displayText: "⏭ Siguiente" },
          type: 1
        }
      ]

      await client.sendMessage(
        m.chat,
        {
          image: { url: video.thumbnail },
          caption,
          buttons,
          headerType: 4
        },
        { quoted: m }
      )

    } catch (e) {
      console.error("PLAY ERROR:", e)
      client.reply(m.chat, "❌ Error en la búsqueda.", m)
    }
  }
}
