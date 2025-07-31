document.addEventListener('DOMContentLoaded', () => {

  if (window.Telegram && Telegram.WebApp) {
    const tg = Telegram.WebApp;
    tg.expand();
    tg.MainButton.textColor = '#FFFFFF';
    tg.MainButton.color     = '#2cab37';

    let selectedItem = '';

    document.querySelectorAll('.btn[id^="btn"]').forEach(btn => {
      const id = btn.id.replace(/\D/g, '');
      btn.addEventListener('click', () => {
        if (tg.MainButton.isVisible) {
          tg.MainButton.hide();
        } else {
          tg.MainButton.setText(`Вы выбрали товар ${id}!`);
          selectedItem = id;
          tg.MainButton.show();
        }
      });
    });

    tg.onEvent('mainButtonClicked', () => {
      tg.sendData(selectedItem);
    });

    const usercard = document.getElementById('usercard');
    const p        = document.createElement('p');
    const user     = tg.initDataUnsafe.user || {};
    p.textContent  = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    usercard.appendChild(p);
  }

  const order = {}; 

  document.querySelectorAll('.item').forEach(item => {
    const addBtn = item.querySelector('button.btn');
    const img    = item.querySelector('img');

    const id     = addBtn.id.replace(/\D/g, '');
    item.dataset.id   = id;
    item.dataset.name = img.alt || `Товар ${id}`;

    const controls = document.createElement('div');
    controls.className = 'quantity-controls';
    controls.style.display       = 'none';
    controls.style.alignItems    = 'center';
    controls.style.justifyContent = 'center';
    controls.style.marginTop     = '10px';

    const minusBtn = document.createElement('button');
    minusBtn.textContent = '−';
    minusBtn.className   = 'btn';

    const countEl = document.createElement('span');
    countEl.textContent  = '0';
    countEl.style.margin = '0 8px';

    const plusBtn = document.createElement('button');
    plusBtn.textContent = '+';
    plusBtn.className   = 'btn';

    controls.append(minusBtn, countEl, plusBtn);
    item.appendChild(controls);

    addBtn.addEventListener('click', () => {
      addBtn.style.display    = 'none';
      controls.style.display  = 'inline-flex';
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
        controls.style.display = 'none';
        addBtn.style.display   = '';
      }
    });

    function getCount() {
      return parseInt(countEl.textContent, 10) || 0;
    }
    function updateCount(n) {
      countEl.textContent = n;
      order[id]           = n;
    }
  });

  const usercard = document.getElementById('usercard');
  const viewBtn  = document.createElement('button');
  viewBtn.textContent = 'View Order';
  viewBtn.className   = 'btn';
  viewBtn.style.display = 'block';
  viewBtn.style.marginTop = '20px';

  const orderList = document.createElement('ul');
  orderList.id         = 'order-list';
  orderList.style.padding = '0';
  orderList.style.listStyle = 'none';
  orderList.style.marginTop = '10px';

  usercard.append(viewBtn, orderList);

  viewBtn.addEventListener('click', () => {
    orderList.innerHTML = '';
    const entries = Object.entries(order);
    if (!entries.length) {
      orderList.innerHTML = '<li>Пусто</li>';
      return;
    }
    entries.forEach(([prodId, qty]) => {
      const name = document
        .querySelector(`.item[data-id="${prodId}"]`)
        .dataset.name;
      const li   = document.createElement('li');
      li.textContent = `${name} — ${qty} шт.`;
      orderList.appendChild(li);
    });
  });
});

