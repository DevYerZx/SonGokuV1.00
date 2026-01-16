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
          `⟣ ${i + 1} ⟢ 𝙏𝙀𝘾𝙃 » 𝖃${usedPrefix}${c[0]} 〔${c[1]}〕`
        ).join("\n")
      : "⟣ Sin datos ⟢"

    const topUserText = topUsers.length
      ? topUsers.map((u, i) =>
          `⟣ ${i + 1} ⟢ 𝖂𝖆𝖗𝖗𝖎𝖔𝖗 » ${u.name || u.number || u.id} 〔${u.uses}〕`
        ).join("\n")
      : "⟣ Sin datos ⟢"

    const topGroupText = topGroups.length
      ? await Promise.all(
          topGroups.map(async (g, i) => {
            let name = g.id
            try {
              const meta = await client.groupMetadata(g.id)
              name = meta.subject || g.id
            } catch {}
            return `⟣ ${i + 1} ⟢ 𝕌𝕟𝕚𝕧𝕖𝕣𝕤𝕖 » ${name} 〔${g.uses}〕`
          })
        ).then(r => r.join("\n"))
      : "⟣ Sin datos ⟢"

    const caption = `
╭━━━╮╭━━━╮╭━━━╮╭━━━╮
┃ 🐉 ┃┃ 🔥 ┃┃ ⚡ ┃┃ 👑 ┃
╰━━━╯╰━━━╯╰━━━╯╰━━━╯

𓆩 𝕾𝖔𝖓 𝕲𝖔𝖐𝖚 𝕭𝖔𝖙 𓆪
𓆩 ⚡ 𝖀𝖑𝖙𝖗𝖆 𝕴𝖓𝖘𝖙𝖎𝖓𝖈𝖙𝖔 ⚡ 𓆪

════════════════════
👤 𝒁 𝑾𝒂𝒓𝒓𝒊𝒐𝒓
➥ ❝ ${m.pushName} ❞
════════════════════

╔═━━━═╗ 🌌 𝙋𝙊𝘿𝙀𝙍 𝘿𝙀 𝘾𝙊𝙈𝘽𝘼𝙏𝙀
║ ⚔️ ║ 👥 ${totalUsers}
║ 🔥 ║ ⚡ ${totalUses}
╚═━━━═╝

╔═━━━═╗ 🧬 𝑻𝑹𝑨𝑵𝑺𝑭𝑶𝑹𝑴𝑨𝑪𝑰𝑶́𝑵
║ 🟠 ║ 𝓑𝓪𝓼𝓮
║ 🟡 ║ 𝓢𝓾𝓹𝓮𝓻 𝓢𝓪𝓲𝔂𝓪𝓳𝓲𝓷
║ 🔵 ║ 𝓢𝓢𝓙 𝓑𝓵𝓾𝓮
║ ⚪ ║ 𝓤𝓵𝓽𝓻𝓪 𝓘𝓷𝓼𝓽𝓲𝓷𝓽𝓸
╚═━━━═╝

╔═━━━═╗ 🔥 𝑻𝑶𝑷 𝟑 · 𝑻𝑬́𝑪𝑵𝑰𝑪𝑨𝑺
╚═━━━═╝
${topCmdText}

╔═━━━═╗ 👑 𝑻𝑶𝑷 𝟑 · 𝑮𝑼𝑬𝑹𝑹𝑬𝑹𝑶𝑺
╚═━━━═╝
${topUserText}

╔═━━━═╗ 🏠 𝑻𝑶𝑷 𝟑 · 𝑼𝑵𝑰𝑽𝑬𝑹𝑺𝑶𝑺
╚═━━━═╝
${topGroupText}

╔═━━━═╗ 📜 𝑴𝑬𝑵𝑼́ 𝑷𝑶𝑹 𝑵𝑰𝑽𝑬𝑳𝑬𝑺
║ 🟠 ║ ${usedPrefix}menu_descargas
║ 🟡 ║ ${usedPrefix}menu_peliculas
║ 🔵 ║ ${usedPrefix}menu_juegos
║ ⚪ ║ ${usedPrefix}menu_completo
╚═━━━═╝

𓆩 👑 𝕮𝖗𝖊𝖆𝖉𝖔𝖗 𓆪
𓆩 𝓓𝓥𝓨𝓔𝓡 𓆪
⚡ 𝓔𝓵 𝓹𝓸𝓭𝓮𝓻 𝓷𝓸 𝓽𝓲𝓮𝓷𝓮 𝓵𝓲́𝓶𝓲𝓽𝓮𝓼
`

    const buttons = [
      {
        buttonId: `${usedPrefix}menu_descargas`,
        buttonText: { displayText: "📥 𝕯𝖊𝖘𝖈𝖆𝖗𝖌𝖆𝖘" },
        type: 1
      },
      {
        buttonId: `${usedPrefix}peliculas_series`,
        buttonText: { displayText: "🎬 𝕻𝖊𝖑𝖎́𝖈𝖚𝖑𝖆𝖘" },
        type: 1
      },
      {
        buttonId: `${usedPrefix}menu_juegos`,
        buttonText: { displayText: "🎮 𝕵𝖚𝖊𝖌𝖔𝖘" },
        type: 1
      }
    ]

    await client.sendMessage(
      m.chat,
      {
        image: { url: randomMedia },
        caption,
        buttons,
        footer: "🐉 𝕾𝖔𝖓𝕲𝖔𝖐𝖚𝕭𝖔𝖙 • 𝕌𝕀 • 𝓓𝓥𝓨𝓔𝓡 🐉",
        headerType: 4
      },
      { quoted: m, ...global.channelInfo }
    )
  }
}