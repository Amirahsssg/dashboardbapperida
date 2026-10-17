"""Mock dataset for the Bapperida Kota Palembang dashboard prototype.
All numbers are simulated. Writes data.json (for the prototype)."""
import json, hashlib

def h(s, k=1.0):
    """deterministic pseudo-random in [-k, k] from a string"""
    v = int(hashlib.md5(s.encode()).hexdigest()[:8], 16) / 0xFFFFFFFF
    return (v * 2 - 1) * k

BIDANG = [
    {"id": "eko", "name": "Perekonomian, SDA dan Sosial"},
    {"id": "infra", "name": "Infrastruktur dan Pengembangan Wilayah"},
    {"id": "riset", "name": "Riset dan Inovasi Daerah"},
]

PD = {
    "dinsos": "Dinas Sosial", "disnaker": "Dinas Tenaga Kerja", "disdik": "Dinas Pendidikan",
    "dinkes": "Dinas Kesehatan", "dinkop": "Dinas Koperasi dan UKM", "dispar": "Dinas Pariwisata",
    "dkp": "Dinas Ketahanan Pangan", "pupr": "Dinas PUPR", "perkim": "Dinas Perkim",
    "dlhk": "Dinas Lingkungan Hidup dan Kebersihan", "dishub": "Dinas Perhubungan",
    "kominfo": "Dinas Komunikasi dan Informatika", "bapperida": "Bapperida Kota Palembang",
    "lintas": "Lintas perangkat daerah",
}

# id, bidang, name, pd, scope text
URUSAN = [
    ("sosial", "eko", "Sosial", "dinsos", "perlindungan dan jaminan sosial, rehabilitasi sosial, serta penanganan fakir miskin",
     ["Data penerima bantuan belum seluruhnya mutakhir", "Penurunan kemiskinan melambat sejak 2023"]),
    ("naker", "eko", "Tenaga Kerja", "disnaker", "pelatihan kerja, penempatan tenaga kerja dan hubungan industrial",
     ["Kesesuaian pelatihan dengan kebutuhan industri", "Pengangguran usia muda"]),
    ("pendidikan", "eko", "Pendidikan", "disdik", "pengelolaan pendidikan dasar, PAUD dan pendidikan nonformal",
     ["Pemerataan akses pendidikan menengah pertama", "Mutu dan sebaran tenaga pendidik"]),
    ("kesehatan", "eko", "Kesehatan", "dinkes", "upaya kesehatan perorangan dan masyarakat serta sumber daya kesehatan",
     ["Percepatan penurunan stunting", "Layanan kesehatan dasar di kawasan padat"]),
    ("perekonomian", "eko", "Perekonomian", "lintas", "koordinasi kebijakan ekonomi daerah dan pemerataan pendapatan",
     ["Pertumbuhan ekonomi cenderung datar 2023–2025", "Ketimpangan pendapatan antarkelompok"]),
    ("koperasi", "eko", "Koperasi dan UKM", "dinkop", "pemberdayaan koperasi serta usaha mikro, kecil dan menengah",
     ["Akses pembiayaan UMKM", "Pemasaran digital produk lokal"]),
    ("pariwisata", "eko", "Pariwisata", "dispar", "pengembangan destinasi dan pemasaran pariwisata",
     ["Pengembangan wisata Sungai Musi", "Kalender event yang konsisten"]),
    ("pangan", "eko", "Pangan", "dkp", "ketersediaan, distribusi dan keragaman konsumsi pangan",
     ["Ketergantungan pasokan pangan dari luar kota", "Keragaman konsumsi pangan rumah tangga"]),
    ("pu", "infra", "Pekerjaan Umum", "pupr", "jalan, sumber daya air dan sistem drainase",
     ["Genangan saat hujan deras di kawasan rendah", "Pemeliharaan jalan lingkungan"]),
    ("perkim", "infra", "Perumahan dan Kawasan Permukiman", "perkim", "penyediaan air minum, sanitasi dan penataan kawasan permukiman",
     ["Cakupan air minum di kawasan tepian sungai", "Penataan permukiman kumuh"]),
    ("lh", "infra", "Lingkungan Hidup", "dlhk", "pengendalian pencemaran, pengelolaan sampah dan kualitas lingkungan",
     ["Kapasitas pengolahan sampah", "Kualitas air Sungai Musi dan anak sungai"]),
    ("ruang", "infra", "Penataan Ruang", "pupr", "penyelenggaraan penataan ruang dan ruang terbuka hijau",
     ["Ketersediaan lahan untuk RTH publik", "Pengendalian alih fungsi daerah resapan"]),
    ("perhubungan", "infra", "Perhubungan", "dishub", "lalu lintas dan angkutan jalan serta integrasi angkutan umum",
     ["Integrasi antarmoda angkutan umum", "Kemacetan di koridor utama"]),
    ("riset", "riset", "Riset dan Inovasi Daerah", "bapperida", "kelitbangan dan pengembangan inovasi daerah",
     ["Pemanfaatan hasil kajian dalam perencanaan", "Replikasi inovasi antarperangkat daerah"]),
    ("kominfo", "riset", "Komunikasi dan Informatika", "kominfo", "aplikasi informatika, statistik sektoral dan layanan digital",
     ["Integrasi data antarperangkat daerah", "Keamanan informasi layanan digital"]),
]
URUSAN_BY = {u[0]: u for u in URUSAN}

