// Data for menu categories and items
const menu = {
    burgers: [
        { name: 'Cheese Burger', price: 6, image: '/images/burger1.jpg' },
        { name: 'Chicken Burger', price: 7, image: '/images/burger2.jpg' },
        { name: 'Veggie Burger', price: 5, image: '/images/burger3.jpg' },
        { name: 'Double Cheeseburger', price: 8, image: '/images/burger4.jpg' },
        { name: 'Bacon Burger', price: 8, image: '/images/burger5.jpg' },
        { name: 'Fish Burger', price: 7, image: '/images/burger6.jpg' },
        { name: 'Spicy Chicken Burger', price: 7.5, image: '/images/burger7.jpg' },
        { name: 'Mushroom Swiss Burger', price: 8, image: '/images/burger8.jpg' },
        { name: 'BBQ Burger', price: 9, image: '/images/burger9.jpg' },
        { name: 'Impossible Burger', price: 10, image: '/images/burger10.jpg' }
    ],
    fries: [
        { name: 'Regular Fries', price: 3, image: '/images/fries1.jpg' },
        { name: 'Large Fries', price: 4, image: '/images/fries2.jpg' },
        { name: 'Curly Fries', price: 4.5, image: '/images/fries3.jpg' },
        { name: 'Sweet Potato Fries', price: 5, image: '/images/fries4.jpg' },
        { name: 'Garlic Fries', price: 4.5, image: '/images/fries5.jpg' },
        { name: 'Chili Cheese Fries', price: 6, image: '/images/fries6.jpg' },
        { name: 'Cajun Fries', price: 4.5, image: '/images/fries7.jpg' },
        { name: 'Truffle Fries', price: 7, image: '/images/fries8.jpg' },
        { name: 'Parmesan Fries', price: 5.5, image: '/images/fries9.jpg' },
        { name: 'Loaded Fries', price: 8, image: '/images/fries10.jpg' }
    ],
    drinks: [
        { name: 'Coke', price: 2, image: '/images/drink1.jpg' },
        { name: 'Orange Juice', price: 3, image: '/images/drink2.jpg' },
        { name: 'Lemonade', price: 3, image: '/images/drink3.jpg' },
        { name: 'Iced Tea', price: 2.5, image: '/images/drink4.jpg' },
        { name: 'Milkshake', price: 5, image: '/images/drink5.jpg' },
        { name: 'Root Beer', price: 2.5, image: '/images/drink6.jpg' },
        { name: 'Water', price: 1.5, image: '/images/drink7.jpg' },
        { name: 'Energy Drink', price: 4, image: '/images/drink8.jpg' },
        { name: 'Coffee', price: 3, image: '/images/drink9.jpg' },
        { name: 'Green Tea', price: 3.5, image: '/images/drink10.jpg' }
    ]
};

// Default category to display
let currentCategory = 'burgers';

// Cart array to hold selected items
let cart = [];

// Function to display menu items based on the selected category
function showCategory(category) {
    currentCategory = category;
    const menuContainer = document.getElementById('menu');
    menuContainer.innerHTML = ''; // Clear previous items

    menu[category].forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        img.className = 'product-image';

        const name = document.createElement('p');
        name.textContent = item.name;

        const price = document.createElement('p');
        price.textContent = `$${item.price}`;

        const addButton = document.createElement('button');
        addButton.textContent = 'Add to Cart';
        addButton.onclick = () => addToCart(item);

        itemDiv.appendChild(img);
        itemDiv.appendChild(name);
        itemDiv.appendChild(price);
        itemDiv.appendChild(addButton);

        menuContainer.appendChild(itemDiv);
    });
}

// Function to add an item to the cart
function addToCart(item) {
    const cartItem = cart.find(cartItem => cartItem.name === item.name);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCart();
}

// Function to update the cart display
function updateCart() {
    const cartContainer = document.getElementById('cart');
    cartContainer.innerHTML = '<h2>Your Cart</h2>'; // Clear previous cart items

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';

        const name = document.createElement('p');
        name.textContent = `${item.name} x ${item.quantity}`;

        const price = document.createElement('p');
        price.textContent = `$${item.price * item.quantity}`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeFromCart(item);

        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.onclick = () => changeQuantity(item, 1);

        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.onclick = () => changeQuantity(item, -1);

        cartItemDiv.appendChild(name);
        cartItemDiv.appendChild(price);
        cartItemDiv.appendChild(increaseButton);
        cartItemDiv.appendChild(decreaseButton);
        cartItemDiv.appendChild(removeButton);

        cartContainer.appendChild(cartItemDiv);
    });

    const totalDiv = document.createElement('div');
    totalDiv.className = 'cart-total';
    totalDiv.textContent = `Total: $${total}`;

    const placeOrderButton = document.createElement('button');
    placeOrderButton.textContent = 'Place Order';
    placeOrderButton.onclick = placeOrder;

    cartContainer.appendChild(totalDiv);
    cartContainer.appendChild(placeOrderButton);
}

// Function to change the quantity of an item in the cart
function changeQuantity(item, delta) {
    const cartItem = cart.find(cartItem => cartItem.name === item.name);
    cartItem.quantity += delta;
    if (cartItem.quantity <= 0) {
        cart = cart.filter(cartItem => cartItem.name !== item.name);
    }
    updateCart();
}

// Function to remove an item from the cart
function removeFromCart(item) {
    cart = cart.filter(cartItem => cartItem.name !== item.name);
    updateCart();
}

// Function to place an order (sends the cart to the chef)
function placeOrder() {
    if (cart.length === 0) return;

    fetch('/place-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: cart, total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) })
    })
    .then(response => response.json())
    .then(data => {
        alert('Order placed successfully!');
        cart = []; // Clear the cart
        updateCart(); // Refresh the cart display
    })
    .catch(error => console.error('Error:', error));
}

// Display the default category when the page loads
window.onload = () => {
    showCategory(currentCategory);
};
