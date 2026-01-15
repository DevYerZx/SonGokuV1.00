const { exec } = require("child_process")
const path = require("path")

module.exports = function compressVideo(inputPath) {
  return new Promise((resolve, reject) => {
    const outputPath = inputPath.replace(".mp4", "_compressed.mp4")

    const cmd = `
      ffmpeg -y -i "${inputPath}" \
      -vf scale=1280:-2 \
      -vcodec libx264 \
      -crf 28 \
      -preset veryfast \
      -acodec aac -b:a 96k \
      "${outputPath}"
    `

    exec(cmd, (err) => {
      if (err) return reject(err)
      resolve(outputPath)
    })
  })
}
