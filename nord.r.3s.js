#!/bin/node

const {exec} = require("mz/child_process");

const CMD = "nordvpn";
const CMDSTR = {
	STATUS: `${CMD} status`
};

const getVPNStatus = async () => {
	try{
		const [out] = await exec(CMDSTR.STATUS);
		return out.split("Status: ")[1].includes("Disconnected") ? "Disconnected" : "Connected";
	}catch(e){
		return null;
	}
}

(async () => {
	
	const vpnStatus = await getVPNStatus();
	if (!vpnStatus) {
		console.log("ERROR | color='red'")
		return;
	} else {
		const attr = vpnStatus === "Disconnected" ? "color='yellow'" : "color='green'";
		console.log(`VPN Status: ${vpnStatus} | ${attr}`)
	}

})();
