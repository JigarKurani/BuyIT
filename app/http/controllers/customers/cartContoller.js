function cartController() {
    return {
        index(req, res){
            res.render("customers/cart")
        },
        update(req, res){
            if (!req.session.cart) {
                req.session.cart = {
                    items : {},
                    totalQty : 0,
                    totalPrice : 0
                }
            }

            let cart = req.session.cart
            if (!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item : req.body,
                    qty : 1
                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            } else {
                cart.totalQty = cart.totalQty + 1
                cart.items[req.body._id].item.size +=":"+req.body.size
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }
            return res.json({totalQty: req.session.cart.totalQty})
        },
        remove(req, res) {
            var productId = req.body.item._id

            var cartTemp = {
                items : {},
                totalQty : 0,
                totalPrice : 0
            }
            let a = req.session.cart.items

            for(child in a)
            {
                if(productId != child)
                {
                    cartTemp.items[child] = {
                        item : a[child].item,
                        qty : a[child].qty
                    }
                    cartTemp.totalQty = cartTemp.totalQty + a[child].qty
                    cartTemp.totalPrice = cartTemp.totalPrice + a[child].item.price * a[child].qty
                }
            }

            req.session.cart = cartTemp
            return res.json({totalQty: req.session.cart.totalQty})
        }
    }
}



module.exports = cartController