let cart = []
let modalQt = 1
let modalkey = 0

const c =  (el)=> document.querySelector(el)
const ca = (el)=> document.querySelectorAll(el)

// Listagem das pizzas
pizzaJson.map((item, index) =>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true)
    
    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price[2].toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
    
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault()
        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        modalkey = key
        modalQt = 1
        modalitem = item

        c('.pizzaWindowArea').style.opacity = 0
        c('.pizzaWindowArea').style.display = 'flex'
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1
        }, 100)

        c('.pizzaBig img').src = item.img
        c('.pizzaInfo h1').innerHTML = item.name
        c('.pizzaInfo--desc').innerHTML = item.description
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${item.price[2].toFixed(2)}`
        c('.pizzaInfo--size.selected').classList.remove('selected')

        ca('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2) {
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = item.sizes[sizeIndex]
        })
        c('.pizzaInfo--qt').innerHTML = modalQt
    })

    c('.pizza-area').append(pizzaItem)
})

// Eventos do MODAL
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none'
    }, 100)
}
ca('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal)
})
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
        modalQt--
        c('.pizzaInfo--qt').innerHTML = modalQt
    }
})
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++
    c('.pizzaInfo--qt').innerHTML = modalQt
})
ca('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', ()=>{
        c('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')

        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${modalitem.price[sizeIndex].toFixed(2)}`
    })
})
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size =  parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'))
    let identifier = pizzaJson[modalkey].id+'@'+size
    let key = cart.findIndex((item)=>item.identifier == identifier)
    if(key > -1) {
        cart[key].qt += modalQt
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalkey].id,
            size,
            qt:modalQt
        })
    }
    updatecart()
    closeModal()
})

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0) {
        c('aside').style.left = '0'
    }
})
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw'
})
c('.menu-openner.pc').addEventListener('click', ()=>{
    if(cart.length > 0) {
        c('aside').style.width = '30vw'
    }
})
c('.menu-closer.pc').addEventListener('click', ()=>{
    c('aside').style.width = '0'
})

function updatecart() {
    c('.menu-openner span').innerHTML = cart.length
    c('.menu-openner.pc span').innerHTML = cart.length

    if(cart.length > 0) {
        c('aside').classList.add('show')
        c('.cart').innerHTML = ' '

        let subtotal = 0
        let desconto = 0
        let total = 0 

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id)
            subtotal += pizzaItem.price[cart[i].size] * cart[i].qt
            let cartItem = c('.models .cart--item').cloneNode(true)

            let pizzaSize 
            switch(cart[i].size) {
                case 0:
                    pizzaSize = 'P'
                    break
                case 1:
                    pizzaSize = 'M'
                    break
                case 2:
                    pizzaSize = 'G'
                    break
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSize})`

            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--
                } else {
                    cart.splice(i, 1)
                }
                updatecart()
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++
                updatecart()
            })

            c('.cart').append(cartItem)
        }
        desconto = subtotal * 0.1
        total = subtotal - desconto
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

    } else {
        c('aside').classList.remove('show')
        c('aside').style.left = '100vw'
    }
}