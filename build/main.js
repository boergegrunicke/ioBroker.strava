"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_strava_v3 = __toESM(require("strava-v3"));
class Strava extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "strava"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    this.log.info("config clientId: " + this.config.clientId);
    this.log.info("config clientSecret: " + this.config.clientSecret);
    this.log.info("config authCode: " + this.config.authCode);
    if (!this.config.clientId || !this.config.clientSecret) {
      this.log.error("ERROR - client id AND client secret MUST be configured");
      return;
    }
    import_strava_v3.default.config({
      access_token: "Your apps access token (Required for Quickstart)",
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: "http://localhost"
    });
    if (!this.config.authCode) {
      const oauthArgs = {
        client_id: this.config.clientId,
        redirect_uri: "http://localhost",
        response_type: "code"
      };
      const url = import_strava_v3.default.oauth.getRequestAccessURL(oauthArgs).toString();
      this.config.authUrl = url;
      this.log.info(url);
      return;
    }
    this.log.info("code present ... proceed");
    if (!this.config.accessToken) {
      import_strava_v3.default.oauth.getToken(this.config.authCode, function(e, p) {
        console.log(e);
        console.log(p);
      }).catch((e) => {
        console.log(e);
      });
    }
  }
  onUnload(callback) {
    try {
      callback();
    } catch (e) {
      callback();
    }
  }
  onStateChange(id, state) {
    if (state) {
      this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
    } else {
      this.log.info(`state ${id} deleted`);
    }
  }
}
if (require.main !== module) {
  module.exports = (options) => new Strava(options);
} else {
  (() => new Strava())();
}
//# sourceMappingURL=main.js.map
