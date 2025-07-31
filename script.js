document.addEventListener('DOMContentLoaded', () => {
    const order = {}; // { [productId]: count }

    // 1) Ищем все карточки товаров
    document.querySelectorAll('.item').forEach(item => {
        const img    = item.querySelector('img');
        const addBtn = item.querySelector('button.btn');
        // Генерируем числовой ID: из "btn3" → "3"
        const rawId  = addBtn.id || '';
        const id     = rawId.replace(/\D/g, '') || String(Math.random()).slice(-4);
        // Сохраняем в data-атрибуты (для View Order)
        item.dataset.id   = id;
        item.dataset.name = img.alt || `Товар ${id}`;

        // 2) Создаём блок управления количеством
        const controls = document.createElement('div');
        controls.className = 'quantity-controls';
        controls.style.display = 'none';
        controls.style.alignItems = 'center';
        controls.style.justifyContent = 'center';

        const minusBtn = document.createElement('button');
        minusBtn.className = 'btn minus-btn';
        minusBtn.textContent = '−';

        const countEl = document.createElement('span');
        countEl.className = 'item-count';
        countEl.textContent = '0';
        countEl.style.margin = '0 10px';

        const plusBtn = document.createElement('button');
        plusBtn.className = 'btn plus-btn';
        plusBtn.textContent = '+';

        controls.append(minusBtn, countEl, plusBtn);
        item.appendChild(controls);

        // 3) Обработчики
        addBtn.addEventListener('click', () => {
            addBtn.style.display      = 'none';
            controls.style.display    = 'inline-flex';
            updateCount(1);
        });
        plusBtn.addEventListener('click', () => {
            updateCount(getCount() + 1);
        });
        minusBtn.addEventListener('click', () => {
            const newCount = getCount() - 1;
            if (newCount > 0) {
                updateCount(newCount);
            } else {
                delete order[id];
                countEl.textContent       = '0';
                controls.style.display    = 'none';
                addBtn.style.display      = 'inline-block';
            }
        });

        function getCount() {
            return parseInt(countEl.textContent, 10);
        }
        function updateCount(n) {
            countEl.textContent = n;
            order[id]           = n;
        }
    });

    // 4) Кнопка View Order + контейнер списка
    const usercard = document.getElementById('usercard');
    const viewBtn  = document.createElement('button');
    viewBtn.id     = 'view-order';
    viewBtn.className = 'btn';
    viewBtn.textContent = 'View Order';

    const orderList = document.createElement('ul');
    orderList.id = 'order-list';
    orderList.style.listStyle = 'none';
    orderList.style.padding = '0';
    orderList.style.marginTop = '15px';

    usercard.append(viewBtn, orderList);

    viewBtn.addEventListener('click', () => {
        orderList.innerHTML = '';
        const entries = Object.entries(order);
        if (entries.length === 0) {
            orderList.innerHTML = '<li>Пусто</li>';
            return;
        }
        entries.forEach(([prodId, qty]) => {
            const itemDiv = document.querySelector(`.item[data-id="${prodId}"]`);
            const name    = itemDiv.dataset.name;
            const li      = document.createElement('li');
            li.textContent = `${name} — ${qty} шт.`;
            orderList.appendChild(li);
        });
    });
});