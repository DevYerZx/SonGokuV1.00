const fs = require("fs")
const path = require("path")

const ecoPath = path.join(__dirname, "../database/economy.json")

function ensureFile() {
  if (!fs.existsSync(ecoPath)) {
    fs.writeFileSync(ecoPath, JSON.stringify({ users: {} }, null, 2))
  }
}

function loadEco() {
  ensureFile()
  try {
    const data = JSON.parse(fs.readFileSync(ecoPath))
    if (!data.users) data.users = {}
    return data
  } catch {
    return { users: {} }
  }
}

let eco = loadEco()

function saveEco() {
  fs.writeFileSync(ecoPath, JSON.stringify(eco, null, 2))
}

function reloadEco() {
  eco = loadEco()
}

function getUser(id) {
  if (!id) throw new Error("ID inválido")

  if (!eco.users[id]) {
    eco.users[id] = {
      id,
      jenny: 0,
      bank: 0,
      xp: 0,
      level: 1,
      premium: false,
      robos: 0,
      lastWork: 0,
      lastDaily: 0,
      lastRob: 0
    }
  }

  const user = eco.users[id]

  user.jenny = Number(user.jenny) || 0
  user.bank = Number(user.bank) || 0
  user.xp = Number(user.xp) || 0
  user.level = Number(user.level) || 1
  user.robos = Number(user.robos) || 0
  user.lastWork = Number(user.lastWork) || 0
  user.lastDaily = Number(user.lastDaily) || 0
  user.lastRob = Number(user.lastRob) || 0
  user.premium = Boolean(user.premium)

  saveEco()
  return user
}

function addJenny(id, amount) {
  const user = getUser(id)
  user.jenny += Math.max(0, Number(amount) || 0)
  saveEco()
  return user.jenny
}

function removeJenny(id, amount) {
  const user = getUser(id)
  user.jenny = Math.max(0, user.jenny - (Number(amount) || 0))
  saveEco()
  return user.jenny
}

function addBank(id, amount) {
  const user = getUser(id)
  user.bank += Math.max(0, Number(amount) || 0)
  saveEco()
  return user.bank
}

function removeBank(id, amount) {
  const user = getUser(id)
  user.bank = Math.max(0, user.bank - (Number(amount) || 0))
  saveEco()
  return user.bank
}

function setPremium(id, value = true) {
  const user = getUser(id)
  user.premium = Boolean(value)
  saveEco()
  return user.premium
}

function resetEconomy() {
  eco = { users: {} }
  saveEco()
}

module.exports = {
  getUser,
  addJenny,
  removeJenny,
  addBank,
  removeBank,
  setPremium,
  resetEconomy,
  saveEco,
  reloadEco
}
