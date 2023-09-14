let CONFIG = {
  shelly_id: null,
};

Shelly.call("Shelly.GetDeviceInfo", {}, function (result) {
  if (result && result.id) {
    CONFIG.shelly_id = result.id;
    MQTT.subscribe(
      buildMQTTStateCmdTopics("rpc"),
      DecodeDomoticzFaultyJSON
    );
  } else {
    console.log("Failed to get Shelly device info:", result);
  }
});

function buildMQTTStateCmdTopics(topic) {
  let _t = topic || "";
  return CONFIG.shelly_id + "/" + _t;
}

/**
 * @param {string} topic
 * @param {string} message
 */
function DecodeDomoticzFaultyJSON(topic, message) {
  try {
    let trimmedMessage = message.trim();
    if (trimmedMessage) {
      let req = JSON.parse(trimmedMessage);
      for (let r in req) {
        if (r.indexOf("GoToPosition") !== -1) {  // Check if "GoToPosition" is present in the key
          SetCoverPosition(req[r]);
          break;
        }
      }
    }
  } catch (error) {
    console.log("Error parsing JSON:", error);
  }
}

function SetCoverPosition(position) {
  Shelly.call("Cover.GoToPosition", {
    id: 0,
    pos: position,
  });
}
