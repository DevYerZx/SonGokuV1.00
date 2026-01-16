const fs = require("fs")
const path = require("path")

const dbPath = path.join(__dirname, "../../database/stats.json")

module.exports = {
  command: ["menu", "help", "ayuda"],
  categoria: "menu",

  run: async (client, m, { prefix }) => {

    const usedPrefix = prefix || "."

    let totalUses = 0
    let totalUsers = 0
    let topCommands = []
    let topUsers = []
    let topGroups = []

    try {
      const db = JSON.parse(fs.readFileSync(dbPath))

      totalUses = db.total || 0
      totalUsers = Object.keys(db.users || {}).length

      topCommands = Object.entries(db.commands || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)

      topUsers = Object.values(db.users || {})
        .sort((a, b) => b.uses - a.uses)
        .slice(0, 3)

      topGroups = Object.entries(db.groups || {})
        .map(([id, data]) => ({
          id,
          uses: data.uses || 0
        }))
        .sort((a, b) => b.uses - a.uses)
        .slice(0, 3)

    } catch (e) {
      console.log("MENU ERROR:", e)
    }

    const topCmdText = topCommands.length
      ? topCommands.map((c, i) =>
          `⚡ ${i + 1}. ${usedPrefix}${c[0]} (${c[1]})`
        ).join("\n")
      : "Sin datos"

    const caption = `
🐉🔥 𝑺𝑶𝑵 𝑮𝑶𝑲𝑼 𝑩𝑶𝑻 🔥🐉
━━━━━━━━━━━━━━━━━━
👤 Guerrero Z: *${m.pushName}*

📊 PODER DE COMBATE
👥 Usuarios: *${totalUsers}*
⚡ Técnicas usadas: *${totalUses}*

🔥 TOP TÉCNICAS
${topCmdText}

━━━━━━━━━━━━━━━━━━
⚡ Selecciona un modo ⚡
`

    const listMessage = {
      text: caption,
      footer: "🐲 SonGokuBOT • Poder Saiyajin • DVYER",
      title: "🌌 MENÚ SAIYAJIN",
      buttonText: "🐉 ABRIR MENÚ",
      sections: [
        {
          title: "🔥 MODOS SAIYAJIN",
          rows: [
            {
              title: "📥 Descargas",
              description: "Audio, video, imágenes",
              rowId: `${usedPrefix}menu_descargas`
            },
            {
              title: "🎬 Películas & Series",
              description: "Netflix, anime, series",
              rowId: `${usedPrefix}menu_peliculas`
            },
            {
              title: "🎮 Juegos",
              description: "Diversión y minijuegos",
              rowId: `${usedPrefix}menu_juegos`
            }
          ]
        },
        {
          title: "⚡ INFORMACIÓN",
          rows: [
            {
              title: "📜 Menú completo",
              description: "Todos los comandos",
              rowId: `${usedPrefix}menu_completo`
            },
            {
              title: "🐲 Creador",
              description: "Información del creador",
              rowId: `${usedPrefix}owner`
            }
          ]
        }
      ]
    }

    await client.sendMessage(m.chat, listMessage, { quoted: m })
  }
}