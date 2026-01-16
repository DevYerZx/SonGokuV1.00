const fs = require("fs")
const path = require("path")

const dbPath = path.join(__dirname, "../../database/stats.json")

module.exports = {
  command: ["menu", "help", "ayuda"],
  categoria: "menu",

  run: async (client, m, { prefix }) => {

    const usedPrefix = prefix && prefix.length ? prefix : "."

    let totalUses = 0
    let totalUsers = 0
    let topCommands = []
    let topUsers = []
    let topGroups = []

    try {
      const db = JSON.parse(fs.readFileSync(dbPath))

      totalUses = db.total || 0
      totalUsers = Object.keys(db.users || {}).length

      // 🔥 TOP 3 COMANDOS
      topCommands = Object.entries(db.commands || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)

      // 👑 TOP 3 USUARIOS
      topUsers = Object.values(db.users || {})
        .sort((a, b) => b.uses - a.uses)
        .slice(0, 3)

      // 🏠 TOP 3 GRUPOS
      topGroups = Object.entries(db.groups || {})
        .map(([id, data]) => ({
          id,
          uses: data.uses || 0
        }))
        .sort((a, b) => b.uses - a.uses)
        .slice(0, 3)

    } catch (e) {
      console.log("SONGOKUBOT MENU ERROR:", e)
    }

    // 🖼️ IMÁGENES DE GOKU
    const mediaList = [
      "https://i.ibb.co/5hQJ7KZ/goku-ultra-instinct.jpg",
      "https://i.ibb.co/F6qg4ZQ/goku-ssj-blue.jpg",
      "https://i.ibb.co/qx0m1pX/goku-kamehameha.jpg"
    ]

    const randomMedia = mediaList[Math.floor(Math.random() * mediaList.length)]

    const topCmdText = topCommands.length
      ? topCommands.map((c, i) =>
          `⚡ ${i + 1}. *${usedPrefix}${c[0]}* → ${c[1]} usos`
        ).join("\n")
      : "⚠️ Sin datos"

    const topUserText = topUsers.length
      ? topUsers.map((u, i) =>
          `👤 ${i + 1}. ${u.name || u.number || u.id} → ${u.uses} usos`
        ).join("\n")
      : "⚠️ Sin datos"

    const topGroupText = topGroups.length
      ? await Promise.all(
          topGroups.map(async (g, i) => {
            let name = g.id
            try {
              const meta = await client.groupMetadata(g.id)
              name = meta.subject || g.id
            } catch {}
            return `🏠 ${i + 1}. ${name} → ${g.uses} usos`
          })
        ).then(r => r.join("\n"))
      : "⚠️ Sin datos"

    const caption = `
╔══════════════════════════════╗
║ 🐉🔥 𝗦𝗢𝗡 𝗚𝗢𝗞𝗨 𝗕𝗢𝗧 🔥🐉 ║
║ ⚡ 𝗨𝗟𝗧𝗥𝗔 𝗜𝗡𝗦𝗧𝗜𝗡𝗧𝗢 ⚡ ║
╚══════════════════════════════╝

👤 *Guerrero Z:* ${m.pushName}

━━━━━━━━━━━━━━━━━━
📊 *PODER DE COMBATE*
👥 Guerreros activos: *${totalUsers}*
⚡ Técnicas ejecutadas: *${totalUses}*

━━━━━━━━━━━━━━━━━━
🔥 *TOP 3 TÉCNICAS*
${topCmdText}

━━━━━━━━━━━━━━━━━━
👑 *TOP 3 GUERREROS*
${topUserText}

━━━━━━━━━━━━━━━━━━
🏠 *TOP 3 UNIVERSOS*
${topGroupText}

━━━━━━━━━━━━━━━━━━
📥 Descargas → ${usedPrefix}menu_descargas
🎬 Películas & Series → ${usedPrefix}menu_peliculas
🎮 Juegos → ${usedPrefix}menu_juegos
📜 Menú Completo → ${usedPrefix}menu_completo

━━━━━━━━━━━━━━━━━━
🐲 *CREADOR:* DVYER  
⚡ *El poder no tiene límites*
`

    const buttons = [
      {
        buttonId: `${usedPrefix}menu_descargas`,
        buttonText: { displayText: "📥 Descargas" },
        type: 1
      },
      {
        buttonId: `${usedPrefix}menu_peliculas`,
        buttonText: { displayText: "🎬 Películas & Series" },
        type: 1
      },
      {
        buttonId: `${usedPrefix}menu_completo`,
        buttonText: { displayText: "📜 Menú Completo" },
        type: 1
      },
      {
        buttonId: `${usedPrefix}menu_juegos`,
        buttonText: { displayText: "🎮 Juegos" },
        type: 1
      }
    ]

    await client.sendMessage(
      m.chat,
      {
        image: { url: randomMedia },
        caption,
        buttons,
        footer: "🐉 SonGokuBOT • Poder Saiyajin • DVYER 🐉",
        headerType: 4
      },
      { quoted: m, ...global.channelInfo }
    )
  }
}