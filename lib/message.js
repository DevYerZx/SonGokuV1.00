/*************************************************
 * message.js – FIX + OPTIMIZADO
 * Compatible con tu bot actual (100%)
 *************************************************/

const {
  proto,
  delay,
  areJidsSameUser,
  generateWAMessage,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  downloadContentFromMessage,
  generateMessageID,
  generateWAMessageContent,
  getContentType,
  getDevice,
  extractMessageContent,
} = require("@whiskeysockets/baileys")

const chalk = require("chalk")
const fs = require("fs")
const axios = require("axios")
const moment = require("moment-timezone")
const { sizeFormatter } = require("human-readable")
const util = require("util")
const Jimp = require("jimp")
const fetch = require("node-fetch")
const FileType = require("file-type")
const path = require("path")

const {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid,
} = require("../lib/exif")

/* ================== HELPERS ================== */

const unixTimestampSeconds = (date = new Date()) =>
  Math.floor(date.getTime() / 1000)

exports.unixTimestampSeconds = unixTimestampSeconds

exports.getBuffer = async (url, options = {}) => {
  try {
    const res = await axios({
      method: "get",
      url,
      headers: { DNT: 1 },
      ...options,
      responseType: "arraybuffer",
    })
    return res.data
  } catch {
    return null
  }
}

exports.fetchJson = async (url, options = {}) => {
  try {
    const res = await axios({
      method: "GET",
      url,
      headers: { "User-Agent": "Mozilla/5.0" },
      ...options,
    })
    return res.data
  } catch {
    return null
  }
}

exports.runtime = seconds => {
  seconds = Number(seconds)
  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${d}d ${h}h ${m}m ${s}s`
}

exports.parseMention = (text = "") =>
  [...text.matchAll(/@([0-9]{5,16})/g)].map(v => v[1] + "@s.whatsapp.net")

/* ================== DOWNLOAD (UNA SOLA VEZ) ================== */

async function downloadMedia(message) {
  const msg = message.msg || message
  const mime = msg.mimetype || ""
  const type = (message.type || mime.split("/")[0]).replace(/Message/gi, "")
  const stream = await downloadContentFromMessage(msg, type)
  let buffer = Buffer.from([])
  for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
  return buffer
}

/* ================== SMSG ================== */

exports.smsg = (client, m, store) => {
  if (!client._mediaReady) {
    client.downloadMediaMessage = downloadMedia
    client._mediaReady = true
  }

  if (!m) return m

  if (m.key) {
    m.id = m.key.id
    m.chat = m.key.remoteJid
    m.fromMe = m.key.fromMe
    m.isGroup = m.chat.endsWith("@g.us")
    m.sender = client.decodeJid(
      m.fromMe ? client.user.id : m.key.participant || m.chat
    )
  }

  if (m.message) {
    m.type = getContentType(m.message)
    m.msg = extractMessageContent(m.message[m.type]) || m.message[m.type]
    m.body =
      m.msg?.text ||
      m.msg?.caption ||
      m.message?.conversation ||
      ""
    m.text = m.body
    m.mentionedJid = m.msg?.contextInfo?.mentionedJid || []
    m.device = getDevice(m.id)
    m.isMedia = !!m.msg?.mimetype
  }

  /* ===== QUOTED ===== */
  if (m.msg?.contextInfo?.quotedMessage) {
    const q = m.msg.contextInfo
    const type = getContentType(q.quotedMessage)
    const msg = extractMessageContent(q.quotedMessage[type])

    m.quoted = {
      type,
      id: q.stanzaId,
      chat: q.remoteJid || m.chat,
      sender: client.decodeJid(q.participant),
      fromMe: areJidsSameUser(q.participant, client.user.id),
      msg,
      text: msg?.text || msg?.caption || "",
      isMedia: !!msg?.mimetype,
      download: () =>
        client.downloadMediaMessage({
          msg,
          type,
        }),
    }
  }

  /* ===== HELPERS ===== */
  m.reply = (text, opt = {}) =>
    client.sendMessage(
      m.chat,
      { text, mentions: exports.parseMention(text), ...opt },
      { quoted: m }
    )

  m.react = emoji =>
    client.sendMessage(m.chat, { react: { text: emoji, key: m.key } })

  m.download = () => client.downloadMediaMessage(m)

  m.copy = () =>
    exports.smsg(
      client,
      proto.WebMessageInfo.fromObject(
        proto.WebMessageInfo.toObject(m)
      ),
      store
    )

  return m
}

/* ================== HOT RELOAD ================== */

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.yellow(`♻ Update ${__filename}`))
  delete require.cache[file]
  require(file)
})

