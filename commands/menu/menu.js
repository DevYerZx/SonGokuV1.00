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
      console.log("MENU STATS ERROR:", e)
    }

    const mediaList = [
      "https://i.ibb.co/Xrxbcymh/IMG-20241011-WA0000.jpg"
    ]

    const randomMedia = mediaList[Math.floor(Math.random() * mediaList.length)]

    const topCmdText = topCommands.length
      ? topCommands.map((c, i) =>
          `⚡ ${i + 1}┃ ${usedPrefix}${c[0]} 〔${c[1]}〕`
        ).join("\n")
      : "⚠️ Sin registros"

    const topUserText = topUsers.length
      ? topUsers.map((u, i) =>
          `👤 ${i + 1}┃ ${u.name || u.number || u.id} 〔${u.uses}〕`
        ).join("\n")
      : "⚠️ Sin registros"

    const topGroupText = topGroups.length
      ? await Promise.all(
          topGroups.map(async (g, i) => {
            let name = g.id
            try {
              const meta = await client.groupMetadata(g.id)
              name = meta.subject || g.id
            } catch {}
            return `🏠 ${i + 1}┃ ${name} 〔${g.uses}〕`
          })
        ).then(r => r.join("\n"))
      : "⚠️ Sin registros"

    const caption = `
╭━━━〔 🐉🔥 𝑺𝑶𝑵 𝑮𝑶𝑲𝑼 𝑩𝑶𝑻 🔥🐉 〕━━━╮
┃ ⚡ 𝑷𝒐𝒅𝒆𝒓 𝑺𝒂𝒊𝒚𝒂𝒋𝒊𝒏 𝑨𝒄𝒕𝒊𝒗𝒐 ⚡
╰━━━━━━━━━━━━━━━━━━━━━━╯

👤 𝑮𝒖𝒆𝒓𝒓𝒆𝒓𝒐 𝒁:
➤ ${m.pushName}

╭───〔 📊 𝑬𝑺𝑻𝑨𝑫𝑰́𝑺𝑻𝑰𝑪𝑨𝑺 〕───╮
👥 Usuarios: ${totalUsers}
⚡ Técnicas usadas: ${totalUses}
╰────────────────────────╯

╭───〔 🔥 𝑻𝑶𝑷 𝑻𝑬́𝑪𝑵𝑰𝑪𝑨𝑺 〕───╮
${topCmdText}
╰────────────────────────╯

╭───〔 👑 𝑻𝑶𝑷 𝑮𝑼𝑬𝑹𝑹𝑬𝑹𝑶𝑺 〕───╮
${topUserText}
╰────────────────────────╯

╭───〔 🏠 𝑻𝑶𝑷 𝑼𝑵𝑰𝑽𝑬𝑹𝑺𝑶𝑺 〕───╮
${topGroupText}
╰────────────────────────╯

╭━━━〔 📜 𝑴𝑬𝑵𝑼́ 𝑷𝑹𝑰𝑵𝑪𝑰𝑷𝑨𝑳 〕━━━╮
📥 ${usedPrefix}menu_descargas
🎬 ${usedPrefix}menu_peliculas
🎮 ${usedPrefix}menu_juegos
╰━━━━━━━━━━━━━━━━━━━━━━╯

🐲 𝑪𝑹𝑬𝑨𝑫𝑶𝑹: 𝑫𝑽𝒀𝑬𝑹
⚡ 𝑬𝒏𝒆𝒓𝒈𝒊́𝒂 𝒊𝒏𝒇𝒊𝒏𝒊𝒕𝒂
`

    const buttons = [
      {
        buttonId: `${usedPrefix}menu_descargas`,
        buttonText: { displayText: "📥 DESCARGAS" },
        type: 1
      },
      {
        buttonId: `${usedPrefix}menu_peliculas`,
        buttonText: { displayText: "🎬 PELÍCULAS" },
        type: 1
      },
      {
        buttonId: `${usedPrefix}menu_juegos`,
        buttonText: { displayText: "🎮 JUEGOS" },
        type: 1
      },
      {
        buttonId: `${usedPrefix}menu_completo`,
        buttonText: { displayText: "🐉 MENÚ ULTRA" },
        type: 1
      }
    ]

    await client.sendMessage(
      m.chat,
      {
        image: { url: randomMedia },
        caption,
        buttons,
        footer: "🐉 SonGokuBOT • Ultra Instinto • DVYER 🐉",
        headerType: 4
      },
      { quoted: m }
    )
  }
}