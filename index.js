module.exports = function talentsinfo(mod) {
  const expTable = require('./exp').table
  let level, exp, totalPoints, usedPoints, dailyExp, dailyExpMax
  let warned = false

  mod.command.add('ep', msg)

  function msg() {
    mod.command.message(`LVL: <font color="#00FFFF">${level}</font>, Used EP: <font color="#00FFFF">${usedPoints}/${totalPoints}</font>, EXP: <font color="#00FFFF">${exp}</font>(NEXT: <font color="#00FFFF">${expTable[level+1] - Number(exp)}</font> EXP), DailyEXP: <font color="#00FFFF">${dailyExp}/${sdcap()} (${Math.round(dailyExp / sdcap() * 100)}%)</font>`)
  }

  function updateEP(event) {
    ({ exp, level, dailyExp, dailyExpMax, totalPoints } = event)
  }

  function sdcap() {
    return Math.floor(dailyExpMax * 0.8901403358192)
  }

  mod.hook('S_LOAD_EP_INFO', 1, updateEP)
  mod.hook('S_LOAD_EP_INFO', 1, event => {
    ({ usedPoints } = event)
  })

  mod.hook('S_CHANGE_EP_EXP_DAILY_LIMIT', 1, event => {
    dailyExpMax = event.limit
  })

  mod.hook('S_PLAYER_CHANGE_EP', 1, event => {
    updateEP(event)
    const gained = event.expDifference

    if (gained) {
      if (dailyExp >= sdcap()) {
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
        message += `(${dailyExp}/${sdcap()}(Daily Cap)), <font color="#FFF380">${sdcap() - dailyExp}</font> EXP left for Daily Cap)`
      mod.command.message(message)
    }
  })

  mod.hook('C_REQUEST_CONTRACT', 1, event => {
    // open EP ui
    if (event.type === 77)
      msg()
  })
}
