const { loadDB } = require("../../lib/stats");

module.exports = {
  command: ["stats"],
  categoria: "info",
  description: "Estadísticas del bot",

  run: async (client, m) => {
    const db = loadDB();

    const totalUsers = Object.keys(db.users).length;
    const totalCommands = db.totalCommands;

    let msg = `📊 *ESTADÍSTICAS KILLUA BOT*\n\n`;
    msg += `👥 Usuarios únicos: ${totalUsers}\n`;
    msg += `⚡ Comandos usados: ${totalCommands}\n`;

    client.reply(m.chat, msg, m);
  }
};
