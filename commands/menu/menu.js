const fs = require("fs")
const path = require("path")

const dbPath = path.join(__dirname, "../../database/stats.json")

module.exports = {
  command: ["menu", "help", "ayuda"],
  categoria: "menu",

  run: async (client, m, { prefix }) => {
    const usedPrefix = prefix || "."

    /* ───── ESTADÍSTICAS ───── */
    let totalUses = 0
    let totalUsers = 0

    try {
      const db = JSON.parse(fs.readFileSync(dbPath))
      totalUses = db.total || 0
      totalUsers = Object.keys(db.users || {}).length
    } catch (e) {
      console.log("MENU ERROR:", e)
    }

    /* ───── ANIMACIÓN TRANSFORMACIÓN ───── */
    await client.sendMessage(m.chat, { text: "⚡ Cargando Ki..." }, { quoted: m })
    await new Promise(r => setTimeout(r, 600))
    await client.sendMessage(m.chat, { text: "⚡⚡⚡⚡⚡⚡⚡" })
    await new Promise(r => setTimeout(r, 600))
    await client.sendMessage(m.chat, { text: "🔥 𝑺𝑼𝑷𝑬𝑹 𝑺𝑨𝑰𝒀𝑨𝑱𝑰𝑵 🔥" })
    await new Promise(r => setTimeout(r, 600))
    await client.sendMessage(m.chat, { text: "⚪ 𝑼𝑳𝑻𝑹𝑨 𝑰𝑵𝑺𝑻𝑰𝑵𝑻𝑶 ⚪" })

    /* ───── TEXTO ULTRA DISEÑO ───── */
    const caption = `
╔═══━━━═══━━━═══╗
┃ 🐉 𝕾𝖔𝖓 𝕲𝖔𝖐𝖚 𝕭𝖔𝖙 🐉 ┃
┃ ⚡ 𝕌𝕝𝕥𝕣𝕒 𝕀𝕟𝕤𝕥𝕚𝕟𝕥𝕠 ⚡ ┃
╚═══━━━═══━━━═══╝

✦ 𝓖𝓾𝓮𝓻𝓻𝓮𝓻𝓸 𝓩
╰➤ ❝ ${m.pushName} ❞

╭━━━━━━━━━━━━━━━━━━╮
┃ 🌌 𝙋𝙊𝘿𝙀𝙍 𝘿𝙀 𝘾𝙊𝙈𝘽𝘼𝙏𝙀
┃ 👥 Usuarios ⟿ ${totalUsers}
┃ 🔥 Técnicas ⟿ ${totalUses}
╰━━━━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━━━━╮
┃ 🐲 𝑴𝑶𝑫𝑶𝑺 𝑺𝑨𝑰𝒀𝑨𝑱𝑰𝑵
┃ 🟠 Base
┃ 🟡 Super Saiyajin
┃ 🔵 SSJ Blue
┃ ⚪ Ultra Instinto
╰━━━━━━━━━━━━━━━━━━╯

⚡ Pulsa el botón para desplegar el poder
`

    /* ───── LIST MESSAGE (MENÚ PRO) ───── */
    await client.sendMessage(m.chat, {
      image: {
        url: "https://i.ibb.co/Xrxbcymh/IMG-20241011-WA0000.jpg"
      },
      caption,
      footer: "🐉 SonGokuBOT • Poder Saiyajin • DVYER 🐉",
      buttonText: "⚡ DESPLEGAR PODER ⚡",
      sections: [
        {
          title: "🟠 BASE FORM",
          rows: [
            { title: "📥 Descargas", rowId: `${usedPrefix}menu_descargas` },
            { title: "🎬 Películas & Series", rowId: `${usedPrefix}menu_peliculas` }
          ]
        },
        {
          title: "🟡 SUPER SAIYAJIN",
          rows: [
            { title: "🎵 Música", rowId: `${usedPrefix}menu_musica` },
            { title: "🖼️ Stickers", rowId: `${usedPrefix}menu_stickers` }
          ]
        },
        {
          title: "🔵 SUPER SAIYAJIN BLUE",
          rows: [
            { title: "🎮 Juegos", rowId: `${usedPrefix}menu_juegos` },
            { title: "⚙️ Herramientas", rowId: `${usedPrefix}menu_tools` }
          ]
        },
        {
          title: "⚪ ULTRA INSTINTO",
          rows: [
            { title: "📜 Menú Completo", rowId: `${usedPrefix}menu_completo` },
            { title: "👑 Comandos Premium", rowId: `${usedPrefix}menu_premium` }
          ]
        }
      ]
    }, { quoted: m, ...global.channelInfo })
  }
}