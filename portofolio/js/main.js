/**
 * ⚡ MAIN UI & EDITORIAL LOGIC
 * Mikail Syafiq Ikhwanudin Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScanlinesToggle();
    initStickerWorkbench();
    initProjectModals();
    initLightbox();
    initContactActions();
    initScrollSpy();
    initStatsCounter();
    initLanguageToggle();
    initBtcSimulator();
});

/**
 * 🌓 Theme Engine (Dark / Light / System)
 */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('mkl_theme') || 'light';

    applyTheme(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = root.getAttribute('data-theme') || 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            if (window.soundEngine) window.soundEngine.playBlip();
        });
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('mkl_theme', theme);
        if (themeBtn) {
            themeBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
            const icon = themeBtn.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = theme === 'dark' ? '☀️' : '🌙';
            }
        }
    }
}

/**
 * 📺 CRT Scanlines & Retro Arcade Mode Toggle
 */
function initScanlinesToggle() {
    const crtBtn = document.getElementById('crt-toggle-btn');
    const root = document.documentElement;
    const isCrt = localStorage.getItem('mkl_crt') === 'true';

    if (isCrt) {
        root.classList.add('crt-active');
        if (crtBtn) crtBtn.classList.add('active');
    }

    if (crtBtn) {
        crtBtn.addEventListener('click', () => {
            const active = root.classList.toggle('crt-active');
            crtBtn.classList.toggle('active', active);
            localStorage.setItem('mkl_crt', active);
            if (window.soundEngine) {
                if (active) window.soundEngine.playPowerup();
                else window.soundEngine.playBlip();
            }
        });
    }
}

/**
 * 🏷️ Interactive Sticker Workbench (Stikerpedia & Fazima Print tribute)
 * Lets users drag stickers anywhere on screen and place them
 */
function initStickerWorkbench() {
    const clearBtn = document.getElementById('clear-stickers-btn');
    const stickerTrays = document.querySelectorAll('.sticker-tray-item');
    const playground = document.body;

    stickerTrays.forEach(item => {
        item.addEventListener('click', (e) => {
            const svgSrc = item.dataset.stickerSrc;
            const title = item.dataset.stickerName || 'Sticker';
            spawnStickerOnPage(svgSrc, title, e.clientX + 20, e.clientY + 20);
        });
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            document.querySelectorAll('.dropped-sticker').forEach(el => {
                el.style.transform = 'scale(0) rotate(-45deg)';
                setTimeout(() => el.remove(), 250);
            });
            if (window.soundEngine) window.soundEngine.playBump();
        });
    }

    function spawnStickerOnPage(src, title, x, y) {
        const sticker = document.createElement('div');
        sticker.className = 'draggable-sticker dropped-sticker';
        sticker.title = `${title} (Tarik ke mana saja!)`;
        sticker.style.position = 'fixed';
        sticker.style.left = `${Math.min(window.innerWidth - 100, Math.max(20, x))}px`;
        sticker.style.top = `${Math.min(window.innerHeight - 100, Math.max(80, y))}px`;
        sticker.style.zIndex = '999';

        sticker.innerHTML = `
            <img src="${src}" alt="${title}" class="sticker-img" />
            <button class="sticker-remove-btn" title="Hapus sticker">×</button>
        `;

        sticker.querySelector('.sticker-remove-btn').addEventListener('click', (ev) => {
            ev.stopPropagation();
            sticker.remove();
            if (window.soundEngine) window.soundEngine.playBlip();
        });

        playground.appendChild(sticker);
        if (window.soundEngine) window.soundEngine.playCoin();
    }
}

/**
 * 🪟 Interactive Project Modals
 */
