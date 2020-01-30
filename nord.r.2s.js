#!/bin/node
const { exec } = require("mz/child_process");

const CMD = "nordvpn";
const CMDSTR = {
  STATUS: `${CMD} status`,
  CONNECT_AUTO: `${CMD} connect`,
  DISCONNECT: `${CMD} disconnect`
};

const getStatusAttr = fullStatus =>
  fullStatus.Connected
    ? { text: "Connected", color: "#09FF00" }
    : fullStatus.Connecting
    ? { text: "Connecting", color: "blue" }
    : { text: "Disconnected", color: "yellow" };
const newVPNStatus = (connected, isConnecting, server, country, city, ip) => {
  return {
    Connected: connected,
    Connecting: isConnecting,
    Server: server,
    Country: country,
    City: city,
    NewIP: ip
  };
};

const getFullVPNStatus = async () => {
  try {
    const [out] = await exec(CMDSTR.STATUS);
    const vpnStatus = out.split("Status: ")[1].split("\n");
    const isConnected = vpnStatus[0] === "Connected";
    const isConnecting = vpnStatus[0] === "Connecting";
    return !isConnected
      ? newVPNStatus(isConnected, isConnecting)
      : newVPNStatus(
          isConnected,
          isConnecting,
          vpnStatus[1].split("Current server: ")[1],
          vpnStatus[2].split("Country: ")[1],
          vpnStatus[3].split("City: ")[1],
          vpnStatus[4].split("Your new IP: ")[1]
        );
  } catch (e) {
    return null;
  }
};

(async () => {
  const fullStatus = await getFullVPNStatus();
  const attr = getStatusAttr(fullStatus);
  const titleStr = `NordVPN: <span color='${attr.color}'>${attr.text}</span>`;
  console.log(titleStr);
  console.log(`---`);
  console.log(titleStr);
  if (fullStatus.Connecting) {
    console.log("Nord VPN is connecting...");
  } else {
    console.log(
      `${fullStatus.Connected ? "Disconnect" : "Connect to"} VPN | bash='${
        fullStatus.Connected ? CMDSTR.DISCONNECT : CMDSTR.CONNECT_AUTO
      }' terminal=false`
    );
  }

  if (fullStatus.Connected) {
    console.log("---");
    const kys = Object.keys(fullStatus);
    for (var i = 2; i < kys.length; i++) {
      console.log(
        `${kys[i]}: <span color='orange'><i>${fullStatus[kys[i]]}</i></span>`
      );
    }
  }

  console.log("---");
  console.log(
    "<b>Author: </b><span color='pink'><i>p0p3yee</i></span> | href='https://github.com/p0p3yee'"
  );
})();
