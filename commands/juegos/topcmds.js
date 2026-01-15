const { loadDB } = require("../../lib/stats");

module.exports = {
  command: ["topcmds"],
  categoria: "info",
  description: "Comandos más usados",

  run: async (client, m) => {
    const db = loadDB();

    const cmds = Object.entries(db.commands)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    if (!cmds.length) {
      return client.reply(m.chat, "❌ No hay datos aún.", m);
    }

    let text = "🧠 *TOP COMANDOS*\n\n";

    cmds.forEach(([cmd, count], i) => {
      text += `${i + 1}️⃣ ${cmd} — ${count} usos\n`;
    });

    client.reply(m.chat, text, m);
  }
};
