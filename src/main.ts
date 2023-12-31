/*
 * Created with @iobroker/create-adapter v2.3.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';
import strava from 'strava-v3';

// Load your modules here, e.g.:
// import * as fs from "fs";
class Strava extends utils.Adapter {
	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: 'strava',
		});
		this.on('ready', this.onReady.bind(this));
		this.on('stateChange', this.onStateChange.bind(this));
		// this.on('objectChange', this.onObjectChange.bind(this));
		this.on('message', this.onMessage.bind(this));
		this.on('unload', this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {
		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		this.log.info('config clientId: ' + this.config.clientId);
		this.log.info('config clientSecret: ' + this.config.clientSecret);
		this.log.info('config authCode: ' + this.config.authCode);

		// Initialize your adapter here

		if (!this.config.clientId || !this.config.clientSecret) {
			this.log.error('ERROR - client id AND client secret MUST be configured');
			return;
		}
		strava.config({
			access_token: 'Your apps access token (Required for Quickstart)',
			client_id: this.config.clientId,
			client_secret: this.config.clientSecret,
			redirect_uri: 'http://localhost',
		});

		if (this.config.authUrl) {
			this.log.error('Please use the url : ' + this.config.authUrl);
			return;
		}
		if (!this.config.authCode) {
			const oauthArgs = {
				client_id: this.config.clientId,
				redirect_uri: 'http://localhost',
				response_type: 'code',
			};
			const url = strava.oauth.getRequestAccessURL(oauthArgs).toString();
			this.config.authUrl = url;
			this.log.info(url);
		}

		// if (!this.config.accessToken) {
		// 	const r = await strava.oauth.getToken(this.config.authCode);
		// 	this.log.info('response : ' + JSON.stringify(r));
		// 	this.log.info('access_token : ' + r.access_token);
		// 	this.log.info('refreh_token : ' + r.refresh_token);
		// }
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private onUnload(callback: () => void): void {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);

			callback();
		} catch (e) {
			callback();
		}
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  */
	// private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
	// 	if (obj) {
	// 		// The object was changed
	// 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	// 	} else {
	// 		// The object was deleted
	// 		this.log.info(`object ${id} deleted`);
	// 	}
	// }

	/**
	 * Is called if a subscribed state changes
	 */
	private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  */
	private onMessage(obj: ioBroker.Message): void {
		this.log.info('on message: ' + JSON.stringify(obj));
		if (typeof obj === 'object' && obj.message) {
			if (obj.command === 'send') {
				// e.g. send email or pushover or whatever
				this.log.info('send command');

				// Send response in callback if required
				if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
			}
		}
	}
}

if (require.main !== module) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new Strava(options);
} else {
	// otherwise start the instance directly
	(() => new Strava())();
}
