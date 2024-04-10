import Pusher from "pusher-js";


export default class PusherService {
    pusher: Pusher
    constructor() {
        this.pusher = new Pusher('app-key', {
            cluster: '',
            wsHost: '127.0.0.1',
            wsPort: 6001,
            forceTLS: false,
            enabledTransports: ['ws']
        });
        this.pusher.subscribe('my-channel');
        this.pusher.bind('my-event', this.test);
    }

    test(data: any) {
        console.log(data)
    }
}