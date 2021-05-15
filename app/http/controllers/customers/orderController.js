const Order = require('../../../models/order')
const Product = require('../../../models/product')
const Customer =  require('../../../models/user')
const moment = require('moment')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const invoice = require("../customers/invoiceController")
const fs = require("fs")

function orderController () {
    return {
        store(req, res) {
            // Validate request
            const { phone, address, stripeToken, paymentType } = req.body
            if(!phone || !address) {
                return res.status(422).json({ message : 'All fields are required' });
            }
            var dt = new Date();
            var dateT = dt.getMonth().toString() +"/" +dt.getDate().toString() +"/"+ dt.getFullYear().toString()
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                totalPrice:req.session.cart.totalPrice,
                address,
                date: dateT
            })
            order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {


                        for(b in req.session.cart.items)
                        {
                           
                            let a =req.session.cart.items[b].qty
                            Product.find({_id:b},{}).then(function (product) {
                                product[0].bought  = product[0].bought + parseInt(a)
                                product[0].save()
                            })
                        }
                    

                    // Stripe payment
                    if(paymentType === 'card') {
                        stripe.charges.create({
                            amount: req.session.cart.totalPrice  * 100,
                            source: stripeToken,
                            currency: 'inr',
                            description: `Order: ${placedOrder._id}`
                        }).then(() => {
                            placedOrder.paymentStatus = true
                            placedOrder.paymentType = "Card"
                            placedOrder.save().then((ord) => {
                                // Emit
                                const eventEmitter = req.app.get('eventEmitter')
                                eventEmitter.emit('orderPlaced', ord)
                                delete req.session.cart
                                return res.json({ message : 'Payment successful, Order placed successfully' });
                            }).catch((err) => {
                                console.log(err)
                            })

                        }).catch((err) => {
                            delete req.session.cart
                            return res.json({ message : 'Order Placed but payment failed, You can pay at delivery time' });
                        })
                    } else {
                        delete req.session.cart
                        return res.json({ message : 'Order placed succesfully' });
                    }
                })
            }).catch(err => {
                console.log(err)
                return res.status(500).json({ message : 'Something went wrong' });
            })
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id },
                null,
                { sort: { 'createdAt': -1 } } )
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders', { orders: orders, moment: moment })
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)
            // Authorize user
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/orderStatus', { order })
            }
            return  res.redirect('/')
        },
        async invoice(req, res) {
            const order = await Order.findById(req.params.id)
            const cust = await Customer.find({_id:order.customerId},{name:1,_id:0})
            order.name = cust.name

            order.name = cust[0].name
            // Authorize user
            let filePath = './'+req.params.id+".pdf"
            invoice.createInvoice(order,req.params.id+'.pdf',function(rep){
                if(rep.success){

                    res.download(filePath,function(err){
                        fs.unlink(filePath, (err) => {});
                      });                
                }
            });

            
           
        }
    }
}

module.exports = orderController