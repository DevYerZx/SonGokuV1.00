require("./settings")

// ✅ GLOBAL PARA PLAY / SIGUIENTE
global.youtubeSearches = new Map()

const fs = require("fs")
const chalk = require("chalk")

const seeCommands = require("./lib/system/commandLoader")
const initDB = require("./lib/system/initDB")
const antilink = require("./commands/antilink")
const { resolveLidToRealJid } = require("./lib/utils")
const { registerUse } = require("./lib/system/stats")

// ===== CARGAR COMANDOS =====
seeCommands()

// ===== CACHE Y COOLDOWN =====
const groupCache = new Map()
const cooldown = new Map()

const GROUP_TTL = 5 * 60 * 1000
const COOLDOWN_MS = 1500

// ===== LIMPIEZA =====
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of groupCache) {
    if (v.expires < now) groupCache.delete(k)
  }
  cooldown.clear()
}, 10 * 60 * 1000)

// ===== COOLDOWN =====
function inCooldown(sender, command) {
  const key = sender + ":" + command
  const now = Date.now()
  const expire = cooldown.get(key)
  if (expire && now < expire) return true
  cooldown.set(key, now + COOLDOWN_MS)
  return false
}

// ===== MAIN HANDLER =====
async function mainHandler(client, m) {
  try {
    if (!m?.message) return

    const body =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      m.message.imageMessage?.caption ||
      m.message.videoMessage?.caption ||
      m.message.buttonsResponseMessage?.selectedButtonId ||
      m.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
      m.message.templateButtonReplyMessage?.selectedId ||
      ""

    if (!body) return

    try { initDB(m) } catch {}

    const sender = m.sender || m.key?.participant
    if (!sender) return

    const from = m.chat
    const isGroup = m.isGroup
    const botJid = client.user.id.split(":")[0] + "@s.whatsapp.net"

    const prefixes = [".", "!", "#", "/"]
    const usedPrefix = prefixes.find(p => body.startsWith(p)) || ""

    const textRaw = usedPrefix
      ? body.slice(usedPrefix.length).trim()
      : body.trim()

    const args = textRaw.split(/\s+/)
    const command = args.shift()?.toLowerCase()
    const text = args.join(" ")

    if (!command) return
    if (!global.comandos?.has(command)) return

    const cmd = global.comandos.get(command)

    // ===== ANTILINK =====
    if (
      !usedPrefix &&
      isGroup &&
      /chat\.whatsapp\.com\/|whatsapp\.com\/channel\//i.test(body) &&
      antilink?.isActive?.(from)
    ) {
      let cached = groupCache.get(from)

      if (!cached || cached.expires < Date.now()) {
        const meta = await client.groupMetadata(from).catch(() => null)
        if (meta) {
          cached = {
            admins: meta.participants.filter(p => p.admin).map(p => p.jid),
            subject: meta.subject || "",
            expires: Date.now() + GROUP_TTL
          }
          groupCache.set(from, cached)
        }
      }

      const isOwner = global.owner.map(o => o + "@s.whatsapp.net").includes(sender)
      const isAdmin = cached?.admins.includes(sender)

      if (!isOwner && !isAdmin && sender !== botJid) {
        await antilink.execute(client, m)
      }
      return
    }

    // ===== COOLDOWN =====
    if (inCooldown(sender, command)) {
      return client.reply(
        m.chat,
        "⏳ Espera un momento...",
        m,
        global.channelInfo
      )
    }

    // ===== DATOS DE GRUPO =====
    let isAdmins = false
    let isBotAdmins = false
    let groupName = ""

    if (isGroup) {
      let cached = groupCache.get(from)

      if (!cached || cached.expires < Date.now()) {
        const meta = await client.groupMetadata(from).catch(() => null)
        if (meta) {
          cached = {
            admins: meta.participants.filter(p => p.admin).map(p => p.jid),
            subject: meta.subject || "",
            expires: Date.now() + GROUP_TTL
          }
          groupCache.set(from, cached)
        }
      }

      if (cached) {
        groupName = cached.subject
        isAdmins = cached.admins.includes(sender)
        isBotAdmins = cached.admins.includes(botJid)
      }
    }

    // ===== PERMISOS (FIX DEFINITIVO) =====
    const isOwner = global.owner.map(o => o + "@s.whatsapp.net").includes(sender)

    if ((cmd.isOwner || cmd.owner) && !isOwner)
      return client.reply(m.chat, "⚠️ Solo el owner.", m, global.channelInfo)

    if ((cmd.isGroup || cmd.group) && !isGroup)
      return client.reply(m.chat, "⚠️ Solo en grupos.", m, global.channelInfo)

    if ((cmd.isAdmin || cmd.admin) && !isAdmins)
      return client.reply(m.chat, "⚠️ Debes ser admin.", m, global.channelInfo)

    if ((cmd.isBotAdmin || cmd.botAdmin) && !isBotAdmins)
      return client.reply(m.chat, "⚠️ Necesito admin.", m, global.channelInfo)

    // ===== REGISTRO PRIMER USO =====
    try {
      registerUse(
        sender,
        command,
        from,
        isGroup,
        m.pushName,
        async (user) => {
          const msg = `
👋 *BIENVENIDO A KILLUA BOT DV*

📛 Usuario: *${user.name}*
📱 Número: *${user.number}*

✨ Gracias por usar el bot por primera vez.
Escribe *menu* para ver mis comandos 🤖
`
          await client.sendMessage(
            from,
            { text: msg },
            { quoted: m, ...global.channelInfo }
          )
        }
      )
    } catch (e) {
      console.log("STATS ERROR:", e)
    }

    // ===== LOG =====
    console.log(
      chalk.green("[CMD]"),
      chalk.cyan(command),
      "|",
      chalk.white(sender),
      chalk.gray(isGroup ? groupName : "Privado")
    )

    // ===== EJECUTAR COMANDO =====
    await cmd.run(client, m, args, {
      text,
      prefix: usedPrefix || ".",
      command
    })

  } catch (e) {
    console.log(chalk.red("MAIN ERROR:"), e)
  }
}

// ===== EXPORT =====
global.mainHandler = mainHandler
module.exports = mainHandler

// ===== HOT RELOAD =====
const file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  delete require.cache[file]
  require(file)
  console.log(chalk.yellow("♻ main.js recargado"))
})

