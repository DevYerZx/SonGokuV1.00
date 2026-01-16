const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")

const P = require("pino")
const fs = require("fs")
const path = require("path")
const chalk = require("chalk")
const { Boom } = require("@hapi/boom")

const { mainHandler } = require("./handler.js")

const SESSION_DIR = path.join(__dirname, "sessions")

if (!fs.existsSync(SESSION_DIR)) {
  fs.mkdirSync(SESSION_DIR, { recursive: true })
}

let sock
let retry401 = 0
const cooldown = new Map()

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR)
  const { version } = await fetchLatestBaileysVersion()

  sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: false, // ❌ NO QR
    markOnlineOnConnect: true,
    keepAliveIntervalMs: 30000,
    browser: ["SonGokuBot", "Chrome", "1.0"]
  })

  sock.ev.on("creds.update", saveCreds)

  // 👉 Vinculación por CÓDIGO
  if (!sock.authState.creds.registered) {
    const code = await sock.requestPairingCode("519XXXXXXXX")
    console.log(chalk.green("🔗 Código de vinculación:"), code)
  }

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update

    if (connection === "close") {
      const statusCode =
        new Boom(lastDisconnect?.error)?.output?.statusCode

      console.log(chalk.red("✖ Conexión cerrada →"), statusCode)

      if (statusCode === 401) {
        retry401++
        console.log(chalk.yellow(`⚠ Error 401 (${retry401})`))

        if (retry401 >= 3) {
          retry401 = 0
          if (!sock.authState.creds.registered) {
            const code = await sock.requestPairingCode("519XXXXXXXX")
            console.log(
              chalk.green("🔑 Nuevo código de vinculación:"),
              code
            )
          }
        }

        return setTimeout(startBot, 5000)
      }

      setTimeout(startBot, 3000)
    }

    if (connection === "open") {
      retry401 = 0
      console.log(chalk.green("✔ Bot conectado correctamente"))
    }
  })

  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const msg = messages[0]
      if (!msg?.message || msg.key.fromMe) return

      const jid =
        msg.key.participant || msg.key.remoteJid

      const now = Date.now()
      if (cooldown.has(jid) && now - cooldown.get(jid) < 600) return
      cooldown.set(jid, now)

      await sock.sendPresenceUpdate(
        "composing",
        msg.key.remoteJid
      )

      await mainHandler(sock, msg)
    } catch (err) {
      console.log(chalk.red("❌ Error en mensaje:"), err)
    }
  })
}

startBot()

process.on("uncaughtException", (err) => {
  console.error("❌ Error crítico:", err)
})

process.on("unhandledRejection", (err) => {
  console.error("❌ Promesa rechazada:", err)
})
