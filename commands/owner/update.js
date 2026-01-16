const fs = require("fs")
const path = require("path")
const { exec } = require("child_process")

const COMMANDS_DIR = path.join(__dirname, "..")

function reloadCommands() {
  const commandsMap = new Map()

  function scan(dir) {
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file)

      if (fs.statSync(full).isDirectory()) {
        scan(full)
        continue
      }

      if (!file.endsWith(".js")) continue

      // limpiar cache solo de comandos
      try {
        delete require.cache[require.resolve(full)]
      } catch {}

      const cmd = require(full)
      if (!cmd?.command) continue

      for (const c of cmd.command) {
        commandsMap.set(c, cmd)
      }
    }
  }

  scan(COMMANDS_DIR)

  global.comandos = commandsMap
}

module.exports = {
  command: ["update", "actualizar"],
  description: "Actualiza el bot desde GitHub",
  isOwner: true,
  categoria: "dueño",

  run: async (client, m) => {
    exec("git pull", { cwd: process.cwd() }, (err, stdout, stderr) => {
      if (err) {
        return client.sendMessage(
          m.key.remoteJid,
          { text: `❌ Error al actualizar:\n${stderr || err.message}` },
          { quoted: m }
        )
      }

      reloadCommands()

      let msg
      if (/Already up to date|Ya está actualizado/i.test(stdout)) {
        msg = "✅ *El bot ya está actualizado*"
      } else {
        msg = `✅ *Actualización completada*\n\n${stdout}`
      }

      client.sendMessage(m.key.remoteJid, { text: msg }, { quoted: m })
    })
  },
}


