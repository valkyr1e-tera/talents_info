module.exports = function talentsinfo(mod) {
  const expTable = require('./exp').table
  let warned = false
  let lvl = 0,
      exp = 0,
      dexp = 0,
      dcap = 0

  mod.command.add(['talent', 'talents', 'ep'], msg)

  function msg() {
    mod.command.message(`<font color="#FDD017">info:</font> LVL <font color="#00FFFF">${lvl}</font>, EXP: <font color="#00FFFF">${exp}</font>(remaining EXP for next LVL:<font color="#00FFFF">${expTable[lvl+1]-Number(exp)}</font>), DailyEXP <font color="#00FFFF">${dexp}/${sdcap()} (${Math.round(100*dexp/sdcap())}%)</font>`)
  }

  function sdcap() {
    const softcap = 0.8901403358192
    return Math.floor(dcap * softcap)
  }

  mod.hook('S_LOAD_EP_INFO', 1, event => {
    exp = event.exp
    lvl = event.level
    dexp = event.dailyExp
    dcap = event.dailyExpMax
  })

  mod.hook('S_CHANGE_EP_EXP_DAILY_LIMIT', 1, event => {
    dcap = event.limit
  })

  mod.hook('S_PLAYER_CHANGE_EP', 1, event => {
    const gained = event.expDifference
    exp = event.exp
    lvl = event.level
    dexp = event.dailyExp
    dcap = event.dailyExpMax

    if (gained) {
      if (dexp >= sdcap()) {
        if (!warned) {
          mod.command.message('<font color="#FDD017">EXP</font> Daily Cap <font color="#FF0000">reached!</font>')
          warned = true
        }
      } else {
        warned = false
      }

      let message = `<font color="#00FFFF">+${gained} EXP</font>`
      if (warned)
        message += `(${Math.round(event.tsRev * 100)}% mod)`
      else
        message += `(${dexp}/${sdcap()}) (Daily Cap), <font color="#FFF380">${sdcap() - dexp}</font> EXP left for today uncapped)`
      mod.command.message(message)
    }
  })

  // open EP ui
  mod.hook('C_REQUEST_CONTRACT', 1, event => {
    if (event.type === 77)
      msg()
  })
}
