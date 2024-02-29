// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  APP_CLIENT_URL:null,
  APP_WEB_URL:'http://localhost:8000/',
  APP_API_URL:'http://localhost:8000/api/',
 
  PUSHER_APP_BROADCASTER : 'pusher',
  PUSHER_APP_KEY: 'dfe49ce463c3b69d5a57',
  PUSHER_APP_CLUSTER: 'us2',
  PUSHER_APP_FORCE_TLS: true,
  PUSHER_APP_LOG_TO_CONSOLE: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
