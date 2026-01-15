module.exports = {
  command: ["play_siguiente"],
  categoria: "descarga",
  description: "Muestra el siguiente resultado de la búsqueda",

  run: async (client, m) => {
    try {
      const sender = m.sender
      const data = global.youtubeSearches.get(sender)

      if (!data || !data.results?.length) {
        return client.reply(
          m.chat,
          "❌ No hay más resultados. Usa *play* otra vez.",
          m,
          global.channelInfo
        )
      }

      data.index++

      if (data.index >= data.results.length) {
        global.youtubeSearches.delete(sender)
        return client.reply(
          m.chat,
          "❌ No hay más resultados disponibles.",
          m,
          global.channelInfo
        )
      }

      const video = data.results[data.index]

      const caption =
        `🎬 *Título:* ${video.title}\n` +
        `📌 *Canal:* ${video.author?.name || "YouTube"}\n` +
        `⏱ *Duración:* ${video.timestamp}\n` +
        `👁 *Vistas:* ${video.views?.toLocaleString() || "?"}\n\n` +
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
        { quoted: m, ...global.channelInfo }
      )

    } catch (e) {
      console.error("PLAY_NEXT ERROR:", e)
      client.reply(
        m.chat,
        "❌ Error al mostrar el siguiente resultado.",
        m,
        global.channelInfo
      )
    }
  }
}
