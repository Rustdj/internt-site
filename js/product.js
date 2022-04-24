//form
// const form = document.document.querySelectorAll('data-simplebar');

// function eventForm(value) {
//     if (value === "form") {
//         alert('Please enter')
//     }
// }



const product = document.querySelectorAll('.product');

if (product) {
    product.forEach(el => {
        let currentProduct = el;
        const imageSwitchItems = currentProduct.querySelectorAll('.image-switch__item');
        const imagePagination = currentProduct.querySelector('.image-pagination');
        if (imageSwitchItems.length > 1) {
            imageSwitchItems.forEach((el, index) => {
                el.setAttribute('data-index', index);
                imagePagination.innerHTML += `<li class="image-pagination__item ${index == 0 ? 'image-pagination__item-active' : ''}"  data-index='${index}'></li>`;
                el.addEventListener('mouseenter', (e) => {
                    currentProduct.querySelectorAll('.image-pagination__item').forEach(el => {el.classList.remove('image-pagination__item-active')});
                    currentProduct.querySelector(`.image-pagination__item[data-index='${e.currentTarget.dataset.index}']`).classList.add('image-pagination__item-active');
                });
                el.addEventListener('mouseleave', (e) => {
                    currentProduct.querySelectorAll('.image-pagination__item').forEach(el => {el.classList.remove('image-pagination__item-active')});
                    currentProduct.querySelector(`.image-pagination__item[data-index='0']`).classList.add('image-pagination__item-active');
                });
            });
            
        }
        
    });
}


// grid

const fixedBlock = document.querySelector('.filters-price'),
      filters = document.querySelector('.filters'),
      gutter = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gutter')),
      container = document.querySelector('.container'),
      offsetLeft = container.offsetLeft + gutter;
      filtersOffsetTop = filters.offsetTop,
      filtersWidth = filters.offsetWidth,
      smallOffset = gutter;


const fixedScrollBlock = () => {
    let scrollDistance = window.scrollY;

    if (scrollDistance > (filtersOffsetTop - smallOffset) && scrollDistance <= (filters.offsetHeight + filtersOffsetTop))  {
        fixedBlock.style.left = `${offsetLeft}px`;
        fixedBlock.style.width = `${filtersWidth}px`;
        fixedBlock.classList.remove('absolute');
        fixedBlock.classList.add('fixed');
    } else {
        fixedBlock.style.left = `0px`;
        fixedBlock.style.width = `100%`;
        fixedBlock.classList.remove('fixed');
    }

    if (scrollDistance >= (filtersOffsetTop - smallOffset) + filters.offsetHeight - fixedBlock.offsetHeight) {
        fixedBlock.classList.add('absolute');
        fixedBlock.style.left = `0px`;
        fixedBlock.style.width = `100%`;
        fixedBlock.classList.remove('fixed');
    }
};

window.addEventListener('scroll', fixedScrollBlock);

// Cart

const productsBtn = document.querySelectorAll('.product__btn');
const cartProductList = document.querySelector('.cart-content__list');
const cart = document.querySelector('.cart');
const cartQuantity = document.querySelector('.cart__quantity');
const fullPrice = document.querySelector('.fullprice');
let price = 0; // для выводв количества товаров в корзине
let productArray = [];

