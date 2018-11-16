module.exports = function talentsinfo(mod) {
	const command = mod.command || mod.require.command;
	let warned = false;
	let lvl = 0,
		exp = 0,
		dexp = 0,
        dcap = 0;

    // message on command
    command.add(['talent', 'talents', 'EP'], msg);

    // send message exp/cap (exp%)
    function msg()
	{
        command.message(`<font color="#FDD017">Talents info:</font> LVL <font color="#00FFFF">${lvl}</font>, EXP: <font color="#00FFFF">${exp}</font>, DailyEXP <font color="#00FFFF">${dexp}/${dcap} (${Math.round(100*dexp/dcap)}%) </font>`);
	}
	
	mod.hook('S_LOAD_EP_INFO', 1, event=>{
		exp = event.exp;
		lvl = event.level;
		dexp = event.dailyExp;
		dcap = event.dailyExpMax;
	});
	
	mod.hook('S_PLAYER_CHANGE_EP', 'raw', (code, data)=>{
		let gained = data.readInt32LE(4);
		exp = data.readInt32LE(8); // 64 actually
		lvl = data.readInt32LE(16);
		dexp = data.readInt32LE(20);
		dcap = data.readInt32LE(24);
		if(gained)
		{
			if(dexp >= dcap)
			{
				if(!warned)
				{
					command.message('<font color="#FDD017">Talents EXP</font> DailyCap <font color="#FF0000">reached!</font>');
					warned = true;
				}
			}
			else
			{
				warned = false;
			}
			command.message('<font color="#FDD017">Talents:</font> <font color="#00FFFF">+' + gained + ' EXP</font>' + (!warned ? ' (' + dexp + ' / ' + dcap + ' (DailyCap), <font color="#FFF380">' + (dcap-dexp) + '</font> left for today)' : '' ));
		}
	});
	
	// open EP ui
    mod.hook('C_REQUEST_CONTRACT', 1, event => {
        if (event.type == 77)
		{
            msg();
        }
	});
};
