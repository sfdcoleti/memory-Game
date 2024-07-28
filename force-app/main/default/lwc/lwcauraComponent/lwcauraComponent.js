import { api, LightningElement } from 'lwc';

export default class LwcauraComponent extends LightningElement {
    @api title;

    callAura() {
        const event = new CustomEvent('sendmsg', { 
            detail: {
                msg: "Hello from lwc"
            }
        });
        this.dispatchEvent(event);
    }
}
