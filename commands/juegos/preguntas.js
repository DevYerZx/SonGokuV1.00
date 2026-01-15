const { getUser, addJenny, saveEco } = require("../../lib/economy")

const preguntas = [
  { q: "¿Capital del Perú?", a: "lima" },
  { q: "¿Cuánto es 12 + 8?", a: "20" },
  { q: "¿Color del cielo?", a: "azul" },
  { q: "¿Cuántos continentes hay?", a: "7" }
]

module.exports = {
  command: ["pregunta", "quiz"],
  categoria: "juegos",

  run: async (client, m, args) => {
    const user = getUser(m.sender)

    if (!args[0]) {
      const p = preguntas[Math.floor(Math.random() * preguntas.length)]
      user.lastQuiz = p.a
      saveEco()

      return m.reply(`
🧠 *QUIZ KILLUA*
━━━━━━━━━━━━━━━━
❓ ${p.q}

✍️ Responde con:
.pregunta <respuesta>

💰 Premio: 40 Jenny
`)
    }

    if (!user.lastQuiz) {
      return m.reply("⚠️ Usa primero `.pregunta` para recibir una pregunta.")
    }

    const answer = args.join(" ").toLowerCase()

    if (answer === user.lastQuiz) {
      const reward = 40
      addJenny(m.sender, reward)

      if (user.mision && !user.mision.completada) {
        user.mision.progreso += reward
      }

      user.lastQuiz = null
      saveEco()

      return m.reply(`
✅ *RESPUESTA CORRECTA*
━━━━━━━━━━━━━━━━
💰 +${reward} Jenny
📊 Nuevo saldo: ${getUser(m.sender).jenny}

🧠 Inteligencia +1
`)
    }

    m.reply("❌ Respuesta incorrecta. Intenta otra vez.")
  }
}