const PROJECT_DATA = {
    'fazima': {
        title: 'Fazima Print',
        category: 'Printing Business / Digital Development',
        url: 'https://fazimaprint.com/',
        image: 'assets/designs/fazimaprint.jpg',
        badge: 'Production Live',
        description: 'Pengembangan dan eksplorasi solusi digital untuk operasional industri percetakan, mencakup pembaruan website, perancangan dashboard interaktif, serta optimasi alur kerja cetak stiker otomatis.',
        highlights: [
            'Website development & responsive digital presence',
            'Dashboard interface exploration for real-time order tracking',
            'Printing product workflow & sticker auto-layout planning',
            'Business operational systems integration'
        ],
        stack: ['HTML5 / Modern CSS', 'JavaScript', 'Operational Dashboard', 'Printing Automation']
    },
    'middlekid': {
        title: 'MiddleKid',
        category: 'Web3 / Blockchain / Product Research',
        url: 'https://middlekid.vercel.app',
        image: 'assets/projects/middlekid.png',
        badge: 'Base Ecosystem',
        description: 'Eksplorasi Web3 onboarding dan mitigasi risiko transaksi blockchain. Dirancang untuk membantu user awam memahami implikasi keamanan smart contract sebelum menandatangani signature/transaksi.',
        highlights: [
            'Web3 product development & intuitive UI',
            'Blockchain security research & smart contract risk scanner',
            'Transparent signature simulator on Base network',
            'User onboarding UX simplification for non-crypto natives'
        ],
        stack: ['Base Blockchain', 'Web3.js / Ethers', 'Smart Contract Risk Engine', 'Modern Frontend']
    },
    'stickerpedia': {
        title: 'Stickerpedia',
        category: 'Digital Product / Printing Automation',
        url: 'https://stikerpedia.fazimaprint.com/',
        image: 'assets/stickers/sample-cybercat.svg',
        badge: 'Printing Customizer',
        description: 'Platform otomasi custom stiker digital yang menghubungkan customer dengan mesin produksi cetak secara instan, dilengkapi live canvas customizer dan kalkulator harga real-time.',
        highlights: [
            'Interactive client-side SVG customizer & print preview',
            'Automated gang sheet layout algorithm for material savings',
            'Real-time price calculation by millimeter dimensions & material type',
            'Direct SVG & PDF export ready for printing production'
        ],
        stack: ['Interactive Canvas', 'SVG Processing', 'Automated Nesting Algorithm', 'E-Commerce Flow']
    },
    'nglpaper': {
        title: 'NGL Paper',
        category: 'Crypto Education / Celo Ecosystem',
        url: 'https://ngl-paper.vercel.app/',
        image: 'assets/designs/NGLPAPER.png',
        badge: 'Web3 Education',
        description: 'Inisiatif riset dan edukasi kripto yang merangkum serta menerjemahkan whitepaper proyek blockchain ke bahasa yang mudah dipahami, beroperasi di jaringan Celo untuk biaya transaksi ultra-rendah.',
        highlights: [
            'Simplification and visual synthesis of complex DeFi whitepapers',
            'Low-gas onboarding experiences utilizing Celo mobile micropayments',
            'Educational research library for emerging Web3 users',
            'Interactive financial glossary and risk awareness guides'
        ],
        stack: ['Celo Network', 'Market Analysis', 'Quantitative Research', 'Content Architecture']
    }
};

const PROJECT_DATA_ID = {
    'Fazima Print': {
        category: 'Bisnis Percetakan / Pengembangan Digital', badge: 'Aktif Produksi',
        description: 'Pengembangan solusi digital untuk bisnis percetakan, mulai dari website, dashboard pelacakan pesanan, hingga optimasi alur kerja cetak.',
        highlights: ['Pengembangan website dan katalog digital responsif', 'Eksplorasi dashboard untuk pelacakan pesanan', 'Perencanaan alur produk cetak dan layout gang-run', 'Integrasi sistem operasional bisnis']
    },
    MiddleKid: {
        category: 'Web3 / Blockchain / Riset Produk', badge: 'Ekosistem Base',
        description: 'Eksplorasi onboarding Web3 dan mitigasi risiko transaksi blockchain agar pengguna memahami risiko sebelum menandatangani transaksi.',
        highlights: ['Pengembangan produk Web3 dengan UI intuitif', 'Riset keamanan blockchain dan pemindai risiko smart contract', 'Simulasi signature transparan di jaringan Base', 'Penyederhanaan UX untuk pengguna non-kripto']
    },
    Stickerpedia: {
        category: 'Produk Digital / Otomasi Percetakan', badge: 'Customizer Percetakan',
        description: 'Platform otomasi custom stiker dengan live canvas customizer, preview cetak, dan kalkulator harga real-time.',
        highlights: ['Customizer SVG interaktif dan preview cetak', 'Algoritma layout otomatis untuk menghemat material', 'Kalkulator harga berdasarkan ukuran dan bahan', 'Ekspor SVG dan PDF yang siap produksi']
    },
    'NGL Paper': {
        category: 'Edukasi Kripto / Ekosistem Celo', badge: 'Edukasi Web3',
        description: 'Inisiatif edukasi kripto yang merangkum whitepaper blockchain menjadi materi sederhana dan mudah dipahami untuk pemula.',
        highlights: ['Penyederhanaan whitepaper DeFi yang kompleks', 'Onboarding micropayment mobile-first di Celo', 'Library riset untuk pengguna Web3 baru', 'Glosarium dan panduan kesadaran risiko finansial']
    }
};