# id, kode, nama, jenis, satuan, dec, arah, urusan, pd, sumber, r2021, r2025, t2025, t2029, explicit_real, explicit_targets, explicit_hist
I = [
    ("ipm", "IKU-01", "Indeks Pembangunan Manusia", "IKU", "poin", 2, "naik", "kesehatan", "lintas", "BPS Kota Palembang",
     74.60, 76.10, 76.40, 78.00, [74.60, 74.98, 75.40, 75.77, 76.10], None, [74.80, 75.20, 75.60, 76.00]),
    ("pe", "IKU-02", "Pertumbuhan Ekonomi", "IKU", "%", 2, "naik", "perekonomian", "lintas", "BPS Kota Palembang",
     4.85, 5.12, 5.40, 5.80, [4.85, 5.31, 5.20, 5.05, 5.12], None, None),
    ("gini", "IKU-03", "Indeks Gini", "IKU", "poin", 3, "turun", "perekonomian", "lintas", "BPS Kota Palembang",
     0.372, 0.361, 0.358, 0.340, [0.372, 0.369, 0.366, 0.364, 0.361], None, None),
    ("ikl", "IKU-04", "Indeks Kualitas Lingkungan Hidup", "IKU", "poin", 2, "naik", "lh", "dlhk", "Dinas Lingkungan Hidup dan Kebersihan",
     58.20, 61.00, 62.00, 66.00, None, None, None),
    ("inovasi", "IKU-05", "Indeks Inovasi Daerah", "IKU", "poin", 2, "naik", "riset", "bapperida", "Bapperida Kota Palembang",
     38.20, 52.40, 54.00, 70.00, None, None, None),
    ("kemiskinan", "IKD-01", "Tingkat Kemiskinan", "IKD", "%", 2, "turun", "sosial", "dinsos", "BPS Kota Palembang",
     8.79, 8.30, 8.40, 7.00, [8.79, 8.62, 8.50, 8.41, 8.30], [8.40, 8.10, 7.75, 7.40, 7.00], None),
    ("tpt", "IKD-02", "Tingkat Pengangguran Terbuka", "IKD", "%", 2, "turun", "naker", "disnaker", "BPS Kota Palembang",
     5.40, 4.71, 4.80, 4.00, [5.40, 5.18, 4.97, 4.85, 4.71], None, None),
    ("hls", "IKD-03", "Harapan Lama Sekolah", "IKD", "tahun", 2, "naik", "pendidikan", "disdik", "BPS Kota Palembang",
     13.20, 13.60, 13.62, 13.90, [13.20, 13.31, 13.40, 13.52, 13.60], None, None),
    ("rls", "IKD-04", "Rata-rata Lama Sekolah", "IKD", "tahun", 2, "naik", "pendidikan", "disdik", "BPS Kota Palembang",
     10.62, 10.98, 11.00, 11.30, None, None, None),
    ("ahh", "IKD-05", "Angka Harapan Hidup", "IKD", "tahun", 2, "naik", "kesehatan", "dinkes", "BPS Kota Palembang",
     70.10, 70.86, 70.90, 71.60, None, None, None),
    ("stunting", "IKD-06", "Prevalensi Stunting", "IKD", "%", 1, "turun", "kesehatan", "dinkes", "Dinas Kesehatan",
     18.6, 14.2, 14.0, 10.0, None, None, None),
    ("pdrbkap", "IKD-07", "PDRB per Kapita", "IKD", "Rp juta", 1, "naik", "perekonomian", "lintas", "BPS Kota Palembang",
     72.4, 88.1, 89.0, 105.0, None, None, None),
    ("rth", "IKD-08", "Proporsi Ruang Terbuka Hijau Publik", "IKD", "%", 1, "naik", "ruang", "pupr", "Dinas PUPR",
     6.8, 8.1, 8.5, 12.0, None, None, None),
    ("jalan", "IKK-01", "Persentase Jalan Kondisi Mantap", "IKK", "%", 2, "naik", "pu", "pupr", "Dinas PUPR",
     80.10, 86.50, 86.00, 90.00, [80.10, 82.00, 83.70, 85.20, 86.50], None, None),
    ("genangan", "IKK-02", "Persentase Kawasan Tergenang", "IKK", "%", 2, "turun", "pu", "pupr", "Dinas PUPR",
     17.90, 14.80, 14.50, 10.00, [17.90, 17.10, 16.20, 15.60, 14.80], None, None),
    ("air", "IKK-03", "Rumah Tangga dengan Akses Air Minum Layak", "IKK", "%", 2, "naik", "perkim", "perkim", "Dinas Perkim",
     86.00, 94.20, 94.00, 100.00, [86.00, 88.40, 90.60, 92.50, 94.20], None, None),
    ("sanitasi", "IKK-04", "Rumah Tangga dengan Akses Sanitasi Layak", "IKK", "%", 2, "naik", "perkim", "perkim", "Dinas Perkim",
     82.10, 89.60, 90.00, 95.00, None, None, None),
    ("kumuh", "IKK-05", "Luas Kawasan Permukiman Kumuh", "IKK", "ha", 0, "turun", "perkim", "perkim", "Dinas Perkim",
     412, 336, 330, 250, None, None, None),
    ("sampah", "IKK-06", "Persentase Sampah Terkelola", "IKK", "%", 1, "naik", "lh", "dlhk", "Dinas Lingkungan Hidup dan Kebersihan",
     61.0, 72.4, 73.0, 85.0, None, None, None),
    ("imunisasi", "IKK-07", "Cakupan Imunisasi Dasar Lengkap", "IKK", "%", 1, "naik", "kesehatan", "dinkes", "Dinas Kesehatan",
     88.0, 93.5, 93.0, 95.0, None, None, None),
    ("aki", "IKK-08", "Angka Kematian Ibu", "IKK", "per 100.000 KH", 0, "turun", "kesehatan", "dinkes", "Dinas Kesehatan",
     98, 84, 84, 70, None, None, None),
    ("apm_smp", "IKK-09", "Angka Partisipasi Murni SMP", "IKK", "%", 2, "naik", "pendidikan", "disdik", "Dinas Pendidikan",
     78.40, 81.20, 81.50, 86.00, None, None, None),
    ("penempatan", "IKK-10", "Persentase Pencari Kerja yang Ditempatkan", "IKK", "%", 1, "naik", "naker", "disnaker", "Dinas Tenaga Kerja",
     22.0, 31.5, 32.0, 40.0, None, None, None),
    ("ppks", "IKK-11", "Persentase PPKS yang Mendapat Bantuan Sosial", "IKK", "%", 1, "naik", "sosial", "dinsos", "Dinas Sosial",
     64.0, 71.2, 73.0, 85.0, None, None, None),
    ("umkm", "IKK-12", "Persentase UMKM Naik Kelas", "IKK", "%", 1, "naik", "koperasi", "dinkop", "Dinas Koperasi dan UKM",
     3.1, 4.6, 4.6, 6.0, None, None, None),
    ("wisatawan", "IKK-13", "Jumlah Kunjungan Wisatawan", "IKK", "juta orang", 2, "naik", "pariwisata", "dispar", "Dinas Pariwisata",
     1.42, 2.86, 2.80, 3.50, None, None, None),
    ("pph", "IKK-14", "Skor Pola Pangan Harapan", "IKK", "poin", 1, "naik", "pangan", "dkp", "Dinas Ketahanan Pangan",
     82.5, 86.1, 87.0, 92.0, None, None, None),
    ("angkutan", "IKK-15", "Persentase Layanan Angkutan Umum Terintegrasi", "IKK", "%", 1, "naik", "perhubungan", "dishub", "Dinas Perhubungan",
     18.0, 34.0, 34.0, 50.0, None, None, None),
    ("spbe", "IKK-16", "Indeks SPBE", "IKK", "poin", 2, "naik", "kominfo", "kominfo", "Dinas Komunikasi dan Informatika",
     2.41, 3.12, 3.20, 3.80, None, None, None),
    ("kajian", "IKK-17", "Jumlah Kajian yang Dimanfaatkan dalam Perencanaan", "IKK", "dokumen", 0, "naik", "riset", "bapperida", "Bapperida Kota Palembang",
     4, 9, 10, 15, None, None, None),
]

