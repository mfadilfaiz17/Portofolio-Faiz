document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 0. FIX SCROLL RESTORATION 
    // ==========================================
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // ==========================================
    // EFEK PENGETIKAN (TYPING EFFECT) BERULANG
    // ==========================================
    const typingText = document.getElementById("typing-text");
    const words = ["Faiz.", "AI Enthusiast.", "Exploring Tech Enterprise."]; 
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        if (!typingText) return;

        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 80 : 150;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; 
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex++;
            if (wordIndex >= words.length) {
                wordIndex = 0; 
            }
            typeSpeed = 500; 
        }

        setTimeout(typeEffect, typeSpeed);
    }

    setTimeout(typeEffect, 1500);
    
    // ==========================================
    // 1. PRE-LOADER & AOS INITIALIZATION LOGIC
    // ==========================================
    const loader = document.getElementById('loader');
    
    // Menunggu seluruh elemen web dimuat terlebih dahulu
    window.addEventListener('load', () => {
        setTimeout(() => {
            // Animasi mengangkat layer hitam ke atas
            loader.style.transform = 'translateY(-100%)';
            
            // Inisialisasi AOS (Animasi Scroll) setelah pre-loader hilang
            AOS.init({
                duration: 1000,
                once: false,
                mirror: true,
                offset: 100
            });
        }, 2000); // Tampil selama 2 detik
    });

    // ==========================================
    // 2. NAVBAR MOBILE TOGGLE LOGIC
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const mainHeader = document.getElementById('main-header');

    // Kita hanya perlu menambah/menghapus class 'open', sisanya diatur oleh CSS
    menuToggle.addEventListener('click', () => {
        mainHeader.classList.toggle('open');
    });

    // Otomatis menutup menu saat link navigasi di-klik di mode HP
    const navLinks = document.querySelectorAll('#nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainHeader.classList.remove('open');
        });
    });

    // ==========================================
    // 3. FITUR FORM SUBMIT CONTACT
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Pesan berhasil dikirim! Faiz akan segera membalasnya.");
            contactForm.reset();
        });
    }

    // ==========================================
    // 4. ZORA AGENT CHATBOT LOGIC
    // ==========================================
    const zoraWrapper = document.getElementById('zora-wrapper');
    const zoraTrigger = document.getElementById('zora-trigger');
    const zoraChatbot = document.getElementById('zora-chatbot');
    const zoraClose = document.getElementById('zora-close');
    const zoraInput = document.getElementById('zora-input');
    const zoraSend = document.getElementById('zora-send');
    const zoraBody = document.getElementById('zora-body');
    const zoraHeader = document.getElementById('zora-header');
    
    // Elemen Baru Untuk Fitur Tambahan
    const zoraSuggestions = document.getElementById('zora-suggestions');
    const zoraLoading = document.getElementById('zora-loading');

    let isDragging = false;
    let hasMoved = false; 
    let startX, startY, initialLeft, initialTop;

    function startDrag(e) {
        if (e.button !== 0) return; 
        if (e.target.closest('#zora-close') || e.target.closest('#zora-input') || e.target.closest('#zora-send') || e.target.closest('.zora-suggestions')) return;

        e.preventDefault(); 
        isDragging = true;
        hasMoved = false;

        const rect = zoraWrapper.getBoundingClientRect();
        zoraWrapper.style.bottom = 'auto';
        zoraWrapper.style.right = 'auto';
        zoraWrapper.style.left = rect.left + 'px';
        zoraWrapper.style.top = rect.top + 'px';

        startX = e.clientX;
        startY = e.clientY;
        initialLeft = rect.left;
        initialTop = rect.top;
    }

    zoraTrigger.addEventListener('mousedown', startDrag);
    zoraHeader.addEventListener('mousedown', startDrag);

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            hasMoved = true;
        }

        let newLeft = initialLeft + deltaX;
        let newTop = initialTop + deltaY;

        const wRect = zoraWrapper.getBoundingClientRect();
        const cRect = zoraChatbot.classList.contains('active') ? zoraChatbot.getBoundingClientRect() : wRect;

        const bounds = {
            left: Math.min(wRect.left, cRect.left),
            right: Math.max(wRect.right, cRect.right),
            top: Math.min(wRect.top, cRect.top),
            bottom: Math.max(wRect.bottom, cRect.bottom)
        };

        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        if (bounds.left < 0) newLeft += Math.abs(bounds.left);
        else if (bounds.right > screenW) newLeft -= (bounds.right - screenW);

        if (bounds.top < 0) newTop += Math.abs(bounds.top);
        else if (bounds.bottom > screenH) newTop -= (bounds.bottom - screenH);

        zoraWrapper.style.left = newLeft + 'px';
        zoraWrapper.style.top = newTop + 'px';
    });

    document.addEventListener('mouseup', () => { isDragging = false; });

    zoraTrigger.addEventListener('click', () => {
        if (hasMoved) return; 
        
        const wrapperRect = zoraWrapper.getBoundingClientRect();
        const chatW = 350;
        const chatH = 430;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        
        let safeTop = wrapperRect.top;
        let safeLeft = wrapperRect.left;

        const expectedTop = wrapperRect.bottom - 70 - chatH;
        if (expectedTop < 15) safeTop += Math.abs(expectedTop) + 20; 
        
        const expectedBottom = wrapperRect.bottom;
        if (expectedBottom > screenH - 15) safeTop -= (expectedBottom - screenH) + 20;

        const iconCenter = wrapperRect.left + (wrapperRect.width / 2);
        const expectedLeft = iconCenter - (chatW / 2);
        const expectedRight = iconCenter + (chatW / 2);

        if (expectedLeft < 15) safeLeft += Math.abs(expectedLeft) + 20; 
        else if (expectedRight > screenW - 15) safeLeft -= (expectedRight - screenW) + 20; 

        zoraWrapper.style.top = safeTop + 'px';
        zoraWrapper.style.left = safeLeft + 'px';

        zoraChatbot.classList.add('active');
        zoraTrigger.style.visibility = 'hidden';
        zoraTrigger.style.pointerEvents = 'none';
    });

    zoraClose.addEventListener('click', (e) => {
        e.stopPropagation(); 
        zoraChatbot.classList.remove('active');
        zoraTrigger.style.visibility = 'visible';
        zoraTrigger.style.pointerEvents = 'auto';
    });

    function addMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-msg');
        msgDiv.classList.add(sender); 
        msgDiv.textContent = text;
        
        zoraBody.insertBefore(msgDiv, zoraLoading);
        zoraBody.scrollTop = zoraBody.scrollHeight;
    }

    function botResponse(input) {
        const text = input.toLowerCase();
        let reply = "Maaf, Zora belum dilatih untuk pertanyaan itu. Silakan hubungi Faiz lewat form 'Contact'.";

        if (text.includes("halo") || text.includes("hai") || text.includes("proyek") || text.includes("terbaik")) {
            reply = "Proyek terbaik Faiz di antaranya adalah AI Productivity & Automation Tool yang dibangun dengan FastAPI & SvelteKit, serta Medical CNN Classifier (akurasi 93%)!";
        } else if (text.includes("skill") || text.includes("kemampuan") || text.includes("utama")) {
            reply = "Faiz menguasai Web Backend (FastAPI, Node.js), Data Science & AI (Python, TensorFlow/CNN), serta IoT Hardware menggunakan ESP32.";
        } else if (text.includes("cv") || text.includes("resume") || text.includes("ats")) {
            reply = "Kamu bisa mengunduh ATS CV terbaru berformat PDF milik Faiz dengan menekan tombol 'Download CV' di navigasi bar atas.";
        } else if (text.includes("kontak") || text.includes("hubungi") || text.includes("cara")) {
            reply = "Kamu bisa menghubungi Faiz secara langsung lewat form di halaman 'Contact' atau klik langsung tombol EMAIL di sisi kiri bawah.";
        } else if (text.includes("hobi")) {
            reply = "Di luar coding, Faiz aktif sebagai drummer musik dan juga gemar bermain turnamen futsal bersama tim.";
        }

        zoraLoading.classList.remove('hidden');
        zoraBody.scrollTop = zoraBody.scrollHeight;

        setTimeout(() => {
            zoraLoading.classList.add('hidden');
            addMessage('bot', reply);
        }, 1500);
    }

    function handleSend() {
        const message = zoraInput.value.trim();
        if (message !== "") {
            addMessage('user', message);
            zoraInput.value = "";
            botResponse(message);
        }
    }

    zoraSend.addEventListener('click', handleSend);
    zoraInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    const chips = document.querySelectorAll('.suggestion-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            zoraInput.value = chip.textContent;
            handleSend();
        });
    });


    // ==========================================
    // 5. LOGIKA FILTER & MODAL PORTOFOLIO (FIXED)
    // ==========================================
    // 1. DATABASE PROYEK (ID disamakan persis dengan HTML)
    const projectsData = {
        "ai-tool": { 
            title: "Analisis Sentimen Roblox Web",
            images: ["../image/ai-roblox.jpg"], 
            desc: "Membangun model Natural Language Processing (NLP) untuk menganalisis sentimen dari ulasan aplikasi Roblox di Google Playstore secara otomatis.",
            github: "https://github.com/mfadilfaiz17"
        },
        "cnn-medis": { 
            title: "Klasifikasi Penyakit Ginjal (CNN)",
            images: ["../image/cnn.jpg"], 
            desc: "Mengembangkan model AI arsitektur CNN dengan 32 neuron konvolusi. Sistem ini digunakan untuk mengklasifikasikan penyakit ginjal berdasarkan citra hasil CT Scan dengan tingkat akurasi tinggi.",
            github: "https://github.com/mfadilfaiz17"
        },
        "robot-soccer": { 
            title: "Robot Soccer Controllers",
            images: ["../image/robot.jpg"], 
            desc: "Riset bersama tim UKM Robotika Polindra. Proyek ini membangun robot sepak bola tangkas menggunakan mikrokontroler ESP32 dan dikontrol melalui sistem nirkabel.",
            github: "https://github.com/mfadilfaiz17"
        },
        "jdm-car": { 
            title: "JDM Car Sell",
            images: ["../image/jdm.jpg"], 
            desc: "Membangun sistem otomotif untuk manajemen jual beli mobil Japanese Domestic Market (JDM) seperti Nissan Silvia S15, Skyline R34, dan Mazda RX-7.",
            github: "https://github.com/mfadilfaiz17"
        },
        "kalkulator-matrix": { 
            title: "Kalkulator Matrix Web",
            images: ["../image/kalkulator.jpg"], 
            desc: "Membuat antarmuka sistem web interaktif untuk melakukan operasi perhitungan matriks aljabar linear yang kompleks dengan mudah dan cepat.",
            github: "https://github.com/mfadilfaiz17i"
        },
        "summa-ai": { 
            title: "SummaAI",
            images: ["../image/summa.jpg"], 
            desc: "Website cerdas dengan fitur meringkas isi dokumen secara otomatis serta mengekstrak poin tindakan penting untuk kebutuhan produktivitas.",
            github: "https://github.com/m-fadil-faiz/summa-ai"
        }
    };

    // 2. LOGIKA TOMBOL FILTER (TERINTEGRASI PENUH DENGAN AOS SCROLL)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portCards = document.querySelectorAll('.port-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Ubah warna tombol aktif
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                portCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        // 1. Tampilkan kotak
                        card.style.display = 'flex';
                        card.style.pointerEvents = 'auto';
                        
                        // 2. KEMBALIKAN ATRIBUT AOS (Ini yang membuat animasi scroll bisa berulang)
                        card.setAttribute('data-aos', 'fade-up');
                        
                        // 3. Bersihkan sisa style paksaan agar AOS bebas bekerja
                        card.style.opacity = '';
                        card.style.transform = '';
                    } else {
                        // 1. Sembunyikan kotak
                        card.style.display = 'none';
                        card.style.pointerEvents = 'none';
                        
                        // 2. Cabut AOS untuk kotak yang hilang agar kalkulasi tinggi halaman tidak error
                        card.removeAttribute('data-aos');
                    }
                });

                // 4. REFRESH AOS: Memaksa AOS menghitung ulang kotak yang baru muncul 
                // Sehingga efek animasi 'fade-up' akan terpicu secara otomatis dengan smooth!
                setTimeout(() => {
                    if (typeof AOS !== 'undefined') {
                        AOS.refresh();
                    }
                }, 50);
            });
        });
    }

    // 3. LOGIKA POPUP MODAL & SLIDER
    const projectModal = document.getElementById('project-modal');
    
    if (projectModal) {
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalImg = document.getElementById('modal-image'); 
        const slideNext = document.getElementById('slider-next');
        const slidePrev = document.getElementById('slider-prev');
        const sliderCounter = document.getElementById('modal-slider-counter');
        const modalCloseBtn = document.getElementById('modal-close-btn');
        const modalGithub = document.getElementById('modal-github');
        const clickableCards = document.querySelectorAll('.clickable-card');

        let currentImages = [];
        let currentImageIndex = 0;

        function updateModalImage() {
            if (currentImages && currentImages.length > 0 && modalImg) {
                modalImg.src = currentImages[currentImageIndex];
                if (sliderCounter) {
                    sliderCounter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
                }
            }
        }

        // FIX: Blok kode tumpang tindih sudah dirapikan menjadi satu logika if-else yang bersih
        clickableCards.forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.getAttribute('data-project-id');
                const data = projectsData[projectId];

                if (data) {
                    if (modalTitle) modalTitle.textContent = data.title;
                    if (modalDesc) modalDesc.textContent = data.desc;
                    currentImages = data.images || [];
                    
                    // Logika tombol GitHub
                    if (modalGithub) {
                        if (data.github && data.github !== "#") {
                            modalGithub.style.display = "inline-block";
                            modalGithub.href = data.github;
                        } else {
                            modalGithub.style.display = "none";
                        }
                    }
                } else {
                    if (modalTitle) modalTitle.textContent = card.querySelector('h3').textContent;
                    if (modalDesc) modalDesc.textContent = card.querySelector('p').textContent;
                    currentImages = [card.querySelector('img').src];
                    
                    // Sembunyikan tombol GitHub jika tidak ada data dari JS
                    if (modalGithub) {
                        modalGithub.style.display = "none";
                    }
                }

                currentImageIndex = 0; 
                updateModalImage();

                if (currentImages.length <= 1) {
                    if (slideNext) slideNext.style.display = 'none';
                    if (slidePrev) slidePrev.style.display = 'none';
                } else {
                    if (slideNext) slideNext.style.display = 'block';
                    if (slidePrev) slidePrev.style.display = 'block';
                }

                projectModal.classList.remove('hidden');
            });
        });

        if (slideNext) {
            slideNext.addEventListener('click', () => {
                currentImageIndex++;
                if (currentImageIndex >= currentImages.length) currentImageIndex = 0; 
                updateModalImage();
            });
        }

        if (slidePrev) {
            slidePrev.addEventListener('click', () => {
                currentImageIndex--;
                if (currentImageIndex < 0) currentImageIndex = currentImages.length - 1; 
                updateModalImage();
            });
        }

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                projectModal.classList.add('hidden');
            });
        }

        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.classList.add('hidden');
            }
        });
    }

    // ==========================================
    // 6. LOGIKA SEE MORE CERTIFICATES (ANIMASI SMOOTH MODAL)
    // ==========================================
    const btnCertMore = document.getElementById('btn-cert-more');
    const certModal = document.getElementById('cert-modal');
    const certModalClose = document.getElementById('cert-modal-close');

    if (btnCertMore && certModal && certModalClose) {
        btnCertMore.addEventListener('click', () => {
            certModal.classList.add('active'); 
            document.body.style.overflow = 'hidden'; 
        });

        certModalClose.addEventListener('click', () => {
            certModal.classList.remove('active'); 
            document.body.style.overflow = 'auto'; 
        });

        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) {
                certModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ==========================================
    // 7. LOGIKA GANTI BAHASA LENGKAP (EN / ID)
    // ==========================================
    const translations = {
        "en": {
            // Navbar
            "nav_home": "Home", "nav_about": "About", "nav_portfolio": "Portfolio", 
            "nav_certificates": "Certificates", "nav_contact": "Contact", "nav_download": "Download CV",
            "switch_btn": "[ EN ] / ID",
            
            // Hero
            "hero_build": "BUILD WITH", "hero_intelligent": "INTELLIGENT", "hero_experience": "EXPERIENCE",
            "hero_sub": "Digital solutions for the next era.",
            "hero_role": "AI & Junior Fullstack Developer",
            "hero_greeting": "Hi, I'm",
            "hero_desc": "Crafting reliable web applications powered by practical AI integrations. Dedicated to writing clean code, solving real-world problems, and continuously growing as an engineer.",
            
            // About
            "about_title_1": "About", "about_title_2": "Me",
            "about_p1": "I am a Computer Engineering Technology student at Indramayu State Polytechnic, deeply invested in software engineering and practical Artificial Intelligence. My academic foundation aligns closely with my technical expertise, allowing me to build robust backend architectures and research robotics.",
            "about_p2": "My primary focus lies in developing full-stack web applications that serve as interactive environments to deploy and test intelligent machine learning models, creating smarter user experiences.",
            
            // Portfolio & Modal
            "port_title": "Portfolio", "filter_all": "All", "filter_others": "Others (Activities)",
            "port_1_title": "Roblox Web Sentiment Analysis", "port_1_desc": "Building a Natural Language Processing model for sentiment analysis of Roblox app reviews on Playstore.",
            "port_2_title": "Kidney Disease Classification (CNN)", "port_2_desc": "Developing an AI CNN architecture model with 32 convolution neurons to classify kidney diseases based on CT SCAN results.",
            "port_3_title": "Robot Soccer Controllers", "port_3_desc": "RPI Robotics Team research, building a soccer robot using ESP32 microcontroller.",
            "port_4_title": "JDM Car Sell", "port_4_desc": "Building an automotive system for buying and selling Japanese Domestic Market (JDM) cars.",
            "port_5_title": "Web Matrix Calculator", "port_5_desc": "Creating an interactive matrix calculation system built into a calculator interface.",
            "port_6_title": "SummaAI", "port_6_desc": "A smart website with an automatic document summarization and action item extraction system.",
            "modal_github": "View on GitHub",
            
            // Certificates
            "cert_title_1": "Certificates & ", "cert_title_2": "Achievements",
            "cert_all": "ALL", "cert_view": "View Gallery", "modal_cert_title": "All Certificates",
            
            // Contact
            "contact_title_1": "COLLAB FOR", "contact_title_2": "PROJECT?", "contact_title_3": "SAY HI!",
            "contact_desc": "Whether you have a specific idea or just want to explore possibilities, my inbox is always open for bold innovations.",
            "contact_label_name": "FULL NAME", "contact_label_email": "EMAIL ADDRESS", "contact_label_brief": "THE BRIEF",
            "contact_ph_name": "YOUR NAME", "contact_ph_email": "YOUR EMAIL", "contact_ph_brief": "WHAT'S ON YOUR MIND?",
            "contact_btn": "SEND MESSAGE",
            
            // Footer
            "footer_terms": "Terms of Use", "footer_privacy": "Privacy Policy", "footer_copy": "© 2026 Faiz. All rights reserved.",
            
            // Zora Chatbot
            "zora_trigger": "Zora Agent", "zora_header": "Zora (AI Agent)",
            "zora_msg_1": "Hello! I'm Zora. How can I help you with Faiz's CV, ML/DL skills, or portfolio?",
            "zora_sug_1": "Best projects?", "zora_sug_2": "How to contact?", "zora_sug_3": "Core skills?", 
            "zora_sug_4": "Faiz's hobbies?", "zora_sug_5": "Download ATS CV?",
            "zora_ph": "Type a question..."
        },
        "id": {
            // Navbar
            "nav_home": "Beranda", "nav_about": "Tentang", "nav_portfolio": "Portofolio", 
            "nav_certificates": "Sertifikat", "nav_contact": "Kontak", "nav_download": "Unduh CV",
            "switch_btn": "EN / [ ID ]",
            
            // Hero
            "hero_build": "BANGUN DENGAN", "hero_intelligent": "PENGALAMAN", "hero_experience": "CERDAS",
            "hero_sub": "Solusi digital untuk era berikutnya.",
            "hero_role": "AI & Junior Fullstack Developer",
            "hero_greeting": "Hai, Saya",
            "hero_desc": "Menciptakan aplikasi web andal yang didukung oleh integrasi AI praktis. Berdedikasi untuk menulis kode yang bersih, memecahkan masalah dunia nyata, dan terus berkembang sebagai engineer.",
            
            // About
            "about_title_1": "Tentang", "about_title_2": "Saya",
            "about_p1": "Saya adalah mahasiswa Teknologi Rekayasa Komputer di Politeknik Negeri Indramayu, sangat tertarik dengan rekayasa perangkat lunak dan Kecerdasan Buatan terapan. Landasan akademis saya sejalan dengan keahlian teknis saya, memungkinkan saya membangun arsitektur backend yang kuat dan melakukan riset robotika.",
            "about_p2": "Fokus utama saya terletak pada pengembangan aplikasi web full-stack yang berfungsi sebagai lingkungan interaktif untuk menerapkan dan menguji model machine learning cerdas, guna menciptakan pengalaman pengguna yang lebih cerdas.",
            
            // Portfolio & Modal
            "port_title": "Portofolio", "filter_all": "Semua", "filter_others": "Lainnya (Aktivitas)",
            "port_1_title": "Analisis Sentimen Roblox Web", "port_1_desc": "Membangun model Natural Language Processing untuk analisis sentimen penilaian aplikasi Roblox pada Playstore.",
            "port_2_title": "Klasifikasi Penyakit Ginjal (CNN)", "port_2_desc": "Mengembangkan model AI arsitektur CNN dengan 32 neuron konvolusi untuk klasifikasi penyakit ginjal berdasarkan hasil CT SCAN.",
            "port_3_title": "Kontroler Robot Soccer", "port_3_desc": "Riset Tim Robotika RPI, membangun robot sepak bola menggunakan mikrokontroler ESP32.",
            "port_4_title": "Jual Beli Mobil JDM", "port_4_desc": "Membangun sistem otomotif jual beli mobil Japanese Domestic Market (JDM).",
            "port_5_title": "Kalkulator Matriks Web", "port_5_desc": "Membuat sistem perhitungan matriks yang diintegrasikan pada antarmuka kalkulator.",
            "port_6_title": "SummaAI", "port_6_desc": "Website cerdas dengan sistem peringkas isi dokumen secara otomatis serta penarikan poin tindakan.",
            "modal_github": "Lihat di GitHub",
            
            // Certificates
            "cert_title_1": "Sertifikat & ", "cert_title_2": "Pencapaian",
            "cert_all": "SEMUA", "cert_view": "Lihat Galeri", "modal_cert_title": "Semua Sertifikat",
            
            // Contact
            "contact_title_1": "KOLABORASI", "contact_title_2": "PROYEK?", "contact_title_3": "SAPA SAYA!",
            "contact_desc": "Baik kamu memiliki ide spesifik atau sekadar ingin menjajaki kemungkinan, kotak masuk saya selalu terbuka untuk inovasi baru.",
            "contact_label_name": "NAMA LENGKAP", "contact_label_email": "ALAMAT EMAIL", "contact_label_brief": "PESAN / IDE",
            "contact_ph_name": "NAMA KAMU", "contact_ph_email": "EMAIL KAMU", "contact_ph_brief": "APA YANG ADA DI PIKIRANMU?",
            "contact_btn": "KIRIM PESAN",
            
            // Footer
            "footer_terms": "Syarat Penggunaan", "footer_privacy": "Kebijakan Privasi", "footer_copy": "© 2026 Faiz. Hak cipta dilindungi.",
            
            // Zora Chatbot
            "zora_trigger": "Agen Zora", "zora_header": "Zora (Agen AI)",
            "zora_msg_1": "Halo! Saya Zora. Ada yang bisa saya bantu terkait CV, keahlian ML/DL, atau portofolio Faiz?",
            "zora_sug_1": "Proyek terbaik?", "zora_sug_2": "Cara kontak?", "zora_sug_3": "Keahlian utama?", 
            "zora_sug_4": "Hobi Faiz?", "zora_sug_5": "Unduh CV ATS?",
            "zora_ph": "Ketik pertanyaan..."
        }
    };
    
    let currentLang = localStorage.getItem('website_lang') || 'en';
    const langSwitchBtn = document.getElementById('lang-switch');

    function applyLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[lang][key]) {
                element.setAttribute('placeholder', translations[lang][key]);
            }
        });

        if (langSwitchBtn) {
            if (lang === 'id') {
                langSwitchBtn.classList.add('active-id'); 
            } else {
                langSwitchBtn.classList.remove('active-id');
            }
        }
    }

    if (langSwitchBtn) {
        applyLanguage(currentLang);

        langSwitchBtn.addEventListener('click', () => {
            currentLang = (currentLang === 'en') ? 'id' : 'en';
            localStorage.setItem('website_lang', currentLang);
            applyLanguage(currentLang);
        });
    }

});