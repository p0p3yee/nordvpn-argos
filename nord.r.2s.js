#!/bin/node
const { exec } = require("mz/child_process");

const CMD = "nordvpn";
const CMDSTR = {
  STATUS: `${CMD} status`,
  CONNECT_AUTO: `${CMD} connect`,
  DISCONNECT: `${CMD} disconnect`
};
const newOutput = (txt, color) => {
  return {
    text: txt,
    color: color
  };
};

const getVPNStatus = async () => {
  try {
    const [out] = await exec(CMDSTR.STATUS);
    const vpnStatus = out.split("Status: ")[1].split("\n")[0];
    return newOutput(
      vpnStatus,
      vpnStatus === "Disconnected"
        ? "yellow"
        : vpnStatus === "Connecting"
        ? "blue"
        : "#09FF00"
    );
  } catch (e) {
    return newOutput("ERROR", "red");
  }
};

(async () => {
  const vpnStatus = await getVPNStatus();
  const titleStr = `NordVPN: <span color='${vpnStatus.color}'>${vpnStatus.text}</span>`;
  console.log(titleStr);
  console.log(`---`);
  console.log(titleStr);
  console.log(`Connect to VPN | bash='${CMDSTR.CONNECT_AUTO}' terminal=false`);
  console.log(`Disconnect VPN | bash='${CMDSTR.DISCONNECT}' terminal=false`);
})();