# Plain-language reasons kept from earlier prototype rounds
ALASAN_OVERRIDE = {
    "kemiskinan": "Angka kemiskinan turun terlalu lambat. Dengan laju sekarang, target 2029 tidak tercapai.",
    "ipm": "Sedikit di bawah jalur target. Laju kenaikannya perlu dijaga.",
    "tpt": "Hampir sesuai target, tetapi selisihnya tipis.",
    "pe": "Pertumbuhan di bawah standar target dan cenderung datar sejak 2023.",
    "genangan": "Kawasan tergenang masih di atas batas target dan berkurang terlalu lambat.",
}

# Programs in RKPD 2026 (Kepmendagri 050 nomenclature), pagu in Rp juta, simulated
PROGRAM = [
    ("p01", "Program Perlindungan dan Jaminan Sosial", "dinsos", ["kemiskinan", "ppks"], 38500, 91.2,
     "Pemutakhiran data penerima bantuan belum selesai; sebagian penyaluran tertunda."),
    ("p02", "Program Rehabilitasi Sosial", "dinsos", ["ppks"], 12400, 88.5,
     "Kapasitas panti dan pendamping sosial terbatas."),
    ("p03", "Program Pelatihan Kerja dan Produktivitas Tenaga Kerja", "disnaker", ["tpt", "penempatan"], 9800, 93.4,
     "Sebagian materi pelatihan belum sesuai kebutuhan industri."),
    ("p04", "Program Penempatan Tenaga Kerja", "disnaker", ["tpt", "penempatan"], 4200, 95.1, ""),
    ("p05", "Program Pengelolaan Pendidikan", "disdik", ["hls", "rls", "apm_smp", "ipm"], 412000, 96.3,
     "Daya tampung SMP negeri di beberapa kecamatan belum mencukupi."),
    ("p06", "Program Pendidik dan Tenaga Kependidikan", "disdik", ["hls", "rls"], 86500, 97.0, ""),
    ("p07", "Program Pemenuhan Upaya Kesehatan Perorangan dan Upaya Kesehatan Masyarakat", "dinkes", ["ahh", "stunting", "imunisasi", "aki", "ipm"], 268000, 94.8,
     "Pelaporan imunisasi dari fasilitas swasta belum lengkap."),
    ("p08", "Program Peningkatan Kapasitas Sumber Daya Manusia Kesehatan", "dinkes", ["aki", "ahh"], 15800, 92.1, ""),
    ("p09", "Program Pemberdayaan Usaha Menengah, Usaha Kecil, dan Usaha Mikro (UMKM)", "dinkop", ["umkm", "pe"], 11200, 90.6, ""),
    ("p10", "Program Peningkatan Daya Tarik Destinasi Pariwisata", "dispar", ["wisatawan", "pe"], 18900, 89.7, ""),
    ("p11", "Program Pemasaran Pariwisata", "dispar", ["wisatawan"], 7600, 94.0, ""),
    ("p12", "Program Peningkatan Diversifikasi dan Ketahanan Pangan Masyarakat", "dkp", ["pph"], 6300, 87.9,
     "Sosialisasi pangan beragam belum menjangkau seluruh kelurahan."),
    ("p13", "Program Penyelenggaraan Jalan", "pupr", ["jalan"], 245000, 95.6, ""),
    ("p14", "Program Pengelolaan dan Pengembangan Sistem Drainase", "pupr", ["genangan"], 132000, 84.3,
     "Pembebasan lahan saluran primer tertunda; dua paket pekerjaan bergeser ke 2026."),
    ("p15", "Program Pengelolaan Sumber Daya Air (SDA)", "pupr", ["genangan"], 64000, 86.1,
     "Normalisasi anak sungai baru berjalan di 3 dari 7 lokasi."),
    ("p16", "Program Penyelenggaraan Penataan Ruang", "pupr", ["rth"], 8900, 82.4,
     "Pengadaan lahan RTH publik belum terealisasi."),
    ("p17", "Program Pengelolaan dan Pengembangan Sistem Penyediaan Air Minum", "perkim", ["air"], 54000, 96.8, ""),
    ("p18", "Program Pengelolaan dan Pengembangan Sistem Air Limbah", "perkim", ["sanitasi"], 29500, 93.5, ""),
    ("p19", "Program Kawasan Permukiman", "perkim", ["kumuh"], 47200, 90.2,
     "Penanganan kawasan kumuh tepian sungai terkendala status lahan."),
    ("p20", "Program Pengelolaan Persampahan", "dlhk", ["sampah", "ikl"], 98000, 91.7,
     "Kapasitas TPA mendekati batas; bank sampah belum merata."),
    ("p21", "Program Pengendalian Pencemaran dan/atau Kerusakan Lingkungan Hidup", "dlhk", ["ikl"], 7400, 85.0,
     "Pemantauan kualitas air dan udara belum rutin di semua titik."),
    ("p22", "Program Penyelenggaraan Lalu Lintas dan Angkutan Jalan (LLAJ)", "dishub", ["angkutan"], 36800, 93.9, ""),
    ("p23", "Program Aplikasi Informatika", "kominfo", ["spbe"], 21500, 94.4, ""),
    ("p24", "Program Penelitian dan Pengembangan Daerah", "bapperida", ["inovasi", "kajian"], 5200, 88.0,
     "Hasil kajian belum dijadwalkan masuk forum perencanaan."),
    ("p25", "Program Perencanaan, Pengendalian dan Evaluasi Pembangunan Daerah", "bapperida", ["ipm", "pe", "gini", "pdrbkap"], 14600, 95.3, ""),
]