function initProjectModals() {
    const modal = document.getElementById('project-detail-modal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close-btn');
    const backdrop = modal.querySelector('.modal-backdrop');

    document.querySelectorAll('[data-open-project]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const projKey = trigger.dataset.openProject;
            const data = PROJECT_DATA[projKey];
            if (!data) return;

            populateModal(modal, data);
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            if (window.soundEngine) window.soundEngine.playPowerup();
        });
    });

    const closeModal = () => {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
        if (window.soundEngine) window.soundEngine.playBlip();
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    function populateModal(modalEl, data) {
        const localizedData = document.documentElement.lang === 'id' ? { ...data, ...(PROJECT_DATA_ID[data.title] || {}) } : data;
        modalEl.querySelector('#modal-project-title').textContent = localizedData.title;
        modalEl.querySelector('#modal-project-category').textContent = localizedData.category;
        modalEl.querySelector('#modal-project-badge').textContent = localizedData.badge;
        modalEl.querySelector('#modal-project-desc').textContent = localizedData.description;

        const imgEl = modalEl.querySelector('#modal-project-img');
        if (imgEl) {
            imgEl.src = data.image;
            imgEl.alt = localizedData.title;
        }

        const linkEl = modalEl.querySelector('#modal-project-link');
        if (linkEl) {
            linkEl.href = localizedData.url;
            linkEl.style.display = localizedData.url && localizedData.url !== '#' ? 'inline-flex' : 'none';
        }

        const highlightsEl = modalEl.querySelector('#modal-project-highlights');
        if (highlightsEl) {
            highlightsEl.innerHTML = localizedData.highlights.map(h => `<li><span class="hl-bullet">▹</span> ${h}</li>`).join('');
        }

        const stackEl = modalEl.querySelector('#modal-project-stack');
        if (stackEl) {
            stackEl.innerHTML = data.stack.map(s => `<span class="stack-tag">${s}</span>`).join('');
        }
    }
}

/**
 * 🖼️ Image Lightbox for Design Archive
 */
