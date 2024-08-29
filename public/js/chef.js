let orders = [];
let payout = 0;

function fetchOrders() {
    fetch('/orders')
        .then(response => response.json())
        .then(data => {
            orders = data;
            updateOrders();
        })
        .catch(error => console.error('Error:', error));
}

function completeOrder(index) {
    const order = orders[index];
    const orderTotal = order.total;
    payout += orderTotal;
    orders.splice(index, 1);

    updateOrders();
    updatePayout();

    fetch('/complete-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index, total: orderTotal })
    })
    .catch(error => console.error('Error:', error));
}

function updateOrders() {
    const ordersElement = document.getElementById('orders');
    ordersElement.innerHTML = '';

    orders.forEach((order, index) => {
        const orderTotal = order.total;
        ordersElement.innerHTML += `
            <div class="order">
                <h4>Order #${index + 1}</h4>
                ${order.items.map(item => `
                    <p>${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
                `).join('')}
                <p>Total: $${orderTotal.toFixed(2)}</p>
                <button onclick="completeOrder(${index})">Complete Order</button>
            </div>
        `;
    });
}

function updatePayout() {
    const payoutElement = document.getElementById('payout');
    payoutElement.textContent = `Total Payout: $${payout.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('/payout')
        .then(response => response.json())
        .then(data => {
            payout = data.payout;
            updatePayout();
        })
        .catch(error => console.error('Error:', error));

    fetchOrders();
});