# DSSD sectoral statistics (simulated): urusan, kode, uraian, satuan, 2021, 2025, dec, produsen
DSSD = [
    ("sosial", "DSSD-SOS-01", "Jumlah penduduk miskin", "ribu jiwa", 150.4, 143.0, 1),
    ("sosial", "DSSD-SOS-02", "Keluarga penerima bantuan sosial", "KPM", 61200, 58400, 0),
    ("naker", "DSSD-NAK-01", "Angkatan kerja", "ribu orang", 820.5, 864.9, 1),
    ("naker", "DSSD-NAK-02", "Peserta pelatihan kerja", "orang", 1450, 2380, 0),
    ("pendidikan", "DSSD-PDK-01", "Jumlah SD dan SMP", "sekolah", 731, 742, 0),
    ("pendidikan", "DSSD-PDK-02", "Peserta didik SD dan SMP", "ribu siswa", 244.8, 251.3, 1),
    ("kesehatan", "DSSD-KES-01", "Jumlah puskesmas", "unit", 41, 42, 0),
    ("kesehatan", "DSSD-KES-02", "Tenaga kesehatan", "orang", 5120, 5890, 0),
    ("perekonomian", "DSSD-EKO-01", "PDRB atas dasar harga berlaku", "Rp triliun", 125.6, 158.2, 1),
    ("perekonomian", "DSSD-EKO-02", "Realisasi investasi", "Rp triliun", 3.1, 4.8, 1),
    ("koperasi", "DSSD-KOP-01", "Jumlah UMKM terdata", "unit", 38200, 46100, 0),
    ("koperasi", "DSSD-KOP-02", "Koperasi aktif", "unit", 410, 455, 0),
    ("pariwisata", "DSSD-PAR-01", "Jumlah hotel", "unit", 132, 151, 0),
    ("pariwisata", "DSSD-PAR-02", "Event wisata terselenggara", "event", 18, 34, 0),
    ("pangan", "DSSD-PGN-01", "Pasar tradisional", "unit", 41, 43, 0),
    ("pangan", "DSSD-PGN-02", "Kelompok pangan lokal binaan", "kelompok", 36, 58, 0),
    ("pu", "DSSD-PU-01", "Panjang jalan kota", "km", 1310, 1342, 0),
    ("pu", "DSSD-PU-02", "Panjang saluran drainase", "km", 560, 612, 0),
    ("perkim", "DSSD-PKM-01", "Sambungan rumah air minum", "ribu SR", 281.0, 334.5, 1),
    ("perkim", "DSSD-PKM-02", "Rumah tidak layak huni", "unit", 9800, 7600, 0),
    ("lh", "DSSD-LH-01", "Timbulan sampah", "ton/hari", 1150, 1240, 0),
    ("lh", "DSSD-LH-02", "Bank sampah aktif", "unit", 120, 214, 0),
    ("ruang", "DSSD-RNG-01", "Luas RTH publik", "ha", 2720, 3240, 0),
    ("ruang", "DSSD-RNG-02", "Taman kota", "unit", 54, 68, 0),
    ("perhubungan", "DSSD-HUB-01", "Koridor angkutan umum aktif", "koridor", 8, 12, 0),
    ("perhubungan", "DSSD-HUB-02", "Halte angkutan umum", "unit", 210, 286, 0),
    ("riset", "DSSD-RIS-01", "Kajian yang diselesaikan", "dokumen", 6, 12, 0),
    ("riset", "DSSD-RIS-02", "Inovasi daerah terdaftar", "inovasi", 48, 112, 0),
    ("kominfo", "DSSD-KOM-01", "Layanan publik daring", "layanan", 42, 96, 0),
    ("kominfo", "DSSD-KOM-02", "Titik wifi publik", "titik", 120, 260, 0),
]

