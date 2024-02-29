// Imports principales
import { Injectable } from "@angular/core";
import Echo from 'laravel-echo';

import { environment as env } from "src/environments/environment";
import Pusher from 'pusher-js';
import axios from 'axios';

@Injectable()
export class WebSocketService {
    
    public echo: any;
 
    constructor() {
        Pusher.logToConsole = env.PUSHER_APP_LOG_TO_CONSOLE;
        this.echo = new Echo({
            broadcaster: env.PUSHER_APP_BROADCASTER,
            key: env.PUSHER_APP_KEY,
            cluster: env.PUSHER_APP_CLUSTER,
            encrypted: true,
            //wsHost: 'http://localhost',
            //wsPort: 6001,
            //authEndpoint: 'http://localhost:8000/broadcasting/auth',
            //disableStats: false,
            authorizer: (channel: any, options: any) => {
                return {
                    authorize: (socketId: any, callback: any) => {
                        const token = localStorage.getItem('token');
                        //console.log(token)
                        axios.post(`${env.APP_API_URL}broadcasting/broad-auth`, {
                            socket_id: socketId,
                            channel_name: channel.name
                        }, {
                            headers: {
                                'Authorization': `${token}`
                            }
                        })
                            .then((response: any) => {
                                callback(null, response.data);
                            })
                            .catch((error: any) => {
                                callback(error);
                            });
                    }
                };
            },
        });
    }



    /*
    private(user_id:string) {
        //let token = localStorage.getItem('token');
        //echo.connector.options.auth.headers['Authorization'] = token;
        //console.log(echo.connector.options.auth.headers['Authorization'])
        this.echo.private(`App.User.${user_id}`).notification((notification:any) => {
            console.log(notification);
        })
    }
    */


    
    //=====================================================================
    /*
    Pusher.logToConsole = true;

    var pusher = new Pusher('cccf578844e628c80d5f', {
      cluster: 'us2',
      forceTLS: true
    });


    var channel = pusher.subscribe('App.User.2');
    channel.bind('my-event', function(data:any) {
      console.log(data)
    });
    */
   //=====================================================================


}
