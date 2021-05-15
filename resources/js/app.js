const axios = require("axios")
import { initAdmin } from "./admin"
import moment from "moment"
import Noty from "noty"
import { initStripe } from './stripe'

//Cart
let addToCart = document.querySelectorAll(".add-to-cart")
let cartCounter = document.querySelector("#cartCounter")
let removeCart = document.querySelectorAll(".remove-from-cart")
let productDesc = document.querySelectorAll(".productDesc")
// mobile nav
const butn = document.querySelector(".mobile-menu-button");
const sidebar = document.querySelector(".sidebar");

// add our event listener for the click
if(butn!=null)
{
    butn.addEventListener("click", () => {
        sidebar.classList.toggle("-translate-x-full");
      });
}


function updateCart(product) {
    var ele = document.getElementsByName('size');
    if(ele.length!=0)
    {
        let selected;
        let i;
                for(i = 0; i < ele.length; i++) {
                    if(ele[i].checked)
                    selected = ele[i].value;
                }
        product.size = selected;    
    }
    axios.post("/update-cart", product).then(res =>{
        
        cartCounter.innerText = res.data.totalQty
        new Noty({
            theme:'sunset',
            timeout: 1000,
            progressBar: false,
            text:"Item added To Cart ",

        }).show();
    }).catch(err =>{
        new Noty({
            theme:'sunset',
            type: "error",
            timeout: 1000,
            progressBar: false,
            text:"Something Went Wrong",
            layout: 'bottomCenter',

        }).show();
    })
}
function showProductDesc(product) {
    axios.post("/product", product)
}
productDesc.forEach((btn) => {
    btn.addEventListener("click", () => {
        let product = JSON.parse(btn.dataset.product)
        showProductDesc(product)
    })
})


function removeCartFunction(product) {
    axios.post("/remove-item", product).then(res =>{
        //Yo 
        cartCounter.innerText = res.data.totalQty
        location.reload();
    })
}
addToCart.forEach((btn) => {
    btn.addEventListener("click", () => {
        let product = JSON.parse(btn.dataset.product)
        updateCart(product)
    })
})
removeCart.forEach((btn) => {
    btn.addEventListener("click", () => {
        let product = JSON.parse(btn.dataset.product)
        removeCartFunction(product)
    })
})
//Orders
const alertMsg = document.querySelector("#success-alert")
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 3000)
}
//Orders Status
initStripe()
let statuses = document.querySelectorAll(".status_line")
let hiddenInput = document.querySelector("#hiddenInput")
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)

let time = document.createElement("small")

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove("step-completed")
        status.classList.remove("current")
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add("step-completed")
       } 
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format("hh:mm A")
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add("current")
           }
       }   
    })
}
updateStatus(order)
//Socket intigration

let socket = io()
//Admin

//Join client side
if(order) {
    socket.emit("join", `order_${order._id}`)
}
//Join admin side
let adminAreaPath = window.location.pathname
if (adminAreaPath.includes("admin")) {
    initAdmin(socket)
    socket.emit("join", "adminRoom")
}
//Order updation by socket
socket.on("orderUpdated", (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
})


window.addEventListener('resize', function(){
    addRequiredClass();
})


function addRequiredClass() {
    if (window.innerWidth < 860) {
        document.body.classList.add('mobile')
    } else {
        document.body.classList.remove('mobile') 
    }
}

window.onload = addRequiredClass

let hamburger = document.querySelector('.hamburger')
let mobileNav = document.querySelector('.nav-list')

let bars = document.querySelectorAll('.hamburger span')

let isActive = false

hamburger.addEventListener('click', function() {
    mobileNav.classList.toggle('open')
    if(!isActive) {
        bars[0].style.transform = 'rotate(45deg)'
        bars[1].style.opacity = '0'
        bars[2].style.transform = 'rotate(-45deg)'
        isActive = true
    } else {
        bars[0].style.transform = 'rotate(0deg)'
        bars[1].style.opacity = '1'
        bars[2].style.transform = 'rotate(0deg)'
        isActive = false
    }
})