const express = require("express")
const fileUpload = require("express-fileupload")
const Tesseract = require("tesseract.js")
const path = require('path');

const app = express()

app.use(fileUpload())

app.get("/", (_, res) => {
  res.send(`
    <form action='/upload' method='post' encType="multipart/form-data">
      <input type="file" name="sampleFile" />
      <input type='submit' value='Upload!' />
    </form>`)
})

app.post("/upload", async (req, res) => {
  const { sampleFile } = req.files
  if (!sampleFile) return res.status(400).send("No files were uploaded.")
  try {
    const { data } = await Tesseract.recognize(sampleFile.data, "eng+ind", {
      logger: (m) => console.log(m),
      langPath: path.join(__dirname, '../lang-data')
    })
    // return console.log('data',data)
    res.send(`<pre>${data.text}</pre><>${data.confidence}</><>${req}</><button onclick="location.href='/'" type="button">Back</button>`)
  } catch (error) {
    throw error
  }
})

app.listen(process.env.PORT || 3000)