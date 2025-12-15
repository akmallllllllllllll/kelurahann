// app.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Konfigurasi Awal ---
    const wargaListContainer = document.getElementById('warga-list-container'); // Untuk output GET
    const wargaForm = document.getElementById('warga-form'); // Untuk form input POST
    const formMessage = document.getElementById('form-message'); // Untuk pesan status form
    const apiUrl = 'http://127.0.0.1:8000/api/warga/'; // URL API Django Anda

    // --- 2. Fungsi untuk Render Setiap Item Warga ---
    function renderWarga(warga) {
        // Membuat elemen untuk setiap warga
        const wargaDiv = document.createElement('div');
        wargaDiv.style.border = '1px solid #ccc';
        wargaDiv.style.padding = '10px';
        wargaDiv.style.marginBottom = '10px';

        const nama = document.createElement('h3');
        nama.textContent = warga.nama_lengkap;

        const nik = document.createElement('p');
        nik.textContent = `NIK: ${warga.nik}`;

        const alamat = document.createElement('p');
        alamat.textContent = `Alamat: ${warga.alamat}`;

        wargaDiv.appendChild(nama);
        wargaDiv.appendChild(nik);
        wargaDiv.appendChild(alamat);

        return wargaDiv;
    }

    // --- 3. Fungsi untuk Mengambil Data (GET Request) ---
    function fetchDataAndRender() {
        wargaListContainer.innerHTML = '<p>Memuat data...</p>'; // Tampilkan status memuat

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                wargaListContainer.innerHTML = ''; // Hapus pesan "Memuat data..."
                // Karena kita menggunakan Pagination, data ada di 'data.results'
                data.results.forEach(warga => {
                    const wargaElement = renderWarga(warga);
                    wargaListContainer.appendChild(wargaElement);
                });
            })
            .catch(error => {
                wargaListContainer.innerHTML = '<p>Gagal memuat data. Pastikan server backend berjalan.</p>';
                console.error('There has been a problem with your fetch operation:', error);
            });
    }

    // --- 4. Event Listener untuk Form Pendaftaran Warga (POST Request) ---
    wargaForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Mencegah halaman me-reload

        const data = {
            nik: document.getElementById('nik').value,
            nama_lengkap: document.getElementById('nama_lengkap').value,
            alamat: document.getElementById('alamat').value,
            no_telepon: document.getElementById('no_telepon').value,
            // Jika model Warga memerlukan field 'tanggal_registrasi', DRF biasanya menanganinya secara otomatis
        };
        
        formMessage.textContent = 'Sedang mengirim data...';
        formMessage.style.color = 'blue';

        fetch(apiUrl, {
            method: 'POST', // Menggunakan method POST
            headers: {
                'Content-Type': 'application/json', // Menentukan tipe konten yang dikirim
                // Jika API Anda memerlukan otentikasi token, tambahkan:
                // 'Authorization': 'Token YOUR_TOKEN_HERE' 
            },
            body: JSON.stringify(data) // Mengubah data objek menjadi string JSON
        })
        .then(response => {
            if (!response.ok) {
                // Tangani error, misalnya validasi gagal dari server (400 Bad Request)
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(newWarga => {
            formMessage.textContent = `Warga ${newWarga.nama_lengkap} berhasil didaftarkan!`;
            formMessage.style.color = 'green';
            wargaForm.reset(); // Mengosongkan form
            
            fetchDataAndRender(); // Me-refresh daftar warga agar data baru muncul
        })
        .catch(error => {
            console.error('Error saat mendaftar warga:', error);
            // Menampilkan pesan error validasi dari DRF jika ada
            let errorMessage = 'Gagal mendaftarkan warga. Cek konsol browser untuk detail.';
            if (error.nik) {
                 // Menangani array error dari DRF jika field 'nik' bermasalah
                errorMessage = `Gagal: NIK (${error.nik.join(', ')})`; 
            } else if (error.nama_lengkap) {
                errorMessage = `Gagal: Nama (${error.nama_lengkap.join(', ')})`;
            }
            formMessage.textContent = errorMessage;
            formMessage.style.color = 'red';
        });
    });

    // --- 5. Panggil Fungsi Awal ---
    // Panggil fungsi pengambilan data saat halaman pertama kali dimuat
    fetchDataAndRender();
});