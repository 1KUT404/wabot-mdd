import db from '../lib/database.js'
import { promises } from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'
import { plugins } from '../lib/plugins.js'

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { exp, limit, level, role } = db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let expp = exp - min
    let maxexp = xp
    let totalexp = exp
    let xp4levelup = max - exp
    let name = await conn.getName(m.sender)
    let me = await conn.getName(conn.user.jid)
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(db.data.users).length
    let rtotalreg = Object.values(db.data.users).filter(user => user.registered == true).length
    let help = Object.values(plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    
    let tek = `🖕`
    let tekk = `
╭─「 ${me} 🤖」
│ 👋🏻 Hai, ${name}!
│
│ 🧱 Limit : *${limit} Limit*
│ 🦸🏼‍♂️ Role : *${role}*
│ 🔼 Level : *${level} (${expp} / ${maxexp})*
│ 💫 Total XP : ${totalexp} ✨
│ 
│ 📅 Tanggal: *${week}, ${date}‎* ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ 
│ 🕰️ Waktu: *${time}*
│
│ 📈 Uptime: *${uptime} (${muptime})*
│ 📊 Database: ${rtotalreg} of ${totalreg}
╰────────────`
    const sections = [
      {
        title: 'List Menu Asupan',
        rows: [
          { title: 'Asupan Santuy', rowId: `${_p}asupppsantuy` },
          { title: 'Asupan Bocil', rowId: `${_p}asupppbocil` },
          { title: 'Asupan Geayubi', rowId: `${_p}asupppgeayubi` },
          { title: 'Asupan Ukhty', rowId: `${_p}asupppukhty` },
        ]
      }
    ]
    const listMessage = {
      text: tek,
      footer: tekk,
      buttonText: "Klik Disini",
      sections
    }
    return conn.sendMessage(m.chat, listMessage, { quoted: m, mentions: await conn.parseMention(tek), contextInfo: { forwardingScore: 99999, isForwarded: true }})
}

handler.help = ['asupan']
handler.tags = ['new','fun']
handler.command = /^(asupan)$/i

export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}