YEARS_R = [2021, 2022, 2023, 2024, 2025]
YEARS_T = [2025, 2026, 2027, 2028, 2029]

def rnd(v, dec):
    return round(v, dec) if dec else int(round(v))

def fmt(v, dec):
    s = f"{v:,.{dec}f}" if dec else f"{int(round(v)):,}"
    return s.replace(",", "_").replace(".", ",").replace("_", ".")

def unit_text(satuan):
    return "%" if satuan == "%" else " " + satuan

ind_out = []
PAGE = 205
for row in I:
    (iid, kode, nama, jenis, sat, dec, arah, ur, pdk, sumber, r21, r25, t25, t29, xr, xt, xh) = row
    if xr:
        real = xr
    else:
        f = [0, 0.24 + h(iid + "a", 0.04), 0.49 + h(iid + "b", 0.04), 0.75 + h(iid + "c", 0.04), 1]
        real = [rnd(r21 + (r25 - r21) * x, dec) for x in f]
    targets = xt or [rnd(t25 + (t29 - t25) * i / 4, dec) for i in range(5)]
    step = abs(r25 - r21) * 0.06 + (10 ** -dec if dec else 1)
    sign = 1 if arah == "naik" else -1
    hist = xh or [rnd(real[i] + sign * step * (1 + 0.3 * i), dec) for i in range(4)]
    proj = real[4] + (real[4] - real[0])
    if sat == "%":
        proj = max(0, min(100, proj))
    if arah == "turun":
        st = "ok" if proj <= t29 else ("warn" if proj <= t29 * 1.05 else "risk")
    else:
        st = "ok" if proj >= t29 else ("warn" if proj >= t29 * 0.97 else "risk")
    u = URUSAN_BY[ur]
    bidang = u[1]
    progs = [p for p in PROGRAM if iid in p[3]]
    if iid in ALASAN_OVERRIDE:
        alasan = ALASAN_OVERRIDE[iid]
    elif st == "risk":
        verb = "turun" if arah == "turun" else "naik"
        alasan = f"{nama} {verb} terlalu lambat. Dengan laju sekarang, target 2029 tidak tercapai."
    elif st == "warn":
        alasan = "Sedikit di bawah jalur target. Lajunya perlu dijaga agar target 2029 tercapai."
    else:
        alasan = "Sesuai jalur menuju target 2029."
    kendala = [p[6] for p in progs if p[6]]
    if st == "ok":
        saran = "Tidak ada tindakan khusus. Lanjutkan pemantauan rutin."
    else:
        pn = " dan ".join(p[1] for p in progs[:2]) or "program pendukung"
        saran = f"Periksa realisasi {pn} di RKPD 2026." + (f" Monev mencatat: {kendala[0]}" if kendala else "")
    p_rpjmd = PAGE; PAGE += 1 + (len(nama) % 3)
    src = [f"RPJMD 2025–2029, hal. {p_rpjmd}", f"Monev RKPD 2025, hal. {30 + len(ind_out) * 2}"]
    if st != "ok" and progs:
        src.append(f"RKPD 2026, hal. {100 + len(ind_out) * 3}")
    ind_out.append({
        "id": iid, "kode": kode, "nama": nama, "jenis": jenis, "satuan": sat, "dec": dec, "arah": arah,
        "urusanId": ur, "urusan": u[2], "bidang": bidang, "pdKey": pdk, "pd": PD[pdk], "sumber": sumber,
        "real": real, "targets": targets, "target": t29, "hist": hist,
        "proj": round(proj, 6), "st": st, "alasan": alasan, "saran": saran, "src": src,
        "programs": [p[0] for p in progs], "rpjmdPage": p_rpjmd,
    })
