const Command = require('command')

module.exports = function talentsDailyExpTracker(dispatch) {
    const command = Command(dispatch)

    let info

    dispatch.hook('S_LOAD_EP_INFO', 1, (event)=>{
        info = event
    })

    dispatch.hook('S_SHOW_USER_EP_INFO', 1, (event)=>{
        command.message(`Daily Talents Exp Cap: ${info.dailyExp}/${info.dailyExpMax} (${Math.round(100*info.dailyExp/info.dailyExpMax)}%)`)
    })
}