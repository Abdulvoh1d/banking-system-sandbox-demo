(() => {
  'use strict';
  const STORAGE_KEY = 'northstar-banking-sandbox-v1';
  const initialState = {
    accounts: [
      { id: 'everyday', name: 'Everyday Checking', kind: 'CHECKING ACCOUNT', number: '•••• 4821', balance: 4286.42, art: 'teal', mark: '↗' },
      { id: 'savings', name: 'Growth Savings', kind: 'SAVINGS ACCOUNT', number: '•••• 0937', balance: 12840.16, art: 'blue', mark: '✧' }
    ],
    transactions: [
      { id: 't-1', description: 'Monthly pay', detail: 'Sample income', account: 'everyday', date: '2026-11-08T09:42:00', amount: 2450.00, type: 'credit', status: 'Completed' },
      { id: 't-2', description: 'Market & Co.', detail: 'Sample purchase', account: 'everyday', date: '2026-11-07T16:18:00', amount: -68.42, type: 'debit', status: 'Completed' },
      { id: 't-3', description: 'Coffee Corner', detail: 'Sample purchase', account: 'everyday', date: '2026-11-06T08:25:00', amount: -7.80, type: 'debit', status: 'Completed' },
      { id: 't-4', description: 'Savings interest', detail: 'Sample credit', account: 'savings', date: '2026-11-05T10:00:00', amount: 12.16, type: 'credit', status: 'Completed' },
      { id: 't-5', description: 'Power & Light', detail: 'Sample bill', account: 'everyday', date: '2026-11-04T13:05:00', amount: -94.16, type: 'debit', status: 'Completed' },
      { id: 't-6', description: 'Monthly savings', detail: 'Sample contribution', account: 'savings', date: '2026-11-02T11:30:00', amount: 500.00, type: 'credit', status: 'Completed' },
      { id: 't-7', description: 'Bookshop', detail: 'Sample purchase', account: 'everyday', date: '2026-11-01T15:12:00', amount: -32.50, type: 'debit', status: 'Completed' }
    ]
  };
  const $ = (selector) => document.querySelector(selector);
  const money = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  let state = loadState();
  let activityType = 'all';
  let pendingTransfer = null;
  let selectedAccount = 'all';
  const accountList = $('#account-list');
  const transactionRows = $('#transaction-rows');
  const transferDialog = $('#transfer-dialog');
  const confirmDialog = $('#confirm-dialog');
  const form = $('#transfer-form');

  function copyDefault() { return JSON.parse(JSON.stringify(initialState)); }
  function validState(value) {
    return value && Array.isArray(value.accounts) && value.accounts.length === 2 && Array.isArray(value.transactions) &&
      value.accounts.every(a => typeof a.id === 'string' && typeof a.name === 'string' && Number.isFinite(a.balance) && a.balance >= 0) &&
      value.transactions.every(t => typeof t.id === 'string' && typeof t.description === 'string' && Number.isFinite(t.amount) && typeof t.account === 'string');
  }
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (validState(parsed)) return parsed;
      }
    } catch (_) { /* Storage may be unavailable in a restricted browser context. */ }
    return copyDefault();
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; }
    catch (_) { toast('Your browser could not save changes. Keep this page open to retain this session.'); return false; }
  }
  function accountById(id) { return state.accounts.find(account => account.id === id); }
  function update() {
    renderSummary();
    renderAccounts();
    renderAccountFilters();
    renderTransferOptions();
    renderTransactions();
  }
  function renderSummary() {
    const total = state.accounts.reduce((sum, account) => sum + account.balance, 0);
    $('#total-balance').textContent = money(total);
    const start = new Date(2026, 10, 1);
    const credits = state.transactions.filter(t => t.amount > 0 && new Date(t.date) >= start).reduce((sum, t) => sum + t.amount, 0);
    const debits = state.transactions.filter(t => t.amount < 0 && new Date(t.date) >= start).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    $('#incoming-total').textContent = money(credits);
    $('#outgoing-total').textContent = money(debits);
    $('#incoming-meter').style.width = `${Math.min(100, Math.max(12, credits / 40))}%`;
    $('#outgoing-meter').style.width = `${Math.min(100, Math.max(12, debits / 40))}%`;
  }
  function renderAccounts() {
    accountList.replaceChildren();
    state.accounts.forEach(account => {
      const article = document.createElement('article');
      article.className = `account-card${selectedAccount === account.id ? ' selected' : ''}`;
      article.tabIndex = 0;
      article.setAttribute('role', 'button');
      article.setAttribute('aria-pressed', String(selectedAccount === account.id));
      article.setAttribute('aria-label', `${account.name}, available balance ${money(account.balance)}. Filter activity for this account.`);
      const top = document.createElement('div'); top.className = 'account-card-top';
      const art = document.createElement('span'); art.className = `account-art ${account.art}`; art.setAttribute('aria-hidden', 'true'); art.textContent = account.mark;
      const meta = document.createElement('div');
      const title = document.createElement('div'); title.className = 'account-title'; title.textContent = account.name;
      const number = document.createElement('div'); number.className = 'account-number'; number.textContent = account.number;
      meta.append(title, number); top.append(art, meta);
      const balanceRow = document.createElement('div'); balanceRow.className = 'account-balance-row';
      const amount = document.createElement('strong'); amount.className = 'account-balance'; amount.textContent = money(account.balance);
      const kind = document.createElement('span'); kind.className = 'account-kind'; kind.textContent = account.kind;
      balanceRow.append(amount, kind); article.append(top, balanceRow);
      const select = () => { selectedAccount = selectedAccount === account.id ? 'all' : account.id; $('#account-filter').value = selectedAccount; update(); };
      article.addEventListener('click', select);
      article.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(); } });
      accountList.append(article);
    });
  }
  function renderAccountFilters() {
    const select = $('#account-filter');
    const current = select.value || 'all';
    select.replaceChildren();
    const all = document.createElement('option'); all.value = 'all'; all.textContent = 'All accounts'; select.append(all);
    state.accounts.forEach(account => { const option = document.createElement('option'); option.value = account.id; option.textContent = account.name; select.append(option); });
    select.value = state.accounts.some(a => a.id === current) || current === 'all' ? current : 'all';
    selectedAccount = select.value;
  }
  function renderTransferOptions() {
    const from = $('#transfer-from'); const to = $('#transfer-to');
    const fromValue = from.value || state.accounts[0].id;
    const toValue = to.value || state.accounts[1].id;
    [from, to].forEach(select => {
      const old = select.value;
      select.replaceChildren();
      state.accounts.forEach(account => { const option = document.createElement('option'); option.value = account.id; option.textContent = `${account.name} · ${money(account.balance)}`; select.append(option); });
      select.value = state.accounts.some(a => a.id === old) ? old : (select === from ? state.accounts[0].id : state.accounts[1].id);
    });
    if (from.value === to.value && state.accounts.length > 1) to.value = state.accounts.find(a => a.id !== from.value).id;
    $('#from-available').textContent = money(accountById(from.value).balance);
  }
  function formatDate(value) {
    const date = new Date(value);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  }
  function renderTransactions() {
    const query = $('#transaction-search').value.trim().toLowerCase();
    const visible = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).filter(tx => {
      const account = accountById(tx.account);
      return (selectedAccount === 'all' || tx.account === selectedAccount) &&
        (activityType === 'all' || tx.type === 'transfer') &&
        (!query || `${tx.description} ${tx.detail} ${account?.name || ''} ${tx.type}`.toLowerCase().includes(query));
    });
    transactionRows.replaceChildren();
    visible.forEach(tx => {
      const account = accountById(tx.account); const row = document.createElement('tr');
      const descCell = document.createElement('td'); const desc = document.createElement('div'); desc.className = 'tx-description';
      const icon = document.createElement('span'); icon.className = `tx-icon ${tx.type === 'credit' ? 'in' : tx.type === 'transfer' ? 'transfer' : 'out'}`; icon.setAttribute('aria-hidden', 'true'); icon.textContent = tx.type === 'credit' ? '↙' : tx.type === 'transfer' ? '⇄' : '↗';
      const labels = document.createElement('div'); const main = document.createElement('div'); main.className = 'tx-main'; main.textContent = tx.description;
      const sub = document.createElement('div'); sub.className = 'tx-sub'; sub.textContent = tx.detail || (tx.type === 'transfer' ? 'Simulated transfer' : 'Sample activity');
      labels.append(main, sub); desc.append(icon, labels); descCell.append(desc);
      const accountCell = document.createElement('td'); accountCell.className = 'account-pill'; accountCell.textContent = account ? account.name.replace(/ (Checking|Savings)$/, '') : 'Demo account';
      const dateCell = document.createElement('td'); dateCell.className = 'tx-date'; dateCell.textContent = formatDate(tx.date);
      const statusCell = document.createElement('td'); const status = document.createElement('span'); status.className = 'status-pill'; const dot = document.createElement('i'); dot.setAttribute('aria-hidden', 'true'); status.append(dot, document.createTextNode(tx.status || 'Completed')); statusCell.append(status);
      const amountCell = document.createElement('td'); amountCell.className = `amount-cell ${tx.amount > 0 ? 'positive' : 'negative'}`; amountCell.textContent = `${tx.amount > 0 ? '+' : '−'}${money(Math.abs(tx.amount))}`;
      row.append(descCell, accountCell, dateCell, statusCell, amountCell); transactionRows.append(row);
    });
    $('#empty-state').hidden = visible.length > 0;
    $('#transaction-count').textContent = `Showing ${visible.length} ${visible.length === 1 ? 'transaction' : 'transactions'}`;
  }
  function toast(message) {
    const region = $('#toast-region'); const item = document.createElement('div'); item.className = 'toast'; item.textContent = message; region.append(item); window.setTimeout(() => item.remove(), 4200);
  }
  function openTransfer() {
    renderTransferOptions(); $('#transfer-error').hidden = true; $('#transfer-error').textContent = ''; $('#transfer-amount').value = ''; $('#transfer-note').value = '';
    if (typeof transferDialog.showModal === 'function') transferDialog.showModal(); else toast('This browser does not support the transfer dialog.');
  }
  function error(message) { const target = $('#transfer-error'); target.textContent = message; target.hidden = false; }
  function reviewTransfer(event) {
    event.preventDefault(); $('#transfer-error').hidden = true;
    const from = accountById($('#transfer-from').value); const to = accountById($('#transfer-to').value);
    const raw = $('#transfer-amount').value; const amount = Math.round(Number(raw) * 100) / 100;
    if (!from || !to) return error('Choose both sample accounts.');
    if (from.id === to.id) return error('Choose two different accounts for a transfer.');
    if (!raw || !Number.isFinite(amount) || amount <= 0) return error('Enter an amount greater than $0.00.');
    if (!/^\d+(?:\.\d{1,2})?$/.test(raw.trim())) return error('Enter an amount using no more than two decimal places.');
    if (amount > from.balance) return error(`Insufficient available sample balance. ${from.name} has ${money(from.balance)} available.`);
    if (amount > 1000000) return error('For this demo, a transfer must be $1,000,000.00 or less.');
    pendingTransfer = { fromId: from.id, toId: to.id, amount, note: $('#transfer-note').value.trim().slice(0, 60) };
    $('#confirm-from').textContent = `${from.name} (${from.number})`;
    $('#confirm-to').textContent = `${to.name} (${to.number})`;
    $('#confirm-amount').textContent = money(amount);
    $('#confirm-note-row').hidden = !pendingTransfer.note;
    $('#confirm-note').textContent = pendingTransfer.note;
    transferDialog.close();
    confirmDialog.showModal();
  }
  function commitTransfer() {
    if (!pendingTransfer) return;
    const { fromId, toId, amount, note } = pendingTransfer;
    const from = accountById(fromId); const to = accountById(toId);
    if (!from || !to || from.balance < amount) { confirmDialog.close(); pendingTransfer = null; toast('The sample balance changed. Please review your transfer again.'); return; }
    const cents = Math.round(amount * 100);
    from.balance = Math.round((Math.round(from.balance * 100) - cents)) / 100;
    to.balance = Math.round((Math.round(to.balance * 100) + cents)) / 100;
    const now = new Date().toISOString();
    const transferName = `Transfer ${from.name.replace(/ (Checking|Savings)$/, '')} → ${to.name.replace(/ (Checking|Savings)$/, '')}`;
    const commonId = `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const detail = note ? `Simulated transfer · ${note}` : 'Simulated transfer between demo accounts';
    state.transactions.unshift(
      { id: `${commonId}-out`, description: transferName, detail, account: fromId, date: now, amount: -amount, type: 'transfer', status: 'Completed' },
      { id: `${commonId}-in`, description: transferName, detail, account: toId, date: now, amount, type: 'transfer', status: 'Completed' }
    );
    saveState(); selectedAccount = 'all'; $('#account-filter').value = 'all'; update();
    confirmDialog.close(); pendingTransfer = null;
    toast(`Demo transfer of ${money(amount)} recorded locally. No real funds moved.`);
  }

  $('#open-transfer').addEventListener('click', openTransfer);
  $('.close-dialog').addEventListener('click', () => transferDialog.close());
  $('#swap-accounts').addEventListener('click', () => { const from = $('#transfer-from'); const to = $('#transfer-to'); const old = from.value; from.value = to.value; to.value = old; renderTransferOptions(); });
  $('#transfer-from').addEventListener('change', () => { if ($('#transfer-from').value === $('#transfer-to').value) $('#transfer-to').value = state.accounts.find(a => a.id !== $('#transfer-from').value).id; renderTransferOptions(); });
  $('#transfer-to').addEventListener('change', () => { if ($('#transfer-from').value === $('#transfer-to').value) $('#transfer-from').value = state.accounts.find(a => a.id !== $('#transfer-to').value).id; renderTransferOptions(); });
  form.addEventListener('submit', reviewTransfer);
  $('#cancel-confirm').addEventListener('click', () => { confirmDialog.close(); pendingTransfer = null; openTransfer(); });
  $('#confirm-transfer').addEventListener('click', commitTransfer);
  $('#account-filter').addEventListener('change', event => { selectedAccount = event.target.value; update(); });
  $('#transaction-search').addEventListener('input', renderTransactions);
  document.querySelectorAll('.activity-tab').forEach(tab => tab.addEventListener('click', () => {
    activityType = tab.dataset.type;
    document.querySelectorAll('.activity-tab').forEach(item => { const active = item === tab; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
    renderTransactions();
  }));
  $('#reset-demo').addEventListener('click', () => {
    if (!window.confirm('Reset this browser’s sandbox data to the original sample accounts and activity?')) return;
    state = copyDefault(); selectedAccount = 'all'; activityType = 'all'; $('#account-filter').value = 'all'; $('#transaction-search').value = '';
    document.querySelectorAll('.activity-tab').forEach(tab => { const active = tab.dataset.type === 'all'; tab.classList.toggle('active', active); tab.setAttribute('aria-pressed', String(active)); });
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) { /* Keep reset available in restricted storage contexts. */ }
    update(); toast('Sandbox data reset to the original sample.');
  });
  transferDialog.addEventListener('click', event => { if (event.target === transferDialog) transferDialog.close(); });
  confirmDialog.addEventListener('click', event => { if (event.target === confirmDialog) { confirmDialog.close(); pendingTransfer = null; } });
  update();
})();
