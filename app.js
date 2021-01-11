import express from "express"
import config from "config"
import mongoose from "mongoose"
import path from 'path'
import authRoutes from "./routes/auth.routes.js"
import linkRoutes from "./routes/link.routes.js"
import redirectRoutes from "./routes/redirect.routes.js"

const app = express()

app.use(express.json({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/link', linkRoutes)
app.use('/t', redirectRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    return res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = config.get('port') || 5000

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
  } catch (e) {
    console.log("Server Error", e.message)
    process.exit(1)
  }
}

start()


