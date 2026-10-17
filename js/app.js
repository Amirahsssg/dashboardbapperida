// Minimal stand-in for the canvas runtime: same Component class, rendered with Vue 3.
class DCLogic {
  constructor(props) { this.props = props || {}; this.state = {}; }
  setState(patch) {
    const p = typeof patch === 'function' ? patch(this.state, this.props) : patch;
    Object.assign(this.state, p);
  }
  forceUpdate() {}
}

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { tab: 'beranda', role: 'admin', jenis: 'Semua', statusF: 'semua', indId: null, docType: 'Semua', docQ: '', docId: null, bidang: 'eko', urusanId: null, draftOpen: false, ex: 0, sent: '', draft: '', answer: '', answerErr: '', answerLoading: false, flagId: null, flagStatus: {}, note: '', homeQ: '', docsP: 0, scrolled: false, hov: null, chartMode: {} };
    this.heroRef = (el) => { this.heroEl = el; if (this._onHead) this._onHead(); };
    this.headRef = (el) => { this.headEl = el; };
    this.carouselRef = (el) => {
      if (this._car) { this._car(); this._car = null; }
      if (!el) return;
      let reduce = false;
      try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
      if (reduce) return;
      let stopped = false, paused = false, dir = 1, raf = 0, pos = el.scrollLeft;
      const tick = () => {
        if (stopped) return;
        if (!paused) {
          const max = el.scrollWidth - el.clientWidth;
          if (max > 0) {
            pos += 0.35 * dir;
            if (pos >= max) { pos = max; dir = -1; } else if (pos <= 0) { pos = 0; dir = 1; }
            el.scrollLeft = pos;
          }
        }
        raf = window.requestAnimationFrame(tick);
      };
      const stop = () => { stopped = true; if (raf) window.cancelAnimationFrame(raf); };
      ['pointerdown', 'wheel', 'touchstart', 'keydown'].forEach((ev) => el.addEventListener(ev, stop, { passive: true }));
      el.addEventListener('mouseenter', () => { paused = true; });
      el.addEventListener('mouseleave', () => { paused = false; pos = el.scrollLeft; });
      raf = window.requestAnimationFrame(tick);
      this._car = stop;
    };
    this.D = window.DASHBOARD_DATA;
    this._unbindScroll = () => {
      if (this._onScroll) {
        try { window.removeEventListener('scroll', this._onScroll); window.removeEventListener('resize', this._onScroll); } catch (e) {}
        this._onScroll = null;
      }
    };
    this.docsRef = (el) => {
      this._unbindScroll();
      if (!el) return;
      let raf = 0;
      const measure = () => {
        raf = 0;
        const vh = window.innerHeight || 800;
        const top = el.getBoundingClientRect().top;
        // 0 when the panel's top reaches the bottom of the screen, 1 when it reaches 20% from the top
        let p = (vh - top) / (vh * 0.8);
        p = Math.max(0, Math.min(1, p));
        p = Math.round(p * 100) / 100;
        if (p !== this.state.docsP) this.setState({ docsP: p });
      };
      this._onScroll = () => { if (!raf) raf = window.requestAnimationFrame(measure); };
      try {
        window.addEventListener('scroll', this._onScroll, { passive: true });
        window.addEventListener('resize', this._onScroll);
      } catch (e) {}
      measure();
    };
    this.vidRef = (el) => {
      if (!el) return;
      let reduce = false;
      try { reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
      el.muted = true;
      el.loop = true;
      el.playsInline = true;
      if (reduce) { try { el.pause(); } catch (e) {} return; }
      try {
        const p = el.play();
        if (p && p.catch) p.catch(() => {});
      } catch (e) {}
    };
  }

  componentDidMount() {
    this._onHead = () => {
      // white only once the video has scrolled out from under the header
      const headH = this.headEl ? this.headEl.offsetHeight : 130;
      const sc = this.heroEl ? this.heroEl.getBoundingClientRect().bottom <= headH + 1 : (window.scrollY || 0) > 60;
      if (sc !== this.state.scrolled) this.setState({ scrolled: sc });
    };
    try { window.addEventListener('scroll', this._onHead, { passive: true }); } catch (e) {}
    this._onHead();
  }

  componentWillUnmount() {
    this._unbindScroll();
    if (this._car) { this._car(); this._car = null; }
    try { window.removeEventListener('scroll', this._onHead); } catch (e) {}
  }

  go(tab, extra) {
    this.setState(Object.assign({ tab: tab, indId: null, docId: null, urusanId: null, flagId: null, draftOpen: false }, extra || {}));
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  renderVals() {
    const self = this;
    const s = this.state;
    const fmt = (v, dec) => {
      const n = dec == null ? 2 : dec;
      const parts = Number(v).toFixed(n).split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return parts.join(',');
    };
    const D = this.D;

    const IMG = {
      s1: 'assets/still-1.jpg',
      s13: 'assets/still-13.jpg',
      s21: 'assets/still-21.jpg',
      s33: 'assets/still-33.jpg'
    };

    const ST = {
      risk: { label: 'Berisiko', bg: '#FCE6E6', fg: '#8E1C1C', dot: '#E83434' },
      warn: { label: 'Perlu perhatian', bg: '#F8EEDD', fg: '#6B4513', dot: '#C88838' },
      ok: { label: 'Sesuai jalur', bg: '#EAF4E2', fg: '#2F5A1A', dot: '#6DB23C' },
      neutral: { label: '', bg: '#ECEFF3', fg: '#2B3542', dot: '#7A8594' }
    };
    const SEC = { Fakta: ['#E6EEF7', '#21518E'], Analisis: ['#ECEFF3', '#2B3542'], Saran: ['#F8EEDD', '#6B4513'], Draf: ['#E3ECF8', '#1F4A85'], Catatan: ['#ECEFF3', '#2B3542'] };
    const sec = (k, arr) => ({ k: k, bg: SEC[k][0], fg: SEC[k][1], items: arr.map((t) => ({ t: t })) });
    const wrap = (arr) => arr.map((t) => ({ t: t }));

    const ROLES = {
      tim: { label: 'Ketua Tim Urusan Sosial', scope: 'Urusan Sosial', f: (d) => d.urusan === 'Sosial', review: false, flagF: () => false },
      kabid: { label: 'Kepala Bidang Perekonomian, SDA dan Sosial', scope: 'Bidang Perekonomian, SDA dan Sosial', f: (d) => d.bidang === 'eko', review: true, flagF: (f) => f.bidang === 'eko' },
      admin: { label: 'Admin (Ketua Tim Data dan Informasi)', scope: 'Seluruh bidang', f: () => true, review: true, flagF: () => true },
      kaban: { label: 'Kepala Badan', scope: 'Seluruh bidang', f: () => true, review: false, flagF: () => false }
    };
    const role = ROLES[s.role] || ROLES.admin;
    const tab = (s.tab === 'pemeriksaan' && !role.review) ? 'beranda' : s.tab;

    // ---------- Indikator (data simulasi, lihat file Excel) ----------
    const inds = D.indikator.map((d) => {
      const r = d.real;
      const slope = (r[4] - r[0]) / 4;
      let proj = r[4] + slope * 4;
      if (d.satuan === '%') proj = Math.max(0, Math.min(100, proj));
      let st;
      if (d.arah === 'turun') st = proj <= d.target + 1e-9 ? 'ok' : (proj <= d.target * 1.05 ? 'warn' : 'risk');
      else st = proj >= d.target - 1e-9 ? 'ok' : (proj >= d.target * 0.97 ? 'warn' : 'risk');
      const u = d.satuan === '%' ? '%' : (' ' + d.satuan);
      const m = ST[st];
      return Object.assign({}, d, {
        slope: slope, proj: proj, st: st, unit: u,
        pBg: m.bg, pFg: m.fg, pDot: m.dot, pLabel: m.label,
        realText: fmt(r[4], d.dec) + u, targetText: fmt(d.target, d.dec) + u, projText: fmt(proj, d.dec) + u,
        arahText: d.arah === 'turun' ? '↓ Turun' : '↑ Naik',
        open: () => self.go('kinerja', { indId: d.id })
      });
    });
    const byId = {};
    inds.forEach((d) => { byId[d.id] = d; });
    const scoped = inds.filter(role.f);
    const rank = { risk: 0, warn: 1, ok: 2 };

    // ---------- Temuan pemeriksaan (contoh) ----------
    const FLAGS = D.temuan;
    const FS = {
      menunggu: { label: 'Menunggu tinjauan', c: ST.warn },
      sesuai: { label: 'Ditandai sesuai', c: ST.ok },
      perbaikan: { label: 'Diminta perbaikan', c: ST.risk },
      abaikan: { label: 'Diabaikan', c: ST.neutral }
    };
    const flags = FLAGS.map((f) => {
      const stt = s.flagStatus[f.id] || 'menunggu';
      const fs = FS[stt];
      return Object.assign({}, f, { stt: stt, sLabel: fs.label, sBg: fs.c.bg, sFg: fs.c.fg, sDot: fs.c.dot, open: () => self.go('pemeriksaan', { flagId: f.id, note: '' }) });
    });
    const myFlags = flags.filter(role.flagF);
    const openFlags = myFlags.filter((f) => f.stt === 'menunggu').length;

    // ---------- Dokumen (contoh) ----------
    const TYPES = [
      { code: 'RPJPD', name: 'Rencana Pembangunan Jangka Panjang Daerah', group: 'kota' },
      { code: 'RPJMD', name: 'Rencana Pembangunan Jangka Menengah Daerah', group: 'kota' },
      { code: 'RKPD', name: 'Rencana Kerja Pemerintah Daerah', group: 'kota' },
      { code: 'DSSD', name: 'Data Statistik Sektoral Daerah', group: 'kota' },
      { code: 'Monev', name: 'Monitoring dan Evaluasi', group: 'kota' },
      { code: 'Renstra', name: 'Rencana Strategis Perangkat Daerah', group: 'pd' },
      { code: 'Renja', name: 'Rencana Kerja Perangkat Daerah', group: 'pd' },
      { code: 'Monev PD', name: 'Monitoring dan Evaluasi Perangkat Daerah', group: 'pd' },
      { code: 'Regulasi', name: 'Regulasi Perencanaan', group: 'reg' }
    ];
    const typeName = {};
    TYPES.forEach((t) => { typeName[t.code] = t.name; });
    const DOCS = D.dokumen;
    const SUMM = {
      RPJPD: ['Menetapkan arah pembangunan Kota Palembang untuk 20 tahun.', 'Menjadi acuan penyusunan RPJMD setiap periode lima tahunan.'],
      RPJMD: ['Menjabarkan visi-misi Wali Kota 2025–2029 menjadi tujuan, sasaran dan program prioritas.', 'Memuat target IKU dan IKD per tahun hingga 2029.', 'Menjadi rujukan pemeriksaan Renstra perangkat daerah.'],
      RKPD: ['Memuat prioritas pembangunan dan program tahun berjalan.', 'Mencantumkan pagu indikatif per program dan perangkat daerah.', 'Menampung usulan Musrenbang yang lolos verifikasi.'],
      DSSD: ['Data statistik sektoral yang dikumpulkan setiap perangkat daerah.', 'Menjadi data dasar kondisi urusan di Buku Saku.'],
      Monev: ['Membandingkan realisasi program dengan rencana di RKPD.', 'Mencatat kendala pelaksanaan per perangkat daerah.', 'Menjadi sumber penjelasan pada peringatan dini kinerja.'],
      Renstra: ['Rencana lima tahun perangkat daerah yang diturunkan dari RPJMD.', 'Memuat IKU perangkat daerah dan target per tahun.', 'Diperiksa otomatis terhadap target RPJMD saat diunggah.'],
      Renja: ['Rencana kerja tahunan perangkat daerah dari Renstra dan RKPD.', 'Memuat program, kegiatan dan target tahun berjalan.', 'Diperiksa otomatis terhadap RKPD saat diunggah.'],
      'Monev PD': ['Realisasi program dan kegiatan perangkat daerah per triwulan.', 'Mencatat kendala pelaksanaan di tingkat perangkat daerah.'],
      Regulasi: ['Dasar hukum penyusunan dan evaluasi dokumen perencanaan.', 'Tidak dianalisis untuk target kinerja.']
    };
    const docChecker = (d) => {
      if (d.rujukan) return { has: true, label: 'Dokumen rujukan', c: ST.neutral };
      if (d.pd) {
        const n = flags.filter((f) => f.docId === d.id && f.stt === 'menunggu').length;
        return n > 0 ? { has: true, label: 'Perlu dicek: ' + n, c: ST.warn } : { has: true, label: 'Konsisten', c: ST.ok };
      }
      return { has: false, label: '', c: ST.neutral };
    };

    const q = (s.docQ || '').toLowerCase().trim();
    const docRows = DOCS.filter((d) => (s.docType === 'Semua' || d.type === s.docType) && (!q || d.title.toLowerCase().indexOf(q) === 0 || d.type.toLowerCase().indexOf(q) === 0 || d.owner.toLowerCase().indexOf(q) === 0)).map((d) => {
      const ck = docChecker(d);
      return Object.assign({}, d, { hasChecker: ck.has, cLabel: ck.label, cBg: ck.c.bg, cFg: ck.c.fg, cDot: ck.c.dot, open: () => self.go('dokumen', { docId: d.id }) });
    });

    const chip = (active) => active ? { bg: '#21518E', fg: '#FFFFFF', border: '#21518E', pressed: 'true' } : { bg: '#FFFFFF', fg: '#1B2430', border: '#B7C0CC', pressed: 'false' };

    // ---------- Navigasi ----------
    const TABS = [['beranda', 'Beranda'], ['kinerja', 'Kinerja'], ['dokumen', 'Dokumen'], ['bukusaku', 'Buku Saku'], ['asisten', 'Asisten AI'], ['pemeriksaan', 'Pemeriksaan']];
    const clear = tab === 'beranda' && !s.scrolled;
    const tabs = TABS.filter((t) => t[0] !== 'pemeriksaan' || role.review).map((t) => {
      const on = t[0] === tab;
      return {
        label: t[1], current: on ? 'page' : 'false',
        bg: on ? (clear ? '#FFFFFF' : '#21518E') : 'transparent',
        fg: on ? (clear ? '#21518E' : '#FFFFFF') : (clear ? '#FFFFFF' : '#21518E'),
        ts: clear && !on ? '0 1px 6px rgba(0, 0, 0, 0.45)' : 'none',
        pick: () => self.go(t[0], t[0] === 'dokumen' ? { docType: 'Semua', docQ: '' } : {})
      };
    });

    // ---------- Beranda ----------
    const counts = ['risk', 'warn', 'ok'].map((k) => ({
      label: ST[k].label, n: scoped.filter((d) => d.st === k).length,
      bg: ST[k].bg, fg: ST[k].fg, dot: ST[k].dot,
      pick: () => self.go('kinerja', { statusF: k, jenis: 'Semua' })
    }));
    const topList = scoped.filter((d) => d.st !== 'ok').sort((a, b) => rank[a.st] - rank[b.st]).slice(0, 5).map((d, i) => Object.assign({}, d, { borderTop: i === 0 ? '0' : '1px solid #DDE3EA' }));
    const GROUPS = [['kota', 'Dokumen perencanaan kota'], ['pd', 'Dokumen perangkat daerah'], ['reg', 'Lainnya']];
    const TINT = {
      kota: 'linear-gradient(180deg, rgba(14, 36, 64, 0.15) 0%, rgba(33, 81, 142, 0.95) 72%)',
      pd: 'linear-gradient(180deg, rgba(20, 40, 12, 0.15) 0%, rgba(47, 90, 26, 0.95) 72%)',
      reg: 'linear-gradient(180deg, rgba(40, 25, 6, 0.15) 0%, rgba(107, 69, 19, 0.95) 72%)'
    };
    const COVERS = [IMG.s1, IMG.s13, IMG.s21, IMG.s33];
    const hq = (s.homeQ || '').toLowerCase().trim();
    const typeMatch = (t) => !hq || t.code.toLowerCase().indexOf(hq) === 0 || t.name.toLowerCase().indexOf(hq) === 0;
    const groups = GROUPS.map((g) => ({
      name: g[1],
      tiles: TYPES.filter((t) => t.group === g[0] && typeMatch(t)).map((t) => {
        const list = DOCS.filter((d) => d.type === t.code);
        const img = COVERS[TYPES.indexOf(t) % COVERS.length];
        return {
          code: t.code, name: t.name,
          fullName: t.code === 'Regulasi' ? t.name : (t.name + ' (' + t.code + ')'),
          countText: list.length + ' dokumen', yearText: list.length ? list[0].period : '',
          img: img, tint: TINT[g[0]],
          pick: () => self.go('dokumen', { docType: t.code, docQ: '' })
        };
      })
    })).filter((g) => g.tiles.length > 0);
    // ---------- Ringkasan pembangunan ----------
    const kpis = ['ipm', 'kemiskinan', 'tpt', 'pe'].map((id) => {
      const d = byId[id];
      const v = fmt(d.real[4], d.dec) + (d.satuan === '%' ? '%' : '');
      const t = fmt(d.target, d.dec) + (d.satuan === '%' ? '%' : '');
      return Object.assign({}, d, { value: v, targetShort: t });
    });
    const X0 = 30, XW = 500, YT = 20, YB = 190;
    const cm = s.chartMode || {};
    const hovOf = (id) => (s.hov && s.hov.c === id ? s.hov.i : null);
    const modeBtns = (id, opts, cur) => opts.map((o) => ({
      label: o[1], pressed: cur === o[0] ? 'true' : 'false',
      bg: cur === o[0] ? '#FFFFFF' : 'transparent', fg: cur === o[0] ? '#21518E' : '#4A5462',
      pick: () => { const n = Object.assign({}, self.state.chartMode); n[id] = o[0]; self.setState({ chartMode: n, hov: null }); }
    }));
    const geom = (n, vals, zero) => {
      const ok = vals.filter((v) => v != null);
      let mn = Math.min.apply(null, ok), mx = Math.max.apply(null, ok);
      const pad = ((mx - mn) || 1) * 0.15;
      const lo = zero ? 0 : mn - pad, hi = mx + pad;
      const X = (i) => Math.round((X0 + XW / n * (i + 0.5)) * 10) / 10;
      const Y = (v) => Math.round((YB - ((v - lo) / (hi - lo)) * (YB - YT)) * 10) / 10;
      const line = (arr) => {
        let out = '', pen = false;
        arr.forEach((v, i) => { if (v == null) { pen = false; return; } out += (pen ? 'L' : 'M') + X(i) + ' ' + Y(v) + ' '; pen = true; });
        return out.trim();
      };
      const dots = (arr) => arr.map((v, i) => v == null ? '' : 'M' + (X(i) - 5) + ' ' + Y(v) + ' a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0').join(' ');
      return { X: X, Y: Y, line: line, dots: dots };
    };
    const mkIndChart = (d, color) => {
      const mode = cm[d.id] || 'past';
      const full = mode === 'full';
      const years = full ? [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029] : [2021, 2022, 2023, 2024, 2025];
      const n = years.length;
      const u = d.satuan === '%' ? '%' : (' ' + d.satuan);
      const real = years.map((y) => (y <= 2025 ? d.real[y - 2021] : null));
      const tgt = years.map((y) => (y >= 2025 ? d.targets[y - 2025] : (d.hist ? d.hist[y - 2021] : null)));
      const showTgt = tgt.filter((v) => v != null).length > 1;
      const slope = (d.real[4] - d.real[0]) / 4;
      const proj = years.map((y) => {
        if (!full || y < 2025) return null;
        let v = d.real[4] + slope * (y - 2025);
        if (d.satuan === '%') v = Math.max(0, Math.min(100, v));
        return v;
      });
      const g = geom(n, real.concat(showTgt ? tgt : [], proj), false);
      const hv = hovOf(d.id);
      const idx = hv == null ? 4 : hv;
      const atReal = real[idx] != null;
      const hyv = atReal ? real[idx] : (tgt[idx] != null ? tgt[idx] : proj[idx]);
      return {
        id: d.id, title: d.nama, color: color, hColor: atReal ? color : '#C88838',
        modes: modeBtns(d.id, [['past', '2021–2025'], ['full', 'Sampai 2029']], mode),
        readVal: atReal ? fmt(real[idx], d.dec) + u : fmt(tgt[idx], d.dec) + u,
        readSub: years[idx] + (atReal ? (tgt[idx] != null ? ' · target ' + fmt(tgt[idx], d.dec) + u : '') : ' · target RPJMD · proyeksi tren ' + fmt(proj[idx], d.dec) + u),
        guide: hv == null ? '' : 'M' + g.X(idx) + ' ' + YT + 'V' + YB,
        realPath: g.line(real), targetPath: showTgt ? g.line(tgt) : '', projPath: full ? g.line(proj) : '',
        dots: g.dots(real), hx: g.X(idx), hy: g.Y(hyv), hr: 7,
        cols: years.map((y, i) => ({
          hover: () => { if (!self.state.hov || self.state.hov.c !== d.id || self.state.hov.i !== i) self.setState({ hov: { c: d.id, i: i } }); },
          aria: y + ': ' + (real[i] != null ? 'realisasi ' + fmt(real[i], d.dec) + u : 'target ' + fmt(tgt[i], d.dec) + u)
        })),
        leave: () => self.setState({ hov: null }),
        labels: years.map((y) => ({ t: String(y) })),
        realLabel: 'Realisasi',
        targetLabel: showTgt ? 'Target' : 'Target 2029: ' + fmt(d.target, d.dec) + u,
        hasProj: full,
        aria: d.nama + ': ' + d.real.map((v, i) => (2021 + i) + ' ' + fmt(v, d.dec)).join(', ')
      };
    };
    const ANG = {"bulan": ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep"], "rencana": [4.0, 9.5, 17.0, 24.5, 32.0, 40.5, 48.0, 56.0, 64.5], "realisasi": [2.1, 6.0, 12.8, 19.5, 26.4, 34.2, 40.1, 47.3, 55.6]};
    const mkBudget = () => {
      const mode = cm.budget || 'month';
      const month = mode === 'month';
      const ix = month ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : [2, 5, 8];
      const labels = month ? ANG.bulan : ['TW I', 'TW II', 'TW III'];
      const real = ix.map((i) => ANG.realisasi[i]);
      const plan = ix.map((i) => ANG.rencana[i]);
      const g = geom(ix.length, real.concat(plan), true);
      const hv = hovOf('budget');
      const idx = hv == null ? ix.length - 1 : hv;
      return {
        id: 'budget', title: 'Realisasi anggaran RKPD 2026 (kumulatif)', color: '#21518E', hColor: '#21518E',
        modes: modeBtns('budget', [['month', 'Bulanan'], ['quarter', 'Triwulan']], mode),
        readVal: fmt(real[idx], 1) + '%',
        readSub: labels[idx] + ' 2026 · rencana ' + fmt(plan[idx], 1) + '% · selisih ' + fmt(real[idx] - plan[idx], 1) + ' poin',
        guide: hv == null ? '' : 'M' + g.X(idx) + ' ' + YT + 'V' + YB,
        realPath: g.line(real), targetPath: g.line(plan), projPath: '',
        dots: g.dots(real), hx: g.X(idx), hy: g.Y(real[idx]), hr: 7,
        cols: labels.map((l, i) => ({
          hover: () => { if (!self.state.hov || self.state.hov.c !== 'budget' || self.state.hov.i !== i) self.setState({ hov: { c: 'budget', i: i } }); },
          aria: l + ' 2026: realisasi ' + fmt(real[i], 1) + '%, rencana ' + fmt(plan[i], 1) + '%'
        })),
        leave: () => self.setState({ hov: null }),
        labels: labels.map((l) => ({ t: l })),
        realLabel: 'Realisasi', targetLabel: 'Rencana', hasProj: false,
        aria: 'Realisasi anggaran kumulatif 2026: ' + ANG.bulan.map((b, i) => b + ' ' + fmt(ANG.realisasi[i], 1) + '%').join(', ')
      };
    };
    const charts = [
      mkIndChart(byId.ipm, '#21518E'),
      mkIndChart(byId.kemiskinan, '#E83434'),
      mkBudget(),
      mkIndChart(byId.tpt, '#3772BE'),
      mkIndChart(byId.pe, '#21518E'),
      mkIndChart(byId.genangan, '#3772BE')
    ];
    const homeSearch = () => self.go('dokumen', { docQ: self.state.homeQ || '', docType: 'Semua', homeQ: '' });

    // ---------- Kinerja ----------
    const indRows = scoped.filter((d) => (s.jenis === 'Semua' || d.jenis === s.jenis) && (s.statusF === 'semua' || d.st === s.statusF)).sort((a, b) => rank[a.st] - rank[b.st]);
    const jenisChips = ['Semua', 'IKU', 'IKD', 'IKK'].map((j) => Object.assign({ label: j, pick: () => self.setState({ jenis: j }) }, chip(s.jenis === j)));
    const statusChips = [['semua', 'Semua status'], ['risk', 'Berisiko'], ['warn', 'Perlu perhatian'], ['ok', 'Sesuai jalur']].map((x) => Object.assign({ label: x[1], pick: () => self.setState({ statusF: x[0] }) }, chip(s.statusF === x[0])));

    const blankInd = { nama: '', pBg: '', pFg: '', pDot: '', pLabel: '', meta: [], bars: [], targetPos: 0, targetText: '', stats: [], aiTitle: '', sections: [], src: [], programs: [], hasProgs: false };
    let ind = blankInd;
    const indSel = s.indId ? byId[s.indId] : null;
    if (indSel) {
      const d = indSel;
      const vals = d.real.concat([d.proj, d.target]);
      const mn = Math.min.apply(null, vals);
      const mx = Math.max.apply(null, vals);
      const rng = (mx - mn) || 1;
      const lo = mn - rng * 0.6;
      const hi = mx + rng * 0.2;
      const pos = (v) => Math.round(((v - lo) / (hi - lo)) * 1000) / 10;
      const bars = d.real.map((v, i) => ({ val: fmt(v, d.dec), h: pos(v), bg: '#21518E', border: '0', label: String(2021 + i) }));
      bars.push({ val: fmt(d.proj, d.dec), h: pos(d.proj), bg: 'transparent', border: '2px dashed #4A5462', label: '2029*' });
      const slopeText = (d.slope >= 0 ? '+' : '−') + fmt(Math.abs(d.slope), d.dec + (d.dec === 0 ? 1 : 0)) + d.unit;
      const progs = D.program.filter((p) => p.inds.indexOf(d.id) >= 0).map((p) => ({
        nama: p.nama, pd: p.pd, pagu: 'Rp ' + fmt(p.pagu, 0) + ' juta', real: fmt(p.realAnggaran, 1) + '%',
        kendala: p.kendala, hasKendala: !!p.kendala
      }));
      const verdict = d.st === 'ok' ? 'target tercapai.' : (d.st === 'warn' ? 'mendekati target, tetapi belum tercapai.' : 'belum mencapai target.');
      ind = Object.assign({}, d, {
        meta: [
          { k: 'Jenis', v: d.jenis }, { k: 'Satuan', v: d.satuan }, { k: 'Arah', v: d.arah === 'turun' ? 'Turun lebih baik' : 'Naik lebih baik' },
          { k: 'Urusan', v: d.urusan }, { k: 'Penanggung jawab', v: d.pd }, { k: 'Sumber data', v: d.sumber }
        ],
        bars: bars,
        targetPos: pos(d.target),
        stats: [
          { k: 'Realisasi 2025', v: d.realText }, { k: 'Target 2029 (RPJMD)', v: d.targetText },
          { k: 'Proyeksi 2029', v: d.projText }, { k: 'Perubahan rata-rata per tahun', v: slopeText }
        ],
        aiTitle: d.st === 'ok' ? 'Indikator sesuai jalur' : ('Mengapa indikator ini ' + d.pLabel.toLowerCase() + '?'),
        sections: [
          sec('Fakta', ['Target 2029 dalam RPJMD: ' + d.targetText + '.', 'Realisasi 2025: ' + d.realText + ' (Monev RKPD 2025).']),
          sec('Analisis', ['Perubahan rata-rata ' + slopeText + ' per tahun sejak 2021.', 'Jika tren berlanjut, 2029 sekitar ' + d.projText + ', ' + verdict]),
          sec('Saran', [d.saran])
        ],
        src: wrap(d.src),
        programs: progs,
        hasProgs: progs.length > 0
      });
    }

    // ---------- Dokumen detail ----------
    const blankDoc = { type: '', title: '', meta: [], summary: [], isRujukan: false, isPd: false, checkText: '', flags: [], showReviewBtn: false };
    let doc = blankDoc;
    const docSel = s.docId ? DOCS.filter((d) => d.id === s.docId)[0] : null;
    if (docSel) {
      const d = docSel;
      const df = flags.filter((f) => f.docId === d.id);
      const nOpen = df.filter((f) => f.stt === 'menunggu').length;
      doc = Object.assign({}, d, {
        meta: [
          { k: 'Jenis', v: typeName[d.type] }, { k: 'Pemilik', v: d.owner }, { k: 'Tahun / periode', v: d.period },
          { k: 'Nomor penetapan', v: d.nomor }, { k: 'Tanggal penetapan', v: d.tgl }, { k: 'Status', v: d.status },
          { k: 'Versi', v: d.versi }, { k: 'Diunggah', v: d.upload }
        ],
        summary: wrap(SUMM[d.type] || []),
        isRujukan: !!d.rujukan,
        isPd: !!d.pd,
        checkText: df.length === 0 ? 'Semua target indikator konsisten dengan dokumen rujukan.' : (nOpen > 0 ? nOpen + ' temuan menunggu tinjauan.' : 'Semua temuan sudah ditinjau.'),
        flags: df,
        showReviewBtn: df.length > 0 && role.review
      });
    }

    // ---------- Buku saku ----------
    const BIMG = { eko: IMG.s1, infra: IMG.s21, riset: IMG.s33 };
    const BIDANG = D.bidang.map((b) => Object.assign({}, b, { img: BIMG[b.id] }));
    const bidangName = {};
    BIDANG.forEach((b) => { bidangName[b.id] = b.name; });
    const URUSAN = D.urusan;
    const sumOf = (ids) => {
      const list = ids.map((id) => byId[id]);
      const nr = list.filter((d) => d.st === 'risk').length;
      const nw = list.filter((d) => d.st === 'warn').length;
      if (!list.length) return { text: 'Belum ada indikator', fg: '#4A5462', nr: 0, nw: 0, list: list };
      if (nr) return { text: nr + ' berisiko' + (nw ? ' · ' + nw + ' perlu perhatian' : ''), fg: '#8E1C1C', nr: nr, nw: nw, list: list };
      if (nw) return { text: nw + ' perlu perhatian', fg: '#6B4513', nr: nr, nw: nw, list: list };
      return { text: 'Semua sesuai jalur', fg: '#2F5A1A', nr: 0, nw: 0, list: list };
    };
    const bidangCards = BIDANG.map((b) => {
      const on = s.bidang === b.id;
      return { name: b.name, img: b.img, countText: URUSAN.filter((u) => u.bidang === b.id).length + ' urusan', pressed: on ? 'true' : 'false', border: on ? '#21518E' : '#DDE3EA', bg: on ? '#E6EEF7' : '#FFFFFF', pick: () => self.setState({ bidang: b.id }) };
    });
    const urusanCards = URUSAN.filter((u) => u.bidang === s.bidang).map((u) => {
      const sm = sumOf(u.inds);
      return { name: u.name, countText: u.inds.length + ' indikator terhubung', sumText: sm.text, sumFg: sm.fg, open: () => self.go('bukusaku', { urusanId: u.id, bidang: u.bidang }) };
    });
    const blankUrusan = { name: '', bidangName: '', profil: '', inds: [], noInds: false, isu: [], draft: [] };
    let urusan = blankUrusan;
    const uSel = s.urusanId ? URUSAN.filter((u) => u.id === s.urusanId)[0] : null;
    if (uSel) {
      const sm = sumOf(uSel.inds);
      const draft = [];
      if (sm.list.length) {
        draft.push('Urusan ' + uSel.name + ' memiliki ' + sm.list.length + ' indikator yang dipantau. ' + (sm.nr ? sm.nr + ' di antaranya berisiko tidak tercapai pada 2029' : 'Tidak ada yang berisiko') + (sm.nw ? ', dan ' + sm.nw + ' perlu perhatian.' : '.'));
        sm.list.forEach((d) => { draft.push(d.nama + ': realisasi 2025 ' + d.realText + ', proyeksi 2029 ' + d.projText + ' terhadap target ' + d.targetText + '.'); });
      } else {
        draft.push('Belum ada indikator kinerja yang tertaut ke urusan ' + uSel.name + '. Ringkasan disusun dari profil dan isu strategis.');
      }
      draft.push('Isu strategis: ' + uSel.isu.join('; ') + '.');
      urusan = Object.assign({}, uSel, { bidangName: bidangName[uSel.bidang], inds: sm.list, noInds: !sm.list.length, isu: wrap(uSel.isu), draft: wrap(draft) });
    }

    // ---------- Asisten ----------
    const k = byId.kemiskinan;
    const EX = [
      { q: 'Apakah target kemiskinan 2029 akan tercapai?', sections: [
        sec('Fakta', ['Target 2029 dalam RPJMD: ' + k.targetText + '.', 'Realisasi 2025: ' + k.realText + ' (Monev RKPD 2025).']),
        sec('Analisis', ['Penurunan rata-rata ' + fmt(Math.abs(k.slope)) + ' poin per tahun sejak 2021.', 'Jika tren berlanjut, 2029 sekitar ' + k.projText + ', belum mencapai target.']),
        sec('Saran', ['Periksa realisasi Program Perlindungan dan Jaminan Sosial di RKPD 2026.', 'Monev Triwulan II 2026 mencatat pemutakhiran data penerima bantuan belum selesai.'])
      ], src: ['RPJMD 2025–2029, hal. 214', 'Monev RKPD 2025, hal. 38', 'RKPD 2026, hal. 112'] },
      { q: 'Program apa di RKPD 2026 yang mendukung pengurangan genangan?', sections: [
        sec('Fakta', ['Program Pengelolaan dan Pengembangan Sistem Drainase (Dinas PUPR).', 'Program Pengelolaan Sumber Daya Air (Dinas PUPR).']),
        sec('Analisis', ['Kedua program tertaut ke indikator Persentase Kawasan Tergenang, yang saat ini berstatus berisiko.']),
        sec('Saran', ['Pemeriksaan dokumen menemukan nama indikator berbeda di Renstra Dinas PUPR. Selesaikan temuan itu agar realisasi tercatat.'])
      ], src: ['RKPD 2026, hal. 147', 'Renstra Dinas PUPR 2025–2029, hal. 88'] },
      { q: 'Buatkan ringkasan urusan kesehatan untuk rapat besok', sections: [
        sec('Draf', ['IPM 2025 berada pada ' + byId.ipm.realText + ', dengan proyeksi 2029 sekitar ' + byId.ipm.projText + ' terhadap target ' + byId.ipm.targetText + '.', 'Status perlu perhatian: selisih kecil, tetapi laju kenaikan perlu dijaga.', 'Bahan diskusi: realisasi program di Renja Dinas Kesehatan 2026 dan catatan Monev Triwulan II 2026.'])
      ], src: ['RPJMD 2025–2029, hal. 209', 'Monev RKPD 2025, hal. 31'] }
    ];
    const exIdx = Math.min(Math.max(s.ex, 0), EX.length - 1);
    const custom = !!s.sent;
    let customBody;
    if (s.answerLoading) customBody = [sec('Catatan', ['Sedang mencari jawaban...'])];
    else if (s.answerErr) customBody = [sec('Catatan', ['Gagal menjawab: ' + s.answerErr])];
    else customBody = [sec('Fakta', [s.answer || 'Belum ada jawaban.'])];
    const chat = custom ? { q: s.sent, sections: customBody, src: [] } : EX[exIdx];
    const exChips = EX.map((e, i) => {
      const on = !custom && exIdx === i;
      return { label: e.q, pressed: on ? 'true' : 'false', bg: on ? '#E6EEF7' : '#FFFFFF', fg: on ? '#21518E' : '#1B2430', border: on ? '#21518E' : '#B7C0CC', pick: () => self.setState({ ex: i, sent: '' }) };
    });
    const send = () => {
      const t = (self.state.draft || '').trim();
      if (!t) return;
      self.setState({ sent: t, draft: '', answer: '', answerErr: '', answerLoading: true });
      window.askAssistant(t)
        .then((reply) => self.setState({ answer: reply, answerLoading: false }))
        .catch((err) => self.setState({ answerErr: err.message, answerLoading: false }));
    };

    // ---------- Pemeriksaan detail ----------
    const blankFlag = { jenis: '', title: '', ind: '', sLabel: '', refDoc: '', refPage: '', refVal: '', chkDoc: '', chkPage: '', chkVal: '', label: '', ai: '' };
    const flagSel = s.flagId ? flags.filter((f) => f.id === s.flagId)[0] : null;
    const decide = (stt) => () => {
      const next = Object.assign({}, self.state.flagStatus);
      next[self.state.flagId] = stt;
      self.setState({ flagStatus: next, flagId: null, note: '' });
      try { window.scrollTo(0, 0); } catch (e) {}
    };

    // ---------- Banner halaman ----------
    const BANNERS = {
      kinerja: { title: 'Target Kinerja 2025–2029', sub: 'Cakupan: ' + role.scope + ' · Pilih indikator untuk melihat tren dan analisis.', img: IMG.s13, detail: !!indSel },
      dokumen: { title: 'Dokumen Perencanaan', sub: 'Satu perpustakaan untuk dokumen kota, perangkat daerah dan regulasi.', img: IMG.s33, detail: !!docSel },
      bukusaku: { title: 'Buku Saku Bidang', sub: 'Pilih bidang, lalu urusan pemerintahan.', img: IMG.s21, detail: !!uSel },
      asisten: { title: 'Asisten AI', sub: 'Menjawab dari dokumen dan data Bapperida. Setiap jawaban menyertakan sumber; bila informasinya tidak ada di dokumen, asisten akan menyatakannya.', img: IMG.s1, detail: false },
      pemeriksaan: { title: 'Pemeriksaan Dokumen', sub: 'Temuan otomatis saat dokumen diunggah. Temuan berarti perlu dicek, bukan berarti salah.', img: IMG.s13, detail: !!flagSel }
    };
    const banner = BANNERS[tab] || { title: '', sub: '', img: IMG.s1, detail: false };

    return {
      yes: true,
      vidRef: this.vidRef,
      tabs: tabs,
      role: s.role,
      onRole: (e) => self.setState({ role: e.target.value }),
      roleLabel: role.label,
      scopeLabel: role.scope,
      canReview: role.review,

      isBeranda: tab === 'beranda',
      isKinerjaList: tab === 'kinerja' && !indSel,
      isKinerjaDetail: tab === 'kinerja' && !!indSel,
      isDocList: tab === 'dokumen' && !docSel,
      isDocDetail: tab === 'dokumen' && !!docSel,
      isBukuList: tab === 'bukusaku' && !uSel,
      isBukuDetail: tab === 'bukusaku' && !!uSel,
      isAsisten: tab === 'asisten',
      isReviewList: tab === 'pemeriksaan' && !flagSel,
      isReviewDetail: tab === 'pemeriksaan' && !!flagSel,
      showFab: tab !== 'asisten',

      showBanner: tab !== 'beranda',
      bannerImg: banner.img,
      bannerTitle: banner.title,
      bannerSub: banner.sub,
      bannerIsH1: !banner.detail,
      bannerNotH1: !!banner.detail,

      heroWarn: () => self.go('kinerja', { statusF: 'semua', jenis: 'Semua' }),
      noTop: topList.length === 0,
      carouselRef: this.carouselRef,
      heroRef: this.heroRef,
      headRef: this.headRef,
      headPos: tab === 'beranda' ? 'fixed' : 'sticky',
      headBg: clear ? 'transparent' : '#FFFFFF',
      headFg: clear ? '#FFFFFF' : '#21518E',
      headShadow: clear ? 'none' : '0 2px 14px rgba(14, 36, 64, 0.12)',
      headLine: clear ? 'rgba(255, 255, 255, 0.3)' : '#DDE3EA',
      logoFilter: clear ? 'brightness(0) invert(1)' : 'none',
      bapperidaLogo: clear ? 'assets/logo-bapperida-light.png' : 'assets/logo-bapperida.png',
      selBorder: clear ? 'transparent' : '#B7C0CC',
      kpis: kpis,
      charts: charts,
      docsRef: this.docsRef,
      mainPadB: tab === 'beranda' ? '0px' : '112px',
      bandM: 'calc((50% - 50vw) * ' + (s.docsP || 0) + ')',
      bandMB: Math.round(72 * (1 - (s.docsP || 0))) + 'px',
      bandR: Math.round(28 * (1 - (s.docsP || 0))) + 'px',
      roleShort: ({ tim: 'Ketua Tim Urusan', kabid: 'Kepala Bidang', admin: 'Admin', kaban: 'Kepala Badan' })[s.role] || 'Admin',
      noHomeDocs: !!hq && groups.length === 0,
      homeQ: s.homeQ,
      onHomeQ: (e) => self.setState({ homeQ: e.target.value }),
      onHomeKey: (e) => { if (e.key === 'Enter') homeSearch(); },
      homeSearch: homeSearch,
      counts: counts,
      hasTop: topList.length > 0,
      topTitle: s.role === 'kaban' ? 'Ringkasan untuk pimpinan' : 'Perlu ditindaklanjuti',
      topList: topList,
      openFlagsText: openFlags > 0 ? openFlags + ' temuan menunggu tinjauan dalam cakupan Anda.' : 'Tidak ada temuan yang menunggu tinjauan.',
      goReview: () => self.go('pemeriksaan', {}),
      groups: groups,

      jenisChips: jenisChips,
      statusChips: statusChips,
      indRows: indRows,
      noRows: indRows.length === 0,
      ind: ind,
      backToKinerja: () => self.go('kinerja', {}),

      docQ: s.docQ,
      onDocQ: (e) => self.setState({ docQ: e.target.value }),
      typeChips: ['Semua'].concat(TYPES.map((t) => t.code)).map((c) => Object.assign({ label: c, pick: () => self.setState({ docType: c }) }, chip(s.docType === c))),
      docRows: docRows,
      noDocs: docRows.length === 0,
      doc: doc,
      backToDocs: () => self.go('dokumen', {}),
      askDoc: () => self.go('asisten', { sent: docSel ? ('Apa poin utama ' + docSel.title + '?') : '', draft: '' }),

      bidangCards: bidangCards,
      urusanCards: urusanCards,
      urusan: urusan,
      backToBuku: () => self.go('bukusaku', {}),
      draftOpen: s.draftOpen,
      draftBtn: s.draftOpen ? 'Tutup draf AI' : 'Buat draf AI',
      toggleDraft: () => self.setState({ draftOpen: !self.state.draftOpen }),

      exChips: exChips,
      chatQ: chat.q,
      chatSections: chat.sections,
      chatSrc: wrap(chat.src),
      chatHasSrc: chat.src.length > 0,
      draft: s.draft,
      onDraft: (e) => self.setState({ draft: e.target.value }),
      onDraftKey: (e) => { if (e.key === 'Enter') send(); },
      send: send,

      reviewOpen: openFlags,
      reviewDone: myFlags.length - openFlags,
      flagRows: myFlags,
      noFlags: myFlags.length === 0,
      flag: flagSel || blankFlag,
      backToReview: () => self.go('pemeriksaan', {}),
      note: s.note,
      onNote: (e) => self.setState({ note: e.target.value }),
      markOk: decide('sesuai'),
      markFix: decide('perbaikan'),
      markIgnore: decide('abaikan'),

      goAsk: () => self.go('asisten', {})
    };
  }
}

(function () {
  const { createApp, reactive, computed, onMounted, onBeforeUnmount } = Vue;
  const inst = new Component({});
  inst.state = reactive(inst.state);
  const vals = computed(() => inst.renderVals());
  const keys = Object.keys(inst.renderVals());
  createApp({
    template: '#app-template',
    setup() {
      onMounted(() => { if (inst.componentDidMount) inst.componentDidMount(); });
      onBeforeUnmount(() => { if (inst.componentWillUnmount) inst.componentWillUnmount(); });
      const out = {};
      keys.forEach((k) => { out[k] = computed(() => vals.value[k]); });
      return out;
    }
  }).mount('#app');
})();
