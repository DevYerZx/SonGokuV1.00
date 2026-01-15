const axios = require("axios");

// 🤖 BOT INFO
const BOT_NAME = "KILLUA-BOT v1.00";

// 🌐 RAPID API
const API_URL = "https://youtube-mp36.p.rapidapi.com/dl";
const API_KEY = "c80018ec2cmsh4e7d3cc75d99551p17c25ajsn03c55896f6b7";
const API_HOST = "youtube-mp36.p.rapidapi.com";

// ⏳ Control global
global.pendingDownloads = global.pendingDownloads || new Map();

module.exports = {
  command: ["yt2"],
  categoria: "descarga",
  description: "Descarga audio MP3 desde YouTube",

  run: async (client, m, args) => {
    try {
      if (global.pendingDownloads.get(m.sender)) {
        return client.reply(
          m.chat,
          "⚠️ Tienes un archivo pendiente.\nEspera a que se envíe.",
          m,
          global.channelInfo
        );
      }

      if (!args[0]) {
        return client.reply(
          m.chat,
          "❌ Usa:\n.ytmp3 <link de YouTube>",
          m,
          global.channelInfo
        );
      }

      const url = args[0];
      if (!url.includes("youtu")) {
        return client.reply(
          m.chat,
          "❌ Enlace de YouTube inválido.",
          m,
          global.channelInfo
        );
      }

      const videoId = url.includes("youtu.be")
        ? url.split("youtu.be/")[1].split("?")[0]
        : url.split("v=")[1].split("&")[0];

      global.pendingDownloads.set(m.sender, true);

      await client.reply(
        m.chat,
        `⏳ *Descargando audio...*\nPuede tardar si pesa mucho.\n🤖 ${BOT_NAME}`,
        m,
        global.channelInfo
      );

      const res = await axios({
        method: "GET",
        url: API_URL,
        params: { id: videoId },
        headers: {
          "x-rapidapi-key": API_KEY,
          "x-rapidapi-host": API_HOST,
          "accept": "application/json",
          "accept-encoding": "identity" // 🔑 CLAVE (desactiva brotli)
        },
        decompress: false, // 🔑 CLAVE
        timeout: 60000
      });

      if (!res.data || res.data.status !== "ok" || !res.data.link) {
        throw new Error("API no devolvió audio válido");
      }

      const title = (res.data.title || "audio")
        .replace(/[\\/:*?"<>|]/g, "")
        .trim()
        .slice(0, 60);

      await client.sendMessage(
        m.chat,
        {
          audio: { url: res.data.link },
          mimetype: "audio/mpeg",
          fileName: `${title}.mp3`,
          caption: `🎵 ${title}\n🤖 ${BOT_NAME}`
        },
        {
          quoted: m,
          ...global.channelInfo
        }
      );

    } catch (err) {
      console.error("YTMP3 ERROR:", err.message);
      await client.reply(
        m.chat,
        "❌ No se pudo descargar el audio.\nIntenta con otro video.",
        m,
        global.channelInfo
      );
    } finally {
      global.pendingDownloads.delete(m.sender);
    }
  }
};