IND = {d["id"]: d for d in ind_out}

prog_out = [{
    "id": p[0], "nama": p[1], "pdKey": p[2], "pd": PD[p[2]], "inds": p[3],
    "pagu": p[4], "realAnggaran": p[5], "kendala": p[6],
} for p in PROGRAM]

# ---------- documents ----------
DOC_DEF = {"owner": "Pemerintah Kota Palembang", "nomor": "[nomor penetapan]", "tgl": "[tanggal]",
           "status": "Ditetapkan", "versi": "1.0"}
docs = [
    {"id": "rpjpd", "type": "RPJPD", "title": "RPJPD Kota Palembang 2025–2045", "period": "2025–2045", "upload": "12 Feb 2025"},
    {"id": "rpjmd", "type": "RPJMD", "title": "RPJMD Kota Palembang 2025–2029", "period": "2025–2029", "upload": "3 Sep 2025", "rujukan": True},
    {"id": "rkpd27", "type": "RKPD", "title": "Rancangan RKPD Kota Palembang 2027", "period": "2027", "status": "Rancangan", "versi": "0.3", "upload": "9 Okt 2026"},
    {"id": "rkpd26", "type": "RKPD", "title": "RKPD Kota Palembang 2026", "period": "2026", "upload": "20 Jun 2025", "rujukan": True},
    {"id": "rkpd25", "type": "RKPD", "title": "RKPD Kota Palembang 2025", "period": "2025", "upload": "18 Jun 2024"},
    {"id": "dssd25", "type": "DSSD", "title": "DSSD Kota Palembang 2025", "owner": "Bapperida dan seluruh PD", "period": "2025", "nomor": "—", "status": "Final", "upload": "22 Mei 2026"},
    {"id": "dssd24", "type": "DSSD", "title": "DSSD Kota Palembang 2024", "owner": "Bapperida dan seluruh PD", "period": "2024", "nomor": "—", "status": "Final", "upload": "20 Mei 2025"},
    {"id": "monev26q2", "type": "Monev", "title": "Monev RKPD Triwulan II 2026", "owner": "Bapperida Kota Palembang", "period": "Triwulan II 2026", "nomor": "—", "status": "Final", "upload": "28 Jul 2026"},
    {"id": "monev26q1", "type": "Monev", "title": "Monev RKPD Triwulan I 2026", "owner": "Bapperida Kota Palembang", "period": "Triwulan I 2026", "nomor": "—", "status": "Final", "upload": "24 Apr 2026"},
    {"id": "monev25", "type": "Monev", "title": "Monev RKPD Tahunan 2025", "owner": "Bapperida Kota Palembang", "period": "2025", "nomor": "—", "status": "Final", "upload": "17 Feb 2026"},
]
PD_DOCS = ["dinsos", "disnaker", "disdik", "dinkes", "dinkop", "dispar", "dkp", "pupr", "perkim", "dlhk", "dishub", "kominfo"]
uploads_r = ["2 Okt 2025", "6 Okt 2025", "7 Okt 2025", "10 Okt 2025", "13 Okt 2025", "14 Okt 2025",
             "15 Okt 2025", "14 Okt 2025", "16 Okt 2025", "17 Okt 2025", "20 Okt 2025", "21 Okt 2025"]
uploads_j = ["2 Jul 2026", "26 Jun 2026", "30 Jun 2026", "1 Jul 2026", "3 Jul 2026", "29 Jun 2026",
             "6 Jul 2026", "7 Jul 2026", "2 Jul 2026", "8 Jul 2026", "1 Jul 2026", "30 Jun 2026"]
for i, k in enumerate(PD_DOCS):
    docs.append({"id": f"renstra-{k}", "type": "Renstra", "title": f"Renstra {PD[k]} 2025–2029", "owner": PD[k],
                 "period": "2025–2029", "upload": uploads_r[i], "pd": True, "pdKey": k})
for i, k in enumerate(PD_DOCS):
    docs.append({"id": f"renja-{k}", "type": "Renja", "title": f"Renja {PD[k]} 2026", "owner": PD[k],
                 "period": "2026", "status": "Final", "upload": uploads_j[i], "pd": True, "pdKey": k})
