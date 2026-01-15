const { getUser, removeJenny, removeBank } = require("./economy")
const { isCoinsEnabled } = require("./zein")

function getPureNumber(jid = "") {
  return jid.replace(/[^0-9]/g, "")
}

function getRole(m, client) {
  const sender = getPureNumber(m.sender)

  // 👑 Owners
  if (Array.isArray(global.owner) && global.owner.includes(sender)) {
    return "owner"
  }

  // 🤖 Bot
  const botNumber = getPureNumber(client.user?.id || "")
  if (sender === botNumber) {
    return "bot"
  }

  return "user"
}

async function payOrBypass(m, cost, client) {
  // Economía OFF → gratis
  if (!isCoinsEnabled()) {
    return { ok: true, free: true }
  }

  const role = getRole(m, client)

  // 👑 Owner
  if (role === "owner") {
    await client.reply(
      m.chat,
      "👑 *OWNER*\nEste comando es gratuito para ti.",
      m
    )
    return { ok: true, free: true }
  }

  // 🤖 Bot
  if (role === "bot") {
    await client.reply(
      m.chat,
      "🤖 *BOT OFICIAL*\nEste comando es gratuito.",
      m
    )
    return { ok: true, free: true }
  }

  // 👤 Usuario normal
  const user = getUser(m.sender)
  const bank = user.bank || 0
  const jenny = user.jenny || 0
  const total = bank + jenny

  if (total < cost) {
    await client.reply(
      m.chat,
      `💸 *ZEIN insuficiente*\n\n` +
      `Necesitas: ${cost}\n` +
      `Tienes: ${total}\n\n` +
      `Usa: .juegos`,
      m
    )
    return { ok: false }
  }

  // 🏦 Banco primero
  let fromBank = Math.min(bank, cost)
  let remaining = cost - fromBank
  let fromJenny = Math.min(jenny, remaining)

  if (fromBank > 0) removeBank(m.sender, fromBank)
  if (fromJenny > 0) removeJenny(m.sender, fromJenny)

  await client.reply(
    m.chat,
    `💰 *Pago realizado*\n\n🏦 Banco: -${fromBank}\n💵 Jenny: -${fromJenny}`,
    m
  )

  return {
    ok: true,
    free: false,
    fromBank,
    fromJenny
  }
}

module.exports = { payOrBypass }

