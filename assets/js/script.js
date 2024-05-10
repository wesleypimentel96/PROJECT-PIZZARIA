const receive = (el) => document.querySelector(el);
const receiveAll = (el) => document.querySelectorAll(el);
let qtPizza = 1;
let modalKey = 0;
let cart = [];

pizzaJson.map((item, index) => {

    let pizzaItem = receive('.models .pizza-item').cloneNode(true);

    // Setando o atributo ID na tag criada "data-key"
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        //Abrindo modal
        e.preventDefault();
        qtPizza = 1;


        // Pegando o campo ID de cada item
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key;


        receive('.pizzaInfo--size.selected').classList.remove('selected');
        receiveAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
            if (sizeIndex == 2) {
                size.classList.add('selected');
            };
        });

        receive('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        receive('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        receive('.pizzaBig img').src = pizzaJson[key].img;
        receive('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        receive('.pizzaWindowArea').style.opacity = 0;
        receive('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            receive('.pizzaWindowArea').style.opacity = 1;
        }, 250);
        receive('.pizzaInfo--qt').innerHTML = qtPizza;


    });



    receive('.pizza-area').appendChild(pizzaItem);


});

// Eventos do MODAL
let closeModal = () => {

    receive('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        receive('.pizzaWindowArea').style.display = 'none';
    }, 500);
};

receiveAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);

});



receive('.pizzaInfo--qtmais').addEventListener('click', () => {

    receive('.pizzaInfo--qt').innerHTML = qtPizza += 1;

});

receive('.pizzaInfo--qtmenos').addEventListener('click', () => {

    if (qtPizza > 1) {
        receive('.pizzaInfo--qt').innerHTML = qtPizza -= 1;
    };

});

receiveAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', () => {

        receive('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');

    });
});

// Adicionar pizzas ao carrinho e atualizar o carrinho
receive('.pizzaInfo--addButton').addEventListener('click', () => {

    let pizzaSize = parseInt(receive('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifie = pizzaJson[modalKey].id + '@' + pizzaSize;
    let key = cart.findIndex((item) => item.identifie == identifie);

    if (key > -1) {
        cart[key].qt += qtPizza;
    }
    else {
        cart.push({
            identifie,
            id: pizzaJson[modalKey].id,
            pizzaSize,
            qt: qtPizza

        });
    };

    updateCart();
    closeModal();


});


receive('.menu-openner').addEventListener('click', () => {

    if (cart.length > 0) {
        setTimeout(() => {
            receive('aside').style.left = '0vw';
            receive('aside').style.transition = 'all 0.5s';
        }, 300);
    };
});

receive('.menu-closer').addEventListener('click', () => {

    setTimeout(() => {
        receive('aside').style.left = '100vw';
        receive('aside').style.transition = 'all 0.5s';
    }, 300);
});


//Atualizar o carrinho de compras
function updateCart() {

    //Adicionar o quantidade do array no carrinho mobile span
    receive('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        receive('aside').classList.add('show');
        receive('.cart').innerHTML = '';
        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;
            desconto = subtotal * 0.1;
            total = subtotal - desconto;

            let cartItem = receive('.models .cart--item').cloneNode(true);
            let pizzaSizeName;

            switch (cart[i].pizzaSize) {
                case 0:
                    pizzaSizeName = 'P';
                    break;

                case 1:
                    pizzaSizeName = 'M';
                    break;

                case 2:
                    pizzaSizeName = 'G';
                    break;
            };

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('.cart--item img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt += 1;
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt -= 1;

                } else {
                    cart.splice(i, 1);

                };
                updateCart();
            });



            receive('.cart').appendChild(cartItem);
        };

        receive('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        receive('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        receive('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        receive('aside').classList.remove('show');
        receive('aside').style.left = '100vw'
    };
};

