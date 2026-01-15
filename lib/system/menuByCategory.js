/**
 * Devuelve una lista de comandos por categoría
 * Usa global.comandos (Map cargado por commandLoader)
 */

function getCommandsByCategory(category, prefix = ".") {
  if (!global.comandos || typeof global.comandos.forEach !== "function") {
    return "❌ Sistema de comandos no cargado."
  }

  const comandos = []

  global.comandos.forEach((cmd, name) => {
    if (cmd.categoria === category) {
      comandos.push(`• ${prefix}${name}`)
    }
  })

  if (!comandos.length) {
    return "❌ No hay comandos en esta categoría."
  }

  return comandos.sort().join("\n")
}

module.exports = {
  getCommandsByCategory
}
