// Copyright 2021 Allterco Robotics EOOD
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Shelly is a Trademark of Allterco Robotics

// ShellyPlus2 Cover device SetPosition helper for Domoticz MQTTAD control
// Domoticz rpc control JSON is malformed, this script will interpret it anyway

// Cheers from https://bitekmindenhol.blog.hu/

let CONFIG = {
  shelly_id: null,
};
Shelly.call("Shelly.GetDeviceInfo", {}, function (result) {
  CONFIG.shelly_id = result.id;
  MQTT.subscribe(
    buildMQTTStateCmdTopics("rpc"),
    DecodeDomoticzFaultyJSON
  );
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
 let req = JSON.parse(message);
 let r;
 for (r in req){
    if (r.indexOf("GoToPosition") > 1) {  // if Json contains GoToPosition then do that!
     SetCoverPosition(req[r]);
     break;
    }
 }
}

function SetCoverPosition(position) {
  Shelly.call("Cover.GoToPosition", {
    id: 0,
    pos: position,
  });
}
