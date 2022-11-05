import fetch from 'node-fetch'
let handler = async(m, { conn, usedPrefix, command }) => {
  let res = await fetch('https://raw.githubusercontent.com/binjaicity/warga62/master/bocil.json')
  //if (!res.ok) throw await res.json()
  let asup = await res.json()
  let json = asup[Math.floor(Math.random() * asup.length)]
  //if (!json.url) throw 'Error!'
  conn.sendButton(m.chat, '😍', author, json.url, [['NEXT', `${usedPrefix}asupppbocil`]], m)
}
handler.command = /^(asupppbocil)$/i

export default handler
