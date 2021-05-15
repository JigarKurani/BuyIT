import { loadStripe } from '@stripe/stripe-js'
 import { placeOrder } from './apiService'
 import { CardWidget } from './CardWidget'

export async function initStripe() {
    const stripe = await loadStripe('pk_test_51Ib1I4SEriRYiI6aRwV9F3ZqUyQVlWkjGHgLFNbqvKKkMmMVfbPzruL4T9mOCbB1tok6w8KutoyYHfJcvlFv62Bv00g7uR1VU1');
    let card = null;
    

    const paymentType = document.querySelector('#paymentType');
    if(!paymentType) {
        return;
    }
    paymentType.addEventListener('change' , (e)=> {
        console.log(e.target.value)
        if(e.target.value === 'card') {
           card = new CardWidget(stripe)
           card.mount()
        } else {
            card.destroy()
            card = false
        }

    })


  
const paymentForm = document.querySelector('#payment-form');
if(paymentForm) {
    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let formData = new FormData(paymentForm);
        let formObject = {}
        for(let [key, value] of formData.entries()) {
            formObject[key] = value
        }

        if (!card) {
            placeOrder(formObject);
            return;
        }
        const token = await card.createToken()
        formObject.stripeToken = token.id;
        placeOrder(formObject);

    })
}
}