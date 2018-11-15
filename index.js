//const Command = require('command')

module.exports = function talentsDailyExpTracker(dispatch) {
    //const command = Command(dispatch)

    let exp = 0,
        cap = 0

    // message on command
    dispatch.command.add(['talent', 'talents', 'enhancement', 'enhancements', 'EP'], msg)

    // send message exp/cap (exp%)
    function msg() {
        dispatch.command.message(`Daily Talents Exp Cap: ${exp}/${cap} (${Math.round(100*exp/cap)}%)`)
    }

    // character log in
    dispatch.hook('S_LOAD_EP_INFO', 1, (event)=>{
        exp = event.dailyExp
        cap = event.dailyExpMax
    })

    // change EP
    dispatch.hook('S_PLAYER_CHANGE_EP', 'raw', (code, data)=>{
        //exp = event.dailyExp
        exp = data.readInt32LE(20)
        //cap = event.dailyExpMax
        cap = data.readInt32LE(24)
        //msg()
    })

    // open EP ui
    dispatch.hook('C_REQUEST_CONTRACT', 1, event => {
        if (event.type == 77) {
            msg()
        }
    })
}