for k in ["dinsos", "dinkes", "disdik", "pupr", "perkim", "dlhk"]:
    docs.append({"id": f"monevpd-{k}", "type": "Monev PD", "title": f"Monev Renja {PD[k]} Triwulan II 2026", "owner": PD[k],
                 "period": "Triwulan II 2026", "nomor": "—", "status": "Final", "upload": "25 Jul 2026"})
REGS = [
    ("uu25", "UU No. 25 Tahun 2004 tentang Sistem Perencanaan Pembangunan Nasional", "Pemerintah Pusat", "2004", "UU No. 25 Tahun 2004"),
    ("uu23", "UU No. 23 Tahun 2014 tentang Pemerintahan Daerah", "Pemerintah Pusat", "2014", "UU No. 23 Tahun 2014"),
    ("pp17", "PP No. 17 Tahun 2017 tentang Sinkronisasi Proses Perencanaan dan Penganggaran Pembangunan Nasional", "Pemerintah Pusat", "2017", "PP No. 17 Tahun 2017"),
    ("pmdn86", "Permendagri No. 86 Tahun 2017 tentang Tata Cara Perencanaan, Pengendalian dan Evaluasi Pembangunan Daerah", "Kementerian Dalam Negeri", "2017", "Permendagri No. 86 Tahun 2017"),
    ("perpres39", "Perpres No. 39 Tahun 2019 tentang Satu Data Indonesia", "Pemerintah Pusat", "2019", "Perpres No. 39 Tahun 2019"),
    ("pmdn90", "Permendagri No. 90 Tahun 2019 tentang Klasifikasi, Kodefikasi, dan Nomenklatur Perencanaan Pembangunan dan Keuangan Daerah", "Kementerian Dalam Negeri", "2019", "Permendagri No. 90 Tahun 2019"),
]
for rid, t, o, p, n in REGS:
    docs.append({"id": rid, "type": "Regulasi", "title": t, "owner": o, "period": p, "nomor": n,
                 "status": "Berlaku", "versi": "—", "upload": "1 Feb 2025"})
docs = [{**DOC_DEF, **d} for d in docs]
DOC = {d["id"]: d for d in docs}

# ---------- targets in PD documents + deliberate inconsistencies ----------
# (docId, indId, kind, value)
MISMATCH = {
    ("renstra-pupr", "jalan"): ("Beda target", 88.00),
    ("renstra-pupr", "genangan"): ("Nama tidak cocok", "Persentase Luas Genangan"),
    ("renja-dinsos", "kemiskinan"): ("Beda target", 7.90),
    ("renstra-dinkes", "stunting"): ("Beda target", 11.0),
    ("renja-dinkes", "imunisasi"): ("Tidak dimuat", None),
    ("renja-disdik", "apm_smp"): ("Beda target", 83.50),
    ("renstra-dispar", "wisatawan"): ("Beda target", 4.00),
    ("renstra-dlhk", "sampah"): ("Satuan berbeda", "ton/hari"),
}
target_rows = []
flags = []
fid = 0
for d in docs:
    if not d.get("pd"):
        continue
    k = d["pdKey"]
    owned = [x for x in ind_out if x["pdKey"] == k]
    is_renstra = d["type"] == "Renstra"
    page = 60 + len(k) * 3
    for x in owned:
        page += 1
        ref_val = x["target"] if is_renstra else x["targets"][1]
        ref_doc = DOC["rpjmd"]["title"] if is_renstra else DOC["rkpd26"]["title"]
        ref_page = f"hal. {x['rpjmdPage']}" if is_renstra else f"hal. {100 + ind_out.index(x) * 3}"
        label = "Target 2029" if is_renstra else "Target 2026"
        mm = MISMATCH.get((d["id"], x["id"]))
        name_in_doc, unit_in_doc, val_in_doc, status = x["nama"], x["satuan"], ref_val, "Konsisten"
        if mm:
            kind, v = mm
            if kind == "Beda target": val_in_doc = v
            if kind == "Nama tidak cocok": name_in_doc = v
            if kind == "Satuan berbeda": unit_in_doc = v; val_in_doc = 1050
            if kind == "Tidak dimuat": val_in_doc = None
            status = kind
        target_rows.append({
            "docId": d["id"], "dokumen": d["title"], "pd": d["owner"], "kodeIndikator": x["kode"],
            "indikatorDiDokumen": name_in_doc if val_in_doc is not None or not mm else "(tidak dimuat)",
            "satuanDiDokumen": unit_in_doc, "jenisTarget": label,
            "nilaiDiDokumen": val_in_doc, "nilaiRujukan": ref_val, "dokumenRujukan": ref_doc,
            "halaman": page if val_in_doc is not None else None, "hasil": status,
        })
        if mm:
            fid += 1
            kind = mm[0]
            u = unit_text(x["satuan"])
            if kind == "Beda target":
                title = ("Target 2029 berbeda dengan RPJMD" if is_renstra else "Target 2026 berbeda dengan RKPD 2026")
                diff = val_in_doc - ref_val
                better = (diff > 0) == (x["arah"] == "naik")
                ai = (f"Target di {d['type']} {'lebih tinggi ambisinya' if better else 'lebih rendah'} dari dokumen rujukan "
                      f"({fmt(val_in_doc, x['dec'])}{u} dibanding {fmt(ref_val, x['dec'])}{u}). "
                      "Perbedaan bisa sah bila ada perubahan rujukan atau penyesuaian kewenangan. "
                      f"Mohon dikonfirmasi ke {d['owner']}.")
                ref_s, chk_s = fmt(ref_val, x["dec"]) + u, fmt(val_in_doc, x["dec"]) + u
            elif kind == "Nama tidak cocok":
                title = "Indikator tidak ada di daftar induk"
                label = "Nama indikator"
                ai = ("Nama berbeda, tetapi definisi dan satuannya serupa. Kemungkinan indikator yang sama. "
                      "Konfirmasi untuk menautkannya ke indikator induk.")
                ref_s, chk_s = x["nama"], name_in_doc
            elif kind == "Satuan berbeda":
                title = "Satuan indikator berbeda dengan RPJMD"
                label = "Satuan"
                ai = (f"RPJMD memakai satuan {x['satuan']}, sedangkan {d['type']} memakai {unit_in_doc}. "
                      "Angka tidak bisa dibandingkan sebelum satuannya diseragamkan.")
                ref_s, chk_s = x["satuan"], unit_in_doc
            else:
                title = "Indikator RKPD tidak dimuat di Renja"
                ai = (f"Indikator ini punya target 2026 di RKPD, tetapi tidak ditemukan di {d['title']}. "
                      "Kemungkinan terlewat saat penyusunan Renja.")
                ref_s, chk_s = fmt(ref_val, x["dec"]) + u, "Tidak ditemukan"
            flags.append({
                "id": f"f{fid}", "docId": d["id"], "bidang": URUSAN_BY[x["urusanId"]][1], "title": title, "jenis": kind,
                "ind": name_in_doc, "label": label, "refDoc": ref_doc if kind != "Nama tidak cocok" else "Daftar indikator induk",
                "refPage": ref_page if kind != "Nama tidak cocok" else "Kemiripan tertinggi",
                "refVal": ref_s, "chkDoc": d["title"], "chkPage": f"hal. {page}" if val_in_doc is not None else "—",
                "chkVal": chk_s, "ai": ai,
            })

