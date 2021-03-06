/*
Factory function for Strom Javascript client.
This methods allows more flexibility for users to inherit/extend methods w/o typical JS hiccups.
Uses only native Javascript + socket.io.

author: Adrian Agnic <adrian@tura.io>
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const StromClient = ({url='http://127.0.0.1:5000', socket=io(url), tokens={}} = {}) => ({
  url,
  socket,
  tokens,

  _setToken(name, token) {
    this.tokens[name] = token;
  },
  _ping() {
    let ping_r = new XMLHttpRequest();
    ping_r.open('GET', this.url, true);
    ping_r.onreadystatechange = function() {
      if (ping_r.readyState === 4) {
        if (ping_r.status === 200) {
          console.log(ping_r.responseText);
        }
      }
    };
    ping_r.send();
  },
  formatData(template, data) {
    let json_tmpl = JSON.parse(template);
    let json_data = data;
    json_tmpl.timestamp = json_data.timestamp;
    json_tmpl.measures.location.val = json_data.location;
    json_tmpl.fields["region-code"] = json_data["region-code"];
    json_tmpl.user_ids.id = json_data.id;
    json_tmpl.user_ids["driver-id"] = json_data["driver-id"];
    json_tmpl.engine_rules["kafka"] = json_data["driver-id"].replace(/\s/g, "");
    let tmpl = json_tmpl;
    return tmpl;
  },
  tokenizeData(name, data) {
    let token = this.tokens[name];
    let json_data = data;;
    for (let i = 0; i < json_data.length; i++) {
      json_data[i]['stream_token'] = token;
      json_data[i]['stream_name'] = name;
    }
    return JSON.stringify(json_data);
  },
  registerDevice(name, template, topic) {
    thus = this;
    json_tmpl = JSON.parse(template);
    json_tmpl['engine_rules']['kafka'] = topic;
    new_tmpl = JSON.stringify(json_tmpl);
    let regDev_r = new XMLHttpRequest();
    regDev_r.open('POST', this.url + '/api/define', false);
    regDev_r.onreadystatechange = function() {
      if (regDev_r.readyState === 4) {
        if (regDev_r.status === 200) {
          console.log('Registration Success.');
          thus._setToken(name, regDev_r.responseText);
        }
      }
    };
    regDev_r.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    regDev_r.send('template=' + encodeURIComponent(new_tmpl));
  },
  registerEvent(eventName, cb, passData=true) {
    socket.on(eventName, function (data) {
        if (passData == true) {
            cb(data);
        } else {
            cb();
        }
    });
  },
  process(name, topic, data) {
    let token_data = this.tokenizeData(name, data);
    send_r = new XMLHttpRequest();
    send_r.open('POST', this.url + '/api/load', true);
    send_r.onreadystatechange = function() {
      if (send_r.readyState === 4) {
        if (send_r.status === 202) {
          //console.log('Socket data sent.');
        }
      }
    };
    send_r.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    send_r.send('data=' + encodeURIComponent(token_data) + '&topic=' + encodeURIComponent(topic));
  }
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
