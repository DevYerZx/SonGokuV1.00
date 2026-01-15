const { getUser, addJenny, saveEco } = require("../../lib/economy")

const preguntas = [
  // =====================
  // CULTURA GENERAL (15)
  // =====================
  { q: "¿Cuánto es 12 + 8?", a: "20" },
  { q: "¿Cuántos continentes hay?", a: "7" },
  { q: "¿Cuál es el océano más grande del mundo?", a: "pacifico" },
  { q: "¿En qué planeta vivimos?", a: "tierra" },
  { q: "¿Cuántos días tiene un año bisiesto?", a: "366" },
  { q: "¿Cuál es el animal más grande del mundo?", a: "ballena azul" },
  { q: "¿Cuál es el metal más valioso?", a: "oro" },
  { q: "¿Cuál es el idioma más hablado del mundo?", a: "ingles" },
  { q: "¿Qué gas respiramos?", a: "oxigeno" },
  { q: "¿Cuántas horas tiene un día?", a: "24" },
  { q: "¿Cuál es la estrella más cercana a la Tierra?", a: "sol" },
  { q: "¿Cuál es el país más grande del mundo?", a: "rusia" },
  { q: "¿Cuántos lados tiene un triángulo?", a: "3" },
  { q: "¿Cuál es el resultado de 9 x 9?", a: "81" },
  { q: "¿Qué color se obtiene al mezclar rojo y azul?", a: "morado" },

  // =====================
  // PERÚ 🇵🇪 (15)
  // =====================
  { q: "¿Capital del Perú?", a: "lima" },
  { q: "¿Cuál es la moneda del Perú?", a: "sol" },
  { q: "¿Cómo se llama la ciudadela inca más famosa?", a: "machu picchu" },
  { q: "¿Qué animal es símbolo del Perú?", a: "vicuña" },
  { q: "¿Cuál es el lago navegable más alto del mundo?", a: "titicaca" },
  { q: "¿Qué cultura hizo las líneas de Nazca?", a: "nazca" },
  { q: "¿Cómo se llama la cordillera del Perú?", a: "andes" },
  { q: "¿En qué departamento se encuentra Cusco?", a: "cusco" },
  { q: "¿Qué ave aparece en el escudo del Perú?", a: "gallito de las rocas" },
  { q: "¿Cuál es el plato típico hecho con pescado crudo?", a: "ceviche" },
  { q: "¿Cuál es el río más largo del Perú?", a: "amazonas" },
  { q: "¿Qué imperio gobernó el antiguo Perú?", a: "inca" },
  { q: "¿En qué mes se celebra Fiestas Patrias?", a: "julio" },
  { q: "¿Qué desierto está en la costa peruana?", a: "sechura" },
  { q: "¿Cuál es la capital gastronómica del Perú?", a: "lima" },

  // =====================
  // DRAGON BALL Z 🐉 (15)
  // =====================
  { q: "¿Cómo se llama el protagonista de Dragon Ball Z?", a: "goku" },
  { q: "¿Cuál es la raza de Goku?", a: "saiyajin" },
  { q: "¿Quién es el príncipe de los saiyajin?", a: "vegeta" },
  { q: "¿Quién destruyó el planeta Vegeta?", a: "freezer" },
  { q: "¿Cómo se llama el hijo mayor de Goku?", a: "gohan" },
  { q: "¿Quién entrenó a Goku cuando era niño?", a: "maestro roshi" },
  { q: "¿Cómo se llama la nube voladora de Goku?", a: "nube voladora" },
  { q: "¿Qué fusión usa los aretes potara?", a: "vegito" },
  { q: "¿Cómo se llama el dragón que concede deseos?", a: "shen long" },
  { q: "¿Quién creó las esferas del dragón en la Tierra?", a: "kami sama" },
  { q: "¿Cómo se llama el hermano de Goku?", a: "raditz" },
  { q: "¿Cuál es la transformación legendaria saiyajin?", a: "super saiyajin" },
  { q: "¿Quién es el androide más fuerte?", a: "androide 17" },
  { q: "¿Cómo se llama el villano perfecto?", a: "cell" },
  { q: "¿Qué técnica usa Goku más famosa?", a: "kamehameha" }
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