const randomId = () => { // связывает кнопки
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const priceWithoutSpaces = (str) => {  // удаляет пробелы у строки с ценой
    return str.replace(/\s/g, '');
};

const normalPrice = (str) => {  // преобразует строку с суммой с пробелом '23 234 ₽'
    return String(str).replace(/(\d)(?=(\d\d\d)+([ˆ\d]|$))/g, '$1 ');
};


const plusFullPrice = (currentPrice) => {
    return price += currentPrice;
};

const minusFullPrice = (currentPrice) => {
    return price -= currentPrice;
};

const printFullPrice = () => {
    fullPrice.textContent = `${normalPrice(price)} €`
};

const printQuantity = () => {
    let length = cartProductList.querySelector('.simplebar-content').children.length;
    cartQuantity.textContent = length;
    length > 0 ? cart.classList.add('active') : cart.classList.remove('active')
};


const generateCartProduct = (img, title, price, id) => {
    return `

        <li class="cart-content__item">
        <article class="cart-content__product cart-product" data-id='${id}'>
            <img src="${img}" alt="Макбук" class="cart-product__img">
                <div class="cart-product__text">
                <h3 class="cart-product__title">${title}</h3>
            <span class="cart-product__price">${normalPrice(price)} €</span>
            </div>
            <button class="cart-product__delete" aria-label="Удалить товар"></button>
            </article>
        </li>
    `;
};

// delete

const deleteProduct = (productParent) => {

    let id = productParent.querySelector('.cart-product').dataset.id;
    document.querySelector(`.product[data-id='${id}']`).querySelector('.product__btn').disabled = false

    let currentPrice = parseInt(priceWithoutSpaces(productParent.querySelector('.cart-product__price').textContent))
    minusFullPrice(currentPrice);
    printFullPrice();
    productParent.remove();
    printQuantity();
};

productsBtn.forEach(el => {
    el.closest('.product').setAttribute('data-id', randomId());
    el.addEventListener('click', (e) => {
        let self = e.currentTarget;
        let parent = self.closest('.product');
        let id = parent.dataset.id;
        let img = parent.querySelector('.image-switch__img img').getAttribute('src');
        let title = parent.querySelector('.product__title').textContent;
        //let priceString = parent.querySelector('.product-price__current').textContent;
        let priceNumber = parseInt(priceWithoutSpaces(parent.querySelector('.product-price__current').textContent));

        plusFullPrice(priceNumber);// summ
        printFullPrice();// print full price
        cartProductList.querySelector('.simplebar-content').insertAdjacentHTML('afterbegin', generateCartProduct(img, title, priceNumber, id));// add to cart
        printQuantity();// count and print quantity
        self.dasabled = true; // disabled btn
    });
});


cartProductList.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-product__delete')) {
        deleteProduct(e.target.closest('.cart-content__item'))
    }
});

// Modal

const orderModalOpenProd = document.querySelector('.order-modal__btn');
const orderModalList = document.querySelector('.order-modal__list');


let flag = 0;

orderModalOpenProd.addEventListener('click', (e) => {
    if (flag == 0) {
        orderModalOpenProd.classList.add('open');
        orderModalList.style.display = 'block';
        flag = 1;
    } else {
        orderModalOpenProd.classList.remove('open');
        orderModalList.style.display = 'none';
        flag = 0;
    }
});


// Заполнение товарами и отправление на почту


const generateModalProduct = (img, title, price, id) => {
	return `
		<li class="order-modal__item">
			<article class="order-modal__product order-product" data-id="${id}">
				<img src="${img}" alt="" class="order-product__img">
				<div class="order-product__text">
					<h3 class="order-product__title">${title}</h3>
					<span class="order-product__price">${normalPrice(price)}</span>
				</div>
				<button class="order-product__delete">Удалить</button>
			</article>
		</li>
	`;
};

const modal = new GraphModal({
	isOpen: (modal) => {
		console.log('opened');
		let array = cartProductList.querySelector('.simplebar-content').children;
		let fullprice = fullPrice.textContent;
		let length = array.length;

		document.querySelector('.order-modal__quantity span').textContent = `${length} шт`;
		document.querySelector('.order-modal__summ span').textContent = `${fullprice}`;
		for (item of array) {
			console.log(item)
			let img = item.querySelector('.cart-product__img').getAttribute('src');
			let title = item.querySelector('.cart-product__title').textContent;
			let priceString = priceWithoutSpaces(item.querySelector('.cart-product__price').textContent);
			let id = item.querySelector('.cart-product').dataset.id;

			orderModalList.insertAdjacentHTML('afterbegin', generateModalProduct(img, title, priceString, id));

            let obj = {};
            obj.title = title;
            obj.price = priceString;
            productArray.push(obj);

        }

       console.log(productArray)
    },
    isClose: () => {
        console.log('closed');
    }
});

document.querySelector('.order').addEventListener('submit', (e) => {
    e.preventDefault();
    let self = e.currentTarget;

    let formData = new FormData(self);
    let name = self.querySelector('[name="Имя"]').value;
    let tel = self.querySelector('[name="Телефон"]').value;
    let mail = self.querySelector('[name="Email"]').value;
    formData.append('Товары', JSON.stringify(productArray));
    formData.append('Имя', name);
    formData.append('Телефон', tel);
    formData.append('Email', mail);

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log('Отправлено');
            }
        }
    }

    xhr.open('POST', 'mail.php', true);
    xhr.send(formData);

    self.reset();
});


let selector = document.querySelectorAll('input[type="tel"]');

let im = new Inputmask('+7 (999) 999-99-99');

im.mask(selector);




