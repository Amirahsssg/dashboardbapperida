# Dashboard Bapperida Kota Palembang — prototipe

Prototipe dashboard internal. Semua angka adalah DATA SIMULASI, bukan data resmi.

## Menjalankan di localhost

Buka folder ini di terminal, lalu jalankan salah satu:

    python3 -m http.server 8000        # lalu buka http://localhost:8000
    npx serve .                        # alternatif (Node.js)

Atau pakai ekstensi "Live Server" di VS Code (klik kanan index.html → Open with Live Server).

Jangan buka index.html langsung dengan klik dua kali (file://) — video dan beberapa fitur
browser butuh server lokal.

## Struktur

    index.html                 halaman + template (sintaks Vue 3)
    styles.css                 CSS global (font, efek hover buku, dll.)
    js/app.js                  logika halaman (kelas Component) + pemasangan Vue
    js/vue.global.prod.js      Vue 3.4.38 (lokal, tidak perlu internet)
    data/data.js               semua data simulasi (window.DASHBOARD_DATA)
    data/Data_Simulasi_...xlsx data yang sama dalam bentuk Excel (status dihitung dengan rumus)
    data/generator/            skrip Python pembuat data.json dan file Excel
    assets/                    video drone, foto, dan logo

## Mengganti data

Edit data/data.js (atau jalankan ulang data/generator/gen_data.py lalu salin isi data.json
ke data/data.js). Status indikator dihitung otomatis dari realisasi dan target.

## Catatan

- Video dan foto diambil dari video Raja Drone ID (YouTube) dan BELUM berlisensi.
  Ganti dengan video milik kantor atau yang izinnya jelas sebelum dipakai di luar prototipe.
- Font Plus Jakarta Sans dimuat dari Google Fonts (butuh internet); tanpa internet, browser
  memakai font cadangan.
- Asisten AI tersambung ke OpenRouter (js/openrouter.js). Isi `apiKey` di sana sebelum dipakai.
  Karena ini situs statis, kunci API terlihat oleh siapa pun yang membuka halaman; gunakan kunci
  dengan batas pengeluaran.
