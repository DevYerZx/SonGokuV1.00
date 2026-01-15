let isNumber = (x) => typeof x === "number" && !isNaN(x)

function initDB(m) {
  let user = global.db.data.users[m.sender]
  let chats = global.db.data.chats[m.chat]

  if (typeof user !== "object") global.db.data.users[m.sender] = {}
  if (user) {
    if (!("registered" in user)) user.registered = false
    if (!("name" in user)) user.name = m.name
    if (!isNumber(user.age)) user.age = -1
    if (!isNumber(user.regTime)) user.regTime = -1
  }

  if (!global.db.data.inventory) global.db.data.inventory = {}
  if (typeof global.db.data.inventory[m.sender] !== "object") {
    global.db.data.inventory[m.sender] = {}
  }

  if (typeof chats !== "object") global.db.data.chats[m.chat] = {}
  if (chats) {
    if (!("antilink" in chats)) chats.antilink = false
  } else {
    global.db.data.chats[m.chat] = { antilink: false }
  }
}

module.exports = initDB
