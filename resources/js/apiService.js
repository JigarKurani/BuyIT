import axios from 'axios'
import Noty from 'noty'

export function placeOrder(formObject) {
    axios.post('/orders', formObject).then((res) => {
        new Noty({
            theme:'sunset',
            type: 'success',
            timeout: 1000,
            text: res.data.message,
            progressBar: false,
        }).show();
        setTimeout(() => {
            window.location.href = '/customers/orders';
        }, 1000);
    }).catch((err)=> {
        new Noty({
            theme:'sunset',
            type: 'failed',
            timeout: 1000,
            text: err.res.data.message,
            progressBar: false,
        }).show();
    })
}