const os = require("os")

let lastPing = Date.now()
let latency = 0

function heartbeat() {
  latency = Date.now() - lastPing
  lastPing = Date.now()
}

function getStats() {
  return {
    latency,
    uptime: formatTime(process.uptime()),
    ramUsedMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
    cpuLoad: os.loadavg()[0].toFixed(2),
  }
}

function formatTime(sec) {
  sec = Math.floor(sec)
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return `${h}h ${m}m ${s}s`
}

module.exports = {
  heartbeat,
  getStats,
}
