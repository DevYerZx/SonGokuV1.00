const { getUser } = require("./economy")

function canStealFromBank(targetId) {
  const target = getUser(targetId)
  return !target.premium
}

module.exports = { canStealFromBank }
