import { formatMoney, parseMoney } from '../utils/format.js';

export const renderForm = (container, config, onUpdate) => {
  const handleInput = (e, path) => {
    const val = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setPath(config, path, val);
    onUpdate();
  };

  const setPath = (obj, path, val) => {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = val;
  };

  const createRow = (type, item, index) => {
    if (type === 'income') {
      return `
        <div class="form-row" data-type="incomes" data-index="${index}">
          <input type="text" value="${item.name}" data-prop="name" placeholder="Ad">
          <input type="text" class="text-right money-input" value="${formatMoney(item.amount)}" data-prop="amount" placeholder="Tutar">
          <input type="number" class="text-right" value="${item.increase}" data-prop="increase" placeholder="%">
          <input type="text" value="${item.months}" data-prop="months" placeholder="Aktif Aylar">
          <button class="btn-delete">✕</button>
        </div>
      `;
    }
    if (type === 'expense') {
      return `
        <div class="form-row" data-type="expenses" data-index="${index}">
          <input type="text" value="${item.name}" data-prop="name" placeholder="Ad">
          <input type="text" class="text-right money-input" value="${formatMoney(item.amount)}" data-prop="amount" placeholder="Tutar">
          <input type="number" class="text-right" value="${item.increase}" data-prop="increase" placeholder="%">
          <div style="flex:1"></div>
          <button class="btn-delete">✕</button>
        </div>
      `;
    }
    if (type === 'periodic') {
      return `
        <div class="form-row" data-type="periodic" data-index="${index}">
          <input type="text" value="${item.name}" data-prop="name" placeholder="Ad">
          <input type="text" class="text-right money-input" value="${formatMoney(item.amount)}" data-prop="amount" placeholder="Taksit">
          <input type="number" class="text-right" value="${item.count}" data-prop="count" placeholder="Sayı">
          <input type="number" class="text-right" value="${item.startMonth}" data-prop="startMonth" placeholder="Ay">
          <input type="number" class="text-right" value="${item.increase}" data-prop="increase" placeholder="%">
          <label class="checkbox-label"><input type="checkbox" ${item.repeat ? 'checked' : ''} data-prop="repeat"> Tekrar</label>
          <button class="btn-delete">✕</button>
        </div>
      `;
    }
    if (type === 'annual') {
      return `
        <div class="form-row" data-type="annual" data-index="${index}">
          <input type="text" value="${item.name}" data-prop="name" placeholder="Ad">
          <input type="text" class="text-right money-input" value="${formatMoney(item.amount)}" data-prop="amount" placeholder="Tutar">
          <input type="number" class="text-right" value="${item.month}" data-prop="month" placeholder="Ay">
          <input type="number" class="text-right" value="${item.increase}" data-prop="increase" placeholder="%">
          <div style="flex:1"></div>
          <button class="btn-delete">✕</button>
        </div>
      `;
    }
  };

  container.innerHTML = `
    <div class="form-section">
      <h3>Temel Bilgiler</h3>
      <div class="grid-4">
        <div class="field">
          <label>Başlangıç Bakiyesi (₺)</label>
          <input type="text" class="money-input" value="${formatMoney(config.base.balance)}" data-path="base.balance">
        </div>
        <div class="field">
          <label>Başlangıç Yılı</label>
          <input type="number" value="${config.base.startYear}" data-path="base.startYear">
        </div>
        <div class="field">
          <label>Başlangıç Ayı</label>
          <input type="number" value="${config.base.startMonth}" data-path="base.startMonth">
        </div>
        <div class="field">
          <label>Projeksiyon Süresi (Ay)</label>
          <input type="number" value="${config.base.duration}" data-path="base.duration">
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3>Faiz Ayarları</h3>
      <div class="grid-4">
        <div class="field">
          <label>Yıllık Faiz (%)</label>
          <input type="number" step="0.1" value="${config.interest.rate}" data-path="interest.rate">
        </div>
        <div class="field">
          <label>2 Ayda Düşüş (Puan)</label>
          <input type="number" step="0.1" value="${config.interest.drop}" data-path="interest.drop">
        </div>
        <div class="field">
          <label>Min. Faiz (%)</label>
          <input type="number" step="0.1" value="${config.interest.min}" data-path="interest.min">
        </div>
        <div class="field">
          <label>Stopaj (%)</label>
          <input type="number" step="0.1" value="${config.interest.tax}" data-path="interest.tax">
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="section-header">
        <h3>Sabit Gelirler</h3>
        <div class="header-labels">
          <span>Ad</span>
          <span>Tutar (₺)</span>
          <span>Artış %</span>
          <span>Aktif Aylar</span>
          <span></span>
        </div>
      </div>
      <div id="income-list">
        ${config.incomes.map((item, i) => createRow('income', item, i)).join('')}
      </div>
      <button class="btn-add" data-type="incomes">+ Gelir Ekle</button>
    </div>

    <div class="form-section">
      <div class="section-header">
        <h3>Sabit Giderler</h3>
        <div class="header-labels">
          <span>Ad</span>
          <span>Tutar (₺)</span>
          <span>Artış %</span>
          <span></span>
        </div>
      </div>
      <div id="expense-list">
        ${config.expenses.map((item, i) => createRow('expense', item, i)).join('')}
      </div>
      <button class="btn-add" data-type="expenses">+ Gider Ekle</button>
    </div>

    <div class="form-section">
      <div class="section-header">
        <h3>Dönemsel Giderler</h3>
        <div class="header-labels">
          <span>Ad</span>
          <span>Taksit (₺)</span>
          <span>Sayı</span>
          <span>Baş. Ay</span>
          <span>Artış %</span>
          <span>Tekrar</span>
          <span></span>
        </div>
      </div>
      <div id="periodic-list">
        ${config.periodic.map((item, i) => createRow('periodic', item, i)).join('')}
      </div>
      <button class="btn-add" data-type="periodic">+ Dönemsel Ekle</button>
    </div>

    <div class="form-section">
      <div class="section-header">
        <h3>Yıllık Giderler</h3>
        <div class="header-labels">
          <span>Ad</span>
          <span>Tutar (₺)</span>
          <span>Ay</span>
          <span>Artış %</span>
          <span></span>
        </div>
      </div>
      <div id="annual-list">
        ${config.annual.map((item, i) => createRow('annual', item, i)).join('')}
      </div>
      <button class="btn-add" data-type="annual">+ Yıllık Ekle</button>
    </div>
  `;

  // Event Listeners
  container.querySelectorAll('input[data-path]').forEach(input => {
    input.addEventListener('change', (e) => {
      let val;
      if (e.target.classList.contains('money-input')) {
        val = parseMoney(e.target.value);
        e.target.value = formatMoney(val);
      } else {
        val = parseFloat(e.target.value);
      }
      setPath(config, e.target.dataset.path, val);
      onUpdate();
    });

    input.addEventListener('focus', (e) => {
      if (e.target.classList.contains('money-input')) {
        const val = parseMoney(e.target.value);
        e.target.value = val === 0 ? '' : val;
      }
    });

    input.addEventListener('blur', (e) => {
      if (e.target.classList.contains('money-input')) {
        const val = parseMoney(e.target.value);
        e.target.value = formatMoney(val);
      }
    });
  });

  container.querySelectorAll('.form-row input, .form-row select').forEach(input => {
    const row = input.closest('.form-row');
    const type = row.dataset.type;
    const index = parseInt(row.dataset.index);
    const prop = input.dataset.prop;

    input.addEventListener('change', (e) => {
      let val;
      if (e.target.type === 'checkbox') {
        val = e.target.checked;
      } else if (e.target.classList.contains('money-input')) {
        val = parseMoney(e.target.value);
        e.target.value = formatMoney(val);
      } else if (e.target.type === 'number') {
        val = parseFloat(e.target.value);
      } else {
        val = e.target.value;
      }
      config[type][index][prop] = val;
      onUpdate();
    });

    input.addEventListener('focus', (e) => {
      if (e.target.classList.contains('money-input')) {
        const val = parseMoney(e.target.value);
        e.target.value = val === 0 ? '' : val;
      }
    });

    input.addEventListener('blur', (e) => {
      if (e.target.classList.contains('money-input')) {
        const val = parseMoney(e.target.value);
        e.target.value = formatMoney(val);
      }
    });
  });

  container.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.form-row');
      const type = row.dataset.type;
      const index = parseInt(row.dataset.index);
      config[type].splice(index, 1);
      onUpdate();
      renderForm(container, config, onUpdate); // Re-render to update indices
    });
  });

  container.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      const newItem = { id: Date.now(), name: "", amount: 0, increase: 0 };
      if (type === 'incomes') newItem.months = "tum";
      if (type === 'periodic') { newItem.count = 1; newItem.startMonth = 1; newItem.repeat = false; }
      if (type === 'annual') { newItem.month = 1; }
      
      config[type].push(newItem);
      onUpdate();
      renderForm(container, config, onUpdate);
    });
  });
};
