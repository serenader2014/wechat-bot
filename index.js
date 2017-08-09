const { Wechaty, Contact } = require('wechaty')
const express = require('express')
const qr = require('qrcode-terminal')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 8765
const bot = Wechaty.instance()

bot
.on('login', user => main(user))
.on('logout', user => console.info('Bot', `${user.name()} logouted`))
.on('error', e => console.info('Bot', 'error: %s', e))
.on('scan', (url, code) => {
  if (!/201|200/.test(String(code))) {
    const loginUrl = url.replace(/\/qrcode\//, '/l/')
    qr.generate(loginUrl)
  }
  console.log(`${url}\n[${code}] Scan QR Code in above url to login: `)
})
.init()
.catch(e => console.error(e))

async function main(user) {
  console.log(`${user} login`)

  const target = await Contact.find({ name: process.env.WECHAT_BOT_CONTACT })

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.post('/message', async (req, res) => {
    if (req.body.secret === process.env.WECHAT_BOT_SECRET) {
      await target.say(req.body.content)
      res.send('ok')
    } else {
      res.send('secret not correct')
    }
  })

  app.listen(port, () => console.log(`Wechat bot is listening on port ${port}`))
}