# ---------- DSSD + urusan (buku saku) ----------
dssd_out = []
for ur, kode, uraian, sat, a, b, dec in DSSD:
    f = [0, 0.26 + h(kode + "a", 0.05), 0.51 + h(kode + "b", 0.05), 0.76 + h(kode + "c", 0.04), 1]
    vals = [rnd(a + (b - a) * x, dec) for x in f]
    dssd_out.append({"urusanId": ur, "kode": kode, "uraian": uraian, "satuan": sat, "dec": dec,
                     "values": vals, "produsen": PD[URUSAN_BY[ur][3]] if URUSAN_BY[ur][3] != "lintas" else "Bapperida Kota Palembang"})

urusan_out = []
for uid, bid, name, pdk, scope, isu in URUSAN:
    rows = [r for r in dssd_out if r["urusanId"] == uid]
    data_txt = "; ".join(f"{r['uraian'].lower()} {fmt(r['values'][4], r['dec'])} {r['satuan']}" for r in rows)
    urusan_out.append({
        "id": uid, "bidang": bid, "name": name, "pd": PD[pdk],
        "profil": f"Mencakup {scope}. Data dasar DSSD 2025: {data_txt}.",
        "isu": isu, "inds": [x["id"] for x in ind_out if x["urusanId"] == uid],
        "dssd": [{"uraian": r["uraian"], "nilai": fmt(r["values"][4], r["dec"]) + " " + r["satuan"]} for r in rows],
    })

ANGGARAN_2026 = {
    "bulan": ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep"],
    "rencana": [4.0, 9.5, 17.0, 24.5, 32.0, 40.5, 48.0, 56.0, 64.5],
    "realisasi": [2.1, 6.0, 12.8, 19.5, 26.4, 34.2, 40.1, 47.3, 55.6],
}

data = {
    "anggaran2026": ANGGARAN_2026,
    "bidang": BIDANG, "pd": PD, "indikator": ind_out, "program": prog_out, "dokumen": docs,
    "targetDokumen": target_rows, "temuan": flags, "dssd": dssd_out, "urusan": urusan_out,
}
with open("data.json", "w") as fh:
    json.dump(data, fh, ensure_ascii=False)

from collections import Counter
print("indikator", len(ind_out), Counter(d["st"] for d in ind_out))
print("per bidang", Counter((d["bidang"], d["st"]) for d in ind_out))
print("program", len(prog_out), "dokumen", len(docs), "targetDokumen", len(target_rows), "temuan", len(flags), "dssd", len(dssd_out), "urusan", len(urusan_out))
for d in ind_out:
    print(f"{d['kode']:7} {d['nama'][:44]:44} real25={d['real'][4]} proj={round(d['proj'],3)} t29={d['target']} {d['st']}")
for f in flags:
    print(f["id"], f["docId"], f["jenis"], f["refVal"], "->", f["chkVal"])
