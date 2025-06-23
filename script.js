const balance = document.getElementById('balance');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// Menggunakan key yang berbeda di localStorage untuk versi ini
const LOCAL_STORAGE_KEY = 'transactions_income_only_v2';

// Cek apakah ada data transaksi di Local Storage
const localStorageTransactions = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

let transactions = localStorage.getItem(LOCAL_STORAGE_KEY) !== null ? localStorageTransactions : [];

// Fungsi untuk format angka ke format Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

// Fungsi untuk menambahkan transaksi ke DOM
function addTransactionDOM(transaction) {
    const item = document.createElement('li');

    // Semua item sekarang adalah pemasukan
    item.innerHTML = `
        ${transaction.text} <span>+${formatRupiah(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

// Fungsi untuk mengupdate nilai total pemasukan
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0);
    
    balance.innerText = formatRupiah(total);
}

// Fungsi untuk menghapus transaksi berdasarkan ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

// Fungsi untuk mengupdate data di Local Storage
function updateLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transactions));
}

// Fungsi untuk menghasilkan ID unik
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Fungsi untuk menambahkan transaksi baru
function addTransaction(e) {
    e.preventDefault();
    const enteredAmount = +amount.value;

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Mohon isi deskripsi dan jumlah pemasukan.');
        return;
    }
    
    if (enteredAmount <= 0) {
        alert('Jumlah pemasukan harus lebih besar dari nol.');
        return;
    }

    const transaction = {
        id: generateID(),
        text: text.value,
        amount: enteredAmount
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    // Kosongkan input form
    text.value = '';
    amount.value = '';
    text.focus(); // Fokus kembali ke input deskripsi
}

// Fungsi inisialisasi
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Event listener untuk form submission
form.addEventListener('submit', addTransaction);

// Mulai aplikasi saat halaman dimuat
init();