function initLightbox() {
    const lightbox = document.getElementById('image-lightbox-modal');
    if (!lightbox) return;

    const img = lightbox.querySelector('.lightbox-image');
    const caption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('[data-lightbox-src]').forEach(el => {
        el.addEventListener('click', () => {
            const src = el.dataset.lightboxSrc;
            const cap = el.dataset.lightboxCaption || '';
            img.src = src;
            caption.textContent = cap;
            lightbox.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            if (window.soundEngine) window.soundEngine.playBlip();
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    const backdrop = lightbox.querySelector('.modal-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeLightbox);
}

/**
 * Bilingual interface toggle.
 */
function initLanguageToggle() {
    const button = document.getElementById('language-toggle-btn');
    if (!button) return;

    const applyLanguage = (language) => {
        document.documentElement.lang = language;
        document.querySelectorAll('[data-en][data-id]').forEach((element) => {
            element.textContent = element.dataset[language === 'id' ? 'id' : 'en'];
        });
        applyExtendedTranslations(language);
        button.textContent = language === 'id' ? 'EN' : 'ID';
        button.setAttribute('aria-label', language === 'id' ? 'Switch to English' : 'Beralih ke Bahasa Indonesia');
        localStorage.setItem('mkl_language', language);
    };

    const savedLanguage = localStorage.getItem('mkl_language') || 'en';
    applyLanguage(savedLanguage);
    button.addEventListener('click', () => applyLanguage(document.documentElement.lang === 'id' ? 'en' : 'id'));

    function applyExtendedTranslations(language) {
        const isIndonesian = language === 'id';
        const setText = (selector, values) => {
            document.querySelectorAll(selector).forEach((element, index) => {
                if (values[index] !== undefined) element.textContent = values[index];
            });
        };
        const setHtml = (selector, values) => {
            document.querySelectorAll(selector).forEach((element, index) => {
                if (values[index] !== undefined) element.innerHTML = values[index];
            });
        };
        const choose = (english, indonesian) => (isIndonesian ? indonesian : english);

        setHtml('.hero-intro', [choose('Digital Creative • Technology Enthusiast • Product Explorer.<br>Exploring the intersection of design, digital products, and decentralized finance through research, creativity, and technology.', 'Kreator Digital • Penggemar Teknologi • Eksplorator Produk.<br>Mengeksplorasi persimpangan desain, produk digital, dan keuangan terdesentralisasi melalui riset, kreativitas, dan teknologi.')]);
        setText('.hero-photo-header span:first-child', [choose('PORTRAIT // MSI_2026', 'POTRET // MSI_2026')]);
        setText('.hero-photo-header span:last-child', [choose('● ACTIVE', '● AKTIF')]);
        setText('.hero-photo-caption', [choose('Mikail Syafiq Ikhwanudin', 'Mikail Syafiq Ikhwanudin')]);
        setText('.hero-photo-badge', [choose('CREATIVE & TECH', 'KREATIF & TEKNOLOGI')]);
        setHtml('.about-narrative p', [
            choose('"I\'m interested in the intersection of technology, creativity, and business."', '"Saya tertarik pada persimpangan teknologi, kreativitas, dan bisnis."'),
            choose('My journey started with <strong>Software Engineering education</strong> (Rekayasa Perangkat Lunak - SMK Muhammadiyah Kota Tasikmalaya) and gradually expanded into graphic design, website development, digital product exploration, and financial research.', 'Perjalanan saya dimulai dari <strong>pendidikan Rekayasa Perangkat Lunak</strong> di SMK Muhammadiyah Kota Tasikmalaya, lalu berkembang ke desain grafis, pengembangan website, eksplorasi produk digital, dan riset keuangan.'),
            choose('I enjoy understanding how things work, exploring new ideas, and turning concepts into practical solutions. Having worked directly on the factory floor of the <strong>commercial printing industry</strong> and completed professional internship at <strong>Xiaomi Service Center</strong>, I combine pragmatic operational discipline with cutting-edge digital craftsmanship.', 'Saya senang memahami cara kerja sesuatu, mengeksplorasi ide baru, dan mengubah konsep menjadi solusi praktis. Pengalaman langsung di lantai produksi <strong>industri percetakan komersial</strong> serta magang profesional di <strong>Xiaomi Service Center</strong> membuat saya memadukan kedisiplinan operasional dengan keterampilan digital modern.'),
            choose('<em>"For me, learning is not just about acquiring knowledge. It\'s about applying it, experimenting, and creating something meaningful."</em>', '<em>"Bagi saya, belajar bukan hanya tentang memperoleh pengetahuan. Belajar adalah menerapkannya, bereksperimen, dan menciptakan sesuatu yang bermakna."</em>')
        ]);

        setText('.stat-label', isIndonesian ? [
            'Tahun Eksplorasi Digital Multidisipliner',
            'Proyek Web, Web3 & Otomasi Percetakan',
            'Aset Desain Grafis & Percetakan Komersial',
            'Pembelajar & Builder Mandiri yang Penuh Rasa Ingin Tahu'
        ] : [
            'Years of Multidisciplinary Digital Exploration',
            'Web, Web3 & Printing Automation Projects',
            'Commercial Print & Graphic Design Assets',
            'Independent Curious Learner & Builder'
        ]);
        setText('.exp-header', [choose('Selected Experience & Roots', 'Pengalaman & Akar Profesional')]);
        setText('.exp-title', isIndonesian ? ['Eksplorasi Digital & Web3', 'Desainer Grafis — Industri Percetakan', 'Dukungan Teknis & Diagnostik Hardware'] : ['Digital & Web3 Exploration', 'Graphic Designer — Printing Industry', 'Technical Support & Hardware Diagnostics']);
        setText('.exp-org', isIndonesian ? ['Proyek Mandiri (MiddleKid, Fazima, NGL Paper) • Berjalan', 'Produksi Percetakan Komersial • ± 6 Bulan', 'Xiaomi Service Center (PT Unicom Harbura Jaya Makmur) • ± 4 Bulan'] : ['Independent Projects (MiddleKid, Fazima, NGL Paper) • Ongoing', 'Commercial Printing Production • ± 6 Months', 'Xiaomi Service Center (PT Unicom Harbura Jaya Makmur) • ± 4 Months']);
        setText('.exp-desc', isIndonesian ? ['Merancang antarmuka terdesentralisasi, meneliti kerentanan keamanan blockchain, dan membuat produk digital otomatis.', 'Desain visual prepress, layout vektor, kalibrasi warna, konsultasi teknis pelanggan, dan optimasi file cetak dari awal hingga akhir.', 'Membongkar perangkat, melakukan perbaikan sesuai SOP, opname inventaris, katalogisasi suku cadang, dan mendukung alur kerja teknisi hardware.'] : ['Designing decentralized interfaces, researching blockchain security vulnerabilities, and creating automated digital products.', 'End-to-end prepress visual design, vector layouting, color calibration, customer technical consultations, and print file optimization.', 'Device disassembly, strict SOP repairs, inventory stock opname, spare-part cataloging, and technician hardware workflow support.']);

        setText('.expertise-title', isIndonesian ? ['Desain Grafis & Komunikasi Visual', 'Website & Pengembangan Digital', 'Pemasaran Digital & Konten', 'Riset Keuangan & Pasar', 'Pengembangan Bisnis & Proyek', 'Analisis Pasar'] : ['Graphic Design & Visual Communication', 'Website & Digital Development', 'Digital Marketing & Content', 'Financial & Market Research', 'Business & Project Development', 'Market Analysis']);
        setText('.expertise-list li', isIndonesian ? [
            'Desain promosi & materi pemasaran', 'Desain banner, billboard, dan kebutuhan cetak komersial', 'Identitas visual brand & sistem tipografi', 'Mockup produk & kemasan presentasi', 'Pengeditan gambar raster & vektor',
            'Arsitektur HTML5 & CSS modern yang semantik', 'Pengembangan website responsif', 'Prototyping antarmuka UI/UX & ergonomi', 'Konsep dashboard operasional & analitik', 'Eksplorasi frontend Web3 & API terdesentralisasi',
            'Copywriting persuasif & penulisan editorial', 'Strategi media sosial & konten visual yang menarik', 'Penjadwalan konten & perencanaan multi-kanal', 'Kampanye promosi peluncuran produk', 'Sintesis tren digital & riset audiens',
            'Riset on-chain cryptocurrency & tokenomics', 'Valuasi pasar saham & analisis teknikal', 'Riset fundamental aset & pelaporan', 'Siklus tren pasar & analisis makro', 'Strategi kuantitatif & eksperimen algoritmik',
            'Riset kelayakan produk digital', 'Eksplorasi model bisnis & harga', 'Perencanaan proyek end-to-end & milestone', 'Otomasi alur kerja & optimalisasi operasional', 'Pengembangan venture digital & prototyping',
            'Memahami tren harga, momentum, dan struktur pasar', 'Analisis teknikal dengan support, resistance, dan indikator', 'Analisis fundamental aset, sektor, dan kondisi makro', 'Manajemen risiko, skenario, dan keputusan berbasis probabilitas', 'Mengubah data pasar menjadi insight yang jelas dan dapat ditindaklanjuti'
        ] : [
            'Promotional design & marketing collaterals', 'Banner, billboard, and commercial print design', 'Brand visual identity & typography systems', 'Product mockups & presentation packaging', 'Digital raster & vector image editing',
            'HTML5 & modern CSS semantic architectures', 'Responsive website engineering', 'UI/UX interface prototyping & ergonomics', 'Operational dashboard & analytics concepts', 'Web3 frontend & decentralized API exploration',
            'Persuasive copywriting & editorial drafting', 'Social media strategy & engaging visual content', 'Content scheduling & multi-channel planning', 'Product launch promotion campaigns', 'Digital trend synthesis & audience research',
            'Cryptocurrency on-chain & tokenomics research', 'Stock market valuation & technical analysis', 'Fundamental asset research & reporting', 'Market trend cycles & macro analysis', 'Quantitative strategy & algorithmic experiments',
            'Digital product feasibility research', 'Business model & pricing exploration', 'End-to-end project planning & milestone scoping', 'Workflow automation & operational optimization', 'Digital venture development & prototyping',
            'Understanding price trends, momentum, and market structure', 'Technical analysis using support, resistance, and indicators', 'Fundamental analysis of assets, sectors, and macro conditions', 'Risk management, scenarios, and probability-based decisions', 'Turning market data into clear, actionable insights'
        ]);

        setText('.project-category', isIndonesian ? ['Bisnis Percetakan / Pengembangan Digital', 'Web3 / Blockchain / Riset Produk', 'Produk Digital / Otomasi Percetakan', 'Edukasi Kripto / Ekosistem Celo'] : ['Printing Business / Digital Development', 'Web3 / Blockchain / Product Research', 'Digital Product / Printing Automation', 'Crypto Education / Celo Ecosystem']);
        setText('.project-badge', isIndonesian ? ['Aktif Produksi', 'Ekosistem Base', 'Tool Interaktif', 'Terdesentralisasi'] : ['Production Live', 'Base Ecosystem', 'Interactive Tool', 'Decentralized']);
        setText('.project-title', ['Fazima Print', 'MiddleKid', 'Stickerpedia', 'NGL Paper']);
        setText('.project-desc', isIndonesian ? [
            'Pengembangan dan eksplorasi solusi digital untuk bisnis percetakan yang dinamis, termasuk website modern, dashboard pelacakan operasional, dan optimasi alur kerja percetakan.',
            'Eksplorasi onboarding Web3 dan keamanan transaksi untuk membantu pengguna memahami risiko sebelum menandatangani transaksi blockchain.',
            'Customizer web dan platform pemesanan otomatis untuk produksi stiker, yang menghubungkan aset vektor dengan harga real-time dan algoritma nesting lembar cetak.',
            'Inisiatif edukasi kripto yang menyederhanakan whitepaper blockchain untuk pemula, dengan pengalaman pembayaran mikro di jaringan Celo.'
        ] : [
            'Development and exploration of digital solutions for a fast-paced printing business, including modern web presence, operational tracking dashboards, and printing workflow optimization.',
            'An in-depth exploration of Web3 user onboarding and transaction security, specifically designed to help users understand potential risks before signing blockchain transactions.',
            'An automated web customizer and ordering platform for sticker production, connecting visual vector assets with real-time pricing and automated print-sheet nesting algorithms.',
            'Crypto educational initiative focused on deconstructing, translating, and synthesizing complex blockchain whitepapers for beginners, operating on the Celo network for near-zero transaction fees.'
        ]);
        setHtml('.project-highlights li', isIndonesian ? [
            '<span class="bullet">▹</span> Pengembangan website dan katalog yang mudah digunakan', '<span class="bullet">▹</span> Eksplorasi dashboard untuk manajemen pekerjaan', '<span class="bullet">▹</span> Perencanaan alur produk cetak dan layout gang-run', '<span class="bullet">▹</span> Integrasi sistem operasional bisnis',
            '<span class="bullet">▹</span> Pengembangan produk Web3 dengan UI responsif', '<span class="bullet">▹</span> Riset keamanan blockchain dan simulasi signature', '<span class="bullet">▹</span> Konsep pemindai risiko smart contract', '<span class="bullet">▹</span> Eksplorasi UX di ekosistem Base',
            '<span class="bullet">▹</span> Customizer canvas SVG interaktif & preview cetak', '<span class="bullet">▹</span> Kalkulator ukuran milimeter & harga real-time', '<span class="bullet">▹</span> Algoritma layout otomatis untuk mengurangi limbah vinyl', '<span class="bullet">▹</span> Pipeline ekspor SVG/PDF siap cetak',
            '<span class="bullet">▹</span> Penyederhanaan dan sintesis visual protokol DeFi', '<span class="bullet">▹</span> Onboarding micropayment kripto mobile-first di Celo', '<span class="bullet">▹</span> Library riset edukasi untuk pengguna Web3 baru', '<span class="bullet">▹</span> Infografik visual untuk menerjemahkan ekonomi kripto'
        ] : [
            '<span class="bullet">▹</span> Website development and user-friendly catalog showcase', '<span class="bullet">▹</span> Dashboard interface exploration for job management', '<span class="bullet">▹</span> Printing product workflow and gang-run layout planning', '<span class="bullet">▹</span> Business operational system integration',
            '<span class="bullet">▹</span> Web3 product development with responsive UI', '<span class="bullet">▹</span> Blockchain security research and signature simulation', '<span class="bullet">▹</span> Smart contract risk analyzer concepts', '<span class="bullet">▹</span> User experience exploration built on the Base ecosystem',
            '<span class="bullet">▹</span> Client-side interactive canvas customizer & live preview', '<span class="bullet">▹</span> Real-time millimetric dimension & price calculator', '<span class="bullet">▹</span> Automated layout algorithm to minimize vinyl printing waste', '<span class="bullet">▹</span> Direct print-ready SVG/PDF export pipelines',
            '<span class="bullet">▹</span> Synthesis and simplification of complex DeFi protocols', '<span class="bullet">▹</span> Mobile-first crypto micropayment onboarding on Celo', '<span class="bullet">▹</span> Educational research library for emerging Web3 users', '<span class="bullet">▹</span> Visual infographics translating crypto economics'
        ]);
        setText('.btn-project-link span', isIndonesian ? ['Kunjungi Website', 'Buka MiddleKid', 'Kunjungi Stickerpedia', 'Kunjungi NGL Paper'] : ['Visit Live Website', 'Launch MiddleKid', 'Visit Stickerpedia', 'Visit NGL Paper']);
        setText('.btn-project-details', isIndonesian ? ['Lihat Studi Kasus', 'Lihat Studi Kasus', 'Lihat Studi Kasus', 'Lihat Studi Kasus'] : ['Inspect Case Study', 'Inspect Case Study', 'Inspect Case Study', 'Inspect Case Study']);
        setText('.channel-left > div > div:first-child', isIndonesian ? ['WhatsApp Langsung', 'Pertanyaan Email', 'Aplikasi Web3 MiddleKid', 'Portal Fazima Print', 'Portal NGL Paper'] : ['WhatsApp Direct', 'Email Inquiries', 'MiddleKid Web3 App', 'Fazima Print Portal', 'NGL Paper Portal']);
        setText('.modal-dialog h4', isIndonesian ? ['Sorotan Utama & Arsitektur:', 'Teknologi & Domain:'] : ['Key Highlights & Architecture:', 'Tech Stack & Domains:']);
        setText('#modal-project-link span', [choose('Visit Live Project', 'Kunjungi Proyek')]);
        setText('.footer-credits', [choose('Crafted with Swiss Editorial Precision & Pixel-Finance Nostalgia', 'Dibuat dengan presisi editorial Swiss dan nostalgia arcade pixel-finance')]);
        setText('.sticker-dock-label strong', [choose('STICKER TRAY', 'TRAY STIKER')]);
        setText('.sticker-dock-label span', [choose('Click & Drag', 'Klik & Tarik')]);
    }
}

/**
 * One-minute BTC long/short game using a local simulated price series.
 */
function initBtcSimulator() {
    const simulator = document.getElementById('btc-simulator');
    if (!simulator) return;

    const candlesEl = document.getElementById('btc-candles');
    const entryMarker = document.getElementById('btc-entry-marker');
    const entryLine = document.getElementById('btc-entry-line');
    const entryDot = document.getElementById('btc-entry-dot');
    const entryLabel = document.getElementById('btc-entry-label');
    const priceEl = document.getElementById('btc-current-price');
    const timerEl = document.getElementById('btc-timer');
    const statusEl = document.getElementById('btc-position-status');
    const resetBtn = document.getElementById('btc-reset-btn');
    const scoreEl = document.getElementById('btc-score');
    const levelEl = document.getElementById('btc-level');
    const levelProgressEl = document.getElementById('btc-level-progress');
    const scoreMessageEl = document.getElementById('btc-score-message');
    const claimBox = document.getElementById('btc-claim-box');
    const positionButtons = simulator.querySelectorAll('.btc-position-btn');
    const chartWidth = 900;
    const chartHeight = 300;
    const padding = 18;
    const candleWidth = 22;
    let candles = [];
    let timer = null;
    let position = null;
    let entryCandle = null;
    let remaining = 10;
    let score = Number.parseInt(localStorage.getItem('btc_sim_score') || '0', 10);
    if (!Number.isFinite(score) || score < 0) score = 0;

    const formatPrice = (value) => `$${Math.round(value).toLocaleString('en-US')}`;

    const currentLevel = () => Math.min(5, Math.floor(score / 100) + 1);

    const makeCandle = (open) => {
        const close = Math.max(1000, open + (Math.random() - 0.47) * 180);
        const high = Math.max(open, close) + Math.random() * 90;
        const low = Math.min(open, close) - Math.random() * 90;
        return { open, close, high, low };
    };

    const renderChart = () => {
        const min = Math.min(...candles.map((candle) => candle.low)) - 80;
        const max = Math.max(...candles.map((candle) => candle.high)) + 80;
        const candleStep = (chartWidth - padding * 2) / candles.length;
        const scaleY = (value) => chartHeight - padding - ((value - min) / (max - min)) * (chartHeight - padding * 2);

        candlesEl.innerHTML = candles.map((candle, index) => {
            const x = padding + index * candleStep + candleStep / 2;
            const openY = scaleY(candle.open);
            const closeY = scaleY(candle.close);
            const highY = scaleY(candle.high);
            const lowY = scaleY(candle.low);
            const bodyY = Math.min(openY, closeY);
            const bodyHeight = Math.max(3, Math.abs(openY - closeY));
            const bodyClass = candle.close >= candle.open ? 'btc-candle-up' : 'btc-candle-down';
            return `<g class="btc-candle ${bodyClass}" aria-label="BTC candle ${index + 1}">
                <line class="btc-candle-wick" x1="${x.toFixed(1)}" y1="${highY.toFixed(1)}" x2="${x.toFixed(1)}" y2="${lowY.toFixed(1)}"></line>
                <rect class="btc-candle-body" x="${(x - candleWidth / 2).toFixed(1)}" y="${bodyY.toFixed(1)}" width="${candleWidth}" height="${bodyHeight.toFixed(1)}"></rect>
            </g>`;
        });
        if (entryCandle && position) {
            const entryIndex = candles.indexOf(entryCandle);
            if (entryIndex >= 0) {
                const entryX = padding + entryIndex * candleStep + candleStep / 2;
                const entryY = scaleY(entryCandle.close);
                entryLine.setAttribute('x1', entryX.toFixed(1));
                entryLine.setAttribute('x2', entryX.toFixed(1));
                entryDot.setAttribute('cx', entryX.toFixed(1));
                entryDot.setAttribute('cy', entryY.toFixed(1));
                entryLabel.setAttribute('x', entryX.toFixed(1));
                entryLabel.textContent = `ENTRY ${position.toUpperCase()}`;
                entryMarker.removeAttribute('hidden');
            }
        }
        priceEl.textContent = formatPrice(candles[candles.length - 1].close);
    };

    const updateScorePanel = () => {
        const level = currentLevel();
        const progress = level >= 5 ? 100 : score % 100;
        scoreEl.textContent = score.toLocaleString('en-US');
        levelEl.textContent = level.toString();
        levelProgressEl.style.width = `${progress}%`;
        claimBox.hidden = level < 5;
        scoreMessageEl.textContent = level >= 5
            ? (document.documentElement.lang === 'id' ? 'Level 5 tercapai. Reward simulasi siap diklaim.' : 'Level 5 reached. Your simulated reward is ready to claim.')
            : (document.documentElement.lang === 'id' ? 'Menang satu ronde untuk mendapatkan +25 poin.' : 'Win a round to earn +25 points.');
    };

    const setStatus = (message, languageMessage) => {
        statusEl.dataset.en = message;
        statusEl.dataset.id = languageMessage;
        const language = document.documentElement.lang === 'id' ? 'id' : 'en';
        statusEl.textContent = language === 'id' ? languageMessage : message;
    };

    const reset = () => {
        window.clearInterval(timer);
        timer = null;
        position = null;
        entryCandle = null;
        remaining = 10;
        candles = [];
        let open = 68420;
        for (let index = 0; index < 24; index += 1) {
            const candle = makeCandle(open);
            candles.push(candle);
            open = candle.close;
        }
        renderChart();
        entryMarker.setAttribute('hidden', '');
        timerEl.textContent = '00:10';
        setStatus('Choose LONG or SHORT to start the 10-second simulation.', 'Pilih LONG atau SHORT untuk memulai simulasi 10 detik.');
        positionButtons.forEach((button) => { button.disabled = false; });
        updateScorePanel();
    };

    const finish = () => {
        const change = candles[candles.length - 1].close - candles[0].open;
        const isWin = position === 'long' ? change > 0 : change < 0;
        const result = isWin ? 'WIN' : 'LOSS';
        const resultId = isWin ? 'MENANG' : 'RUGI';
        const direction = position === 'long' ? 'LONG' : 'SHORT';
        if (isWin) {
            score += 25;
            localStorage.setItem('btc_sim_score', score.toString());
        }
        updateScorePanel();
        setStatus(`${result}: ${direction} ended at ${formatPrice(candles[candles.length - 1].close)}${isWin ? ' (+25 points)' : ''}. Press Reset Game to play again.`, `${resultId}: Posisi ${direction} berakhir di ${formatPrice(candles[candles.length - 1].close)}${isWin ? ' (+25 poin)' : ''}. Tekan Reset Game untuk bermain lagi.`);
        positionButtons.forEach((button) => { button.disabled = true; });
        timer = null;
    };

    const start = (selectedPosition) => {
        if (timer) return;
        position = selectedPosition;
        entryCandle = candles[candles.length - 1];
        remaining = 10;
        renderChart();
        positionButtons.forEach((button) => { button.disabled = true; });
        setStatus(`${selectedPosition.toUpperCase()} opened. Waiting 10 seconds for the simulated result...`, `Posisi ${selectedPosition.toUpperCase()} dibuka. Menunggu hasil simulasi 10 detik...`);
        timer = window.setInterval(() => {
            remaining -= 1;
            const nextCandle = makeCandle(candles[candles.length - 1].close);
            candles.push(nextCandle);
            if (candles.length > 30) candles.shift();
            renderChart();
            timerEl.textContent = `00:${String(remaining).padStart(2, '0')}`;
            if (remaining <= 0) {
                window.clearInterval(timer);
                finish();
            }
        }, 1000);
    };

    positionButtons.forEach((button) => button.addEventListener('click', () => start(button.dataset.position)));
    resetBtn.addEventListener('click', reset);
    reset();
}

/**
 * 📋 Contact actions & Toast Notifications
 */
function initContactActions() {
    const copyBtns = document.querySelectorAll('[data-copy-text]');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.copyText;
            navigator.clipboard.writeText(text).then(() => {
                showToast(`✓ Tersalin ke clipboard: ${text}`);
                if (window.soundEngine) window.soundEngine.playCoin();
            }).catch(() => {
                showToast(`Salin: ${text}`);
            });
        });
    });
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'pixel-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

/**
 * 🧭 Scroll Spy & Sticky Header Progress
 */
function initScrollSpy() {
    const progressBar = document.getElementById('scroll-progress-fill');
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) {
            progressBar.style.width = `${scrolled}%`;
        }
    }, { passive: true });
}

/**
 * 📊 Stats Counter Animation
 */
function initStatsCounter() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.targetVal || '0', 10);
                animateCount(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-counter').forEach(el => observer.observe(el));

    function animateCount(el, target) {
        let current = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = current.toLocaleString();
        }, 30);
    }
}
