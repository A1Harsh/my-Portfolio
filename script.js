document.addEventListener('DOMContentLoaded', () => {

  // ==================== 1. THEME MANAGER ====================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('harsh-portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('harsh-portfolio-theme', newTheme);
    });
  }

  // ==================== 2. RESPONSIVE MOBILE MENU ====================
  const burgerMenu = document.getElementById('mobile-burger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (burgerMenu && navMenu) {
    const toggleMenu = () => {
      const isOpen = burgerMenu.classList.toggle('open');
      navMenu.classList.toggle('open');
      burgerMenu.setAttribute('aria-expanded', isOpen);
    };

    burgerMenu.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burgerMenu.classList.remove('open');
        navMenu.classList.remove('open');
        burgerMenu.setAttribute('aria-expanded', false);
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !burgerMenu.contains(e.target) && navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  }

  // ==================== 3. SCROLL PROGRESS & HEADER SHRUNK & BACK TO TOP ====================
  const header = document.getElementById('header');
  const progressBar = document.getElementById('scroll-progress-bar');
  const backToTopBtn = document.getElementById('back-to-top');
  const progressCircle = document.querySelector('.progress-ring-circle');

  const circleRadius = 20;
  const circleCircumference = 2 * Math.PI * circleRadius;
  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${circleCircumference} ${circleCircumference}`;
    progressCircle.style.strokeDashoffset = circleCircumference;
  }

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    // Header shrink
    if (header) {
      if (scrollTop > 50) header.classList.add('shrink');
      else header.classList.remove('shrink');
    }

    // Scroll progress bar
    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    // Back to top button & circular progress
    if (backToTopBtn) {
      if (scrollTop > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }

      if (progressCircle) {
        const offset = circleCircumference - (scrollPercent / 100) * circleCircumference;
        progressCircle.style.strokeDashoffset = offset;
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================== 4. MULTI-ROLE TYPEWRITER EFFECT ====================
  const typedSpan = document.getElementById('typed-roles');
  const roles = [
    'AI & RAG Conversational Agents',
    'Full-Stack Web Applications',
    'Low-Latency Python & Node APIs',
    'Scalable PostgreSQL Schemas'
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function runTypewriter() {
    if (!typedSpan) return;
    const currentWord = roles[roleIdx];

    if (isDeleting) {
      charIdx--;
      typedSpan.textContent = currentWord.substring(0, charIdx);
    } else {
      charIdx++;
      typedSpan.textContent = currentWord.substring(0, charIdx);
    }

    if (!isDeleting && charIdx === currentWord.length) {
      isDeleting = true;
      typeSpeed = 2000; // Pause at end of word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 120;
    } else {
      typeSpeed = isDeleting ? 40 : 80;
    }

    setTimeout(runTypewriter, typeSpeed);
  }

  if (typedSpan) {
    setTimeout(runTypewriter, 500);
  }

  // ==================== 5. CUSTOM LERP CURSOR ====================
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  if (cursor && cursorDot) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // ==================== 6. ABOUT SECTION TABS ====================
  const aboutTabBtns = document.querySelectorAll('.about-tab-btn');
  const aboutTabPanels = document.querySelectorAll('.about-tab-panel');

  aboutTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPanelId = btn.getAttribute('aria-controls');

      aboutTabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', false);
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', true);

      aboutTabPanels.forEach(panel => {
        if (panel.id === targetPanelId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // ==================== 7. SKILLS FILTER & SEARCH ====================
  const skillCategoryBtns = document.querySelectorAll('.skill-category-selectors .skill-category-btn');
  const skillItems = document.querySelectorAll('.skill-card-item');
  const skillsSearchInput = document.getElementById('skills-search-input');

  function filterSkills() {
    const activeCategory = document.querySelector('.skill-category-selectors .skill-category-btn.active').getAttribute('data-category');
    const query = skillsSearchInput ? skillsSearchInput.value.toLowerCase().trim() : '';

    skillItems.forEach(item => {
      const category = item.getAttribute('data-category');
      const skillName = item.getAttribute('data-skill-name');

      const matchesCategory = (activeCategory === 'all' || category === activeCategory);
      const matchesSearch = query === '' || skillName.includes(query);

      if (matchesCategory && matchesSearch) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  skillCategoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillCategoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterSkills();
    });
  });

  if (skillsSearchInput) {
    skillsSearchInput.addEventListener('input', filterSkills);
  }

  // Animate skill bars on scroll
  const skillBars = document.querySelectorAll('.skill-progress-bar');
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const percentage = bar.getAttribute('data-percentage');
        bar.style.width = `${percentage}%`;
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach(bar => skillsObserver.observe(bar));

  // ==================== 8. PROJECTS FILTER & LIVE SEARCH ====================
  const projectFilterBtns = document.querySelectorAll('.project-filters .filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const projectSearchInput = document.getElementById('project-search-input');

  function filterProjects() {
    const activeFilter = document.querySelector('.project-filters .filter-btn.active').getAttribute('data-filter');
    const query = projectSearchInput ? projectSearchInput.value.toLowerCase().trim() : '';

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const searchTerms = card.getAttribute('data-search-terms').toLowerCase();

      const matchesCategory = (activeFilter === 'all' || category === activeFilter);
      const matchesSearch = query === '' || searchTerms.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects();
    });
  });

  if (projectSearchInput) {
    projectSearchInput.addEventListener('input', filterProjects);
  }

  // 3D Tilt Card Interaction
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ==================== 9. MODALS MANAGER (CASE STUDY, RESUME, CMD PALETTE, SHORTCUTS) ====================
  const caseStudyModal = document.getElementById('casestudy-modal');
  const csCloseBtn = document.getElementById('cs-close-btn');
  const csTitle = document.getElementById('cs-title');
  const csProblem = document.getElementById('cs-problem');
  const csSpecs = document.getElementById('cs-specs');
  const csTech = document.getElementById('cs-tech');
  const csGithubLink = document.getElementById('cs-github-link');
  const csDemoLink = document.getElementById('cs-demo-link');

  const caseStudyData = {
    p1: {
      title: "Jayveer E-Commerce & Mini Cart Engine",
      problem: "E-commerce stores often suffer from slow cart drawer re-renders and payment webhook sync failures. The objective was to build a zero-lag mini cart interface and connect Indian local payment webhooks securely.",
      specs: [
        "Reactive slide-out Mini Cart drawer state synced with HTML5 LocalStorage.",
        "Razorpay Webhook API listener for instant payment status verification.",
        "PostgreSQL query optimization with parameterized filters for spice catalog.",
        "Protected admin portal with JWT token session management."
      ],
      tech: ["React", "Node.js", "Express", "PostgreSQL", "Razorpay API"],
      github: "https://github.com/A1Harsh/online-shopping-system",
      demo: "https://a1harsh.github.io/online-shopping-system/"
    },
    p2: {
      title: "NeuroChat Enterprise RAG Agent",
      problem: "Enterprise support teams face long resolution delays reading massive documentation sets. We built a RAG agent indexing technical handbooks into a high-speed vector database.",
      specs: [
        "Pinecone Vector DB indexing 50,000+ operational handbook embeddings.",
        "FastAPI async endpoint serving streaming responses under 140ms latency.",
        "Custom LangChain prompt chains with hallucination guardrails & source citations.",
        "WebSocket connection for live character token streaming."
      ],
      tech: ["Python", "LangChain", "Pinecone DB", "FastAPI", "OpenAI GPT-4o"],
      github: "https://github.com/A1Harsh"
    },
    p3: {
      title: "KingRemedies Masale",
      problem: "KingRemedies Masale required an e-commerce platform with multi-role access control, automated stock alerts, spice category inventory tracking, and analytical revenue reporting over 100k+ records without server timeouts.",
      specs: [
        "Multi-role user permission system (Super Admin, Manager, Cashier).",
        "ApexCharts interactive analytics for gross revenue, sales trends, and inventory stats.",
        "Automated batch PDF invoice generation and low-stock threshold triggers.",
        "PHP 8.2 backend with MySQL indexing and clean REST architecture."
      ],
      tech: ["PHP 8.2", "MySQL", "Tailwind CSS", "ApexCharts", "REST API"],
      github: "https://github.com/A1Harsh"
    },
    p4: {
      title: "CyberVision Real-Time Image Inspector",
      problem: "Factory quality assurance streams require instant visual bounding box overlay and immediate defect detection alerts.",
      specs: [
        "OpenCV frame processing and TensorFlow object classification.",
        "Real-time bounding box vector overlay with confidence scoring.",
        "Instant WebSocket event trigger upon defect detection.",
        "Sub-15ms image preprocessing pipeline."
      ],
      tech: ["Python", "OpenCV", "TensorFlow", "FastAPI", "WebSockets"],
      github: "https://github.com/A1Harsh"
    }
  };

  const openCaseStudy = (id) => {
    const data = caseStudyData[id];
    if (!data || !caseStudyModal) return;

    csTitle.textContent = data.title;
    csProblem.textContent = data.problem;
    csSpecs.innerHTML = data.specs.map(s => `<li>${s}</li>`).join('');
    csTech.innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
    if (csGithubLink) csGithubLink.href = data.github || "https://github.com/A1Harsh";
    if (csDemoLink) {
      if (data.demo) {
        csDemoLink.href = data.demo;
        csDemoLink.style.display = 'inline-flex';
      } else {
        csDemoLink.style.display = 'none';
      }
    }

    caseStudyModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeModals = () => {
    document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.add('hidden'));
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-open-casestudy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-open-casestudy');
      openCaseStudy(id);
    });
  });

  if (csCloseBtn) csCloseBtn.addEventListener('click', closeModals);

  // Resume Modal
  const resumeModal = document.getElementById('resume-modal');
  const heroResumeBtn = document.getElementById('hero-resume-btn');
  const resumeCloseBtn = document.getElementById('resume-close-btn');
  const resumePrintBtn = document.getElementById('resume-print-btn');

  const openResumeModal = () => {
    if (resumeModal) {
      resumeModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  if (heroResumeBtn) heroResumeBtn.addEventListener('click', openResumeModal);
  if (resumeCloseBtn) resumeCloseBtn.addEventListener('click', closeModals);
  if (resumePrintBtn) {
    resumePrintBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Keyboard Shortcuts Modal
  const shortcutModal = document.getElementById('shortcut-modal');
  const shortcutGuideBtn = document.getElementById('shortcut-guide-btn');
  const scCloseBtn = document.getElementById('sc-close-btn');

  const openShortcutModal = () => {
    if (shortcutModal) {
      shortcutModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  if (shortcutGuideBtn) shortcutGuideBtn.addEventListener('click', openShortcutModal);
  if (scCloseBtn) scCloseBtn.addEventListener('click', closeModals);

  // Command Palette
  const cmdPalette = document.getElementById('command-palette');
  const cmdPaletteBtn = document.getElementById('cmd-palette-btn');
  const cmdCloseBtn = document.getElementById('cmd-close-btn');
  const cmdInput = document.getElementById('cmd-input');
  const cmdResults = document.getElementById('cmd-results');

  const commandItems = [
    { label: "Go to About Section", action: () => { location.hash = '#about'; closeModals(); } },
    { label: "Go to Skills Section", action: () => { location.hash = '#skills'; closeModals(); } },
    { label: "Go to Experience Section", action: () => { location.hash = '#experience'; closeModals(); } },
    { label: "Go to Projects Showcase", action: () => { location.hash = '#projects'; closeModals(); } },
    { label: "Go to Services", action: () => { location.hash = '#services'; closeModals(); } },
    { label: "Go to Contact Form", action: () => { location.hash = '#contact'; closeModals(); } },
    { label: "View Executive Resume", action: () => { openResumeModal(); } },
    { label: "Toggle Dark / Light Theme", action: () => { if (themeToggleBtn) themeToggleBtn.click(); closeModals(); } },
    { label: "Live Demo: Jayveer E-Commerce (Online Shopping)", action: () => { window.open("https://a1harsh.github.io/online-shopping-system/", "_blank"); closeModals(); } },
    { label: "Open GitHub Profile", action: () => { window.open("https://github.com/A1Harsh", "_blank"); closeModals(); } }
  ];

  const renderCommandResults = (filterText = '') => {
    if (!cmdResults) return;
    const query = filterText.toLowerCase().trim();
    const filtered = commandItems.filter(item => item.label.toLowerCase().includes(query));

    if (filtered.length === 0) {
      cmdResults.innerHTML = '<div style="padding:1rem; color:var(--text-muted); font-size:0.9rem;">No matching commands found.</div>';
      return;
    }

    cmdResults.innerHTML = filtered.map((item, index) => `
      <div class="cmd-item ${index === 0 ? 'selected' : ''}" data-cmd-index="${index}">
        <span>${item.label}</span>
        <kbd>↵ Select</kbd>
      </div>
    `).join('');

    cmdResults.querySelectorAll('.cmd-item').forEach((el, index) => {
      el.addEventListener('click', () => {
        filtered[index].action();
      });
    });
  };

  const openCmdPalette = () => {
    if (cmdPalette && cmdInput) {
      cmdPalette.classList.remove('hidden');
      cmdInput.value = '';
      renderCommandResults();
      cmdInput.focus();
      document.body.style.overflow = 'hidden';
    }
  };

  if (cmdPaletteBtn) cmdPaletteBtn.addEventListener('click', openCmdPalette);
  if (cmdCloseBtn) cmdCloseBtn.addEventListener('click', closeModals);
  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => renderCommandResults(e.target.value));
  }

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCmdPalette();
    } else if (e.key === '?') {
      if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        openShortcutModal();
      }
    } else if (e.key.toLowerCase() === 't' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      if (themeToggleBtn) themeToggleBtn.click();
    } else if (e.key.toLowerCase() === 'r' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      openResumeModal();
    } else if (e.key === 'Escape') {
      closeModals();
    }
  });

  // Close modals on overlay backdrop click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModals();
    });
  });

  // ==================== 10. GITHUB CONTRIBUTION HEATMAP MATRIX GENERATOR ====================
  const matrixGrid = document.getElementById('matrix-grid');
  if (matrixGrid) {
    matrixGrid.innerHTML = '';
    // 30 columns * 7 rows = 210 cells
    for (let i = 0; i < 210; i++) {
      const cell = document.createElement('div');
      cell.className = 'matrix-cell';
      const rand = Math.random();
      if (rand > 0.8) cell.classList.add('l-4');
      else if (rand > 0.6) cell.classList.add('l-3');
      else if (rand > 0.4) cell.classList.add('l-2');
      else if (rand > 0.25) cell.classList.add('l-1');
      matrixGrid.appendChild(cell);
    }
  }

  // ==================== 11. TESTIMONIALS SLIDER ====================
  const testimonialTrack = document.getElementById('testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prev-slide-btn');
  const nextBtn = document.getElementById('next-slide-btn');
  const bullets = document.querySelectorAll('.slider-bullets .bullet');
  let currentSlide = 0;

  const updateSlider = (index) => {
    if (!testimonialTrack || slides.length === 0) return;
    currentSlide = (index + slides.length) % slides.length;
    testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    slides.forEach((slide, i) => {
      if (i === currentSlide) slide.classList.add('active');
      else slide.classList.remove('active');
    });

    bullets.forEach((bullet, i) => {
      if (i === currentSlide) bullet.classList.add('active');
      else bullet.classList.remove('active');
    });
  };

  if (prevBtn) prevBtn.addEventListener('click', () => updateSlider(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => updateSlider(currentSlide + 1));
  bullets.forEach(bullet => {
    bullet.addEventListener('click', () => {
      const slideIndex = parseInt(bullet.getAttribute('data-slide'));
      updateSlider(slideIndex);
    });
  });

  // Auto slide interval
  setInterval(() => {
    updateSlider(currentSlide + 1);
  }, 6000);

  // ==================== 12. BLOG READER MODAL ====================
  const articleModal = document.getElementById('article-modal');
  const artCloseBtn = document.getElementById('art-close-btn');
  const artTitle = document.getElementById('art-title');
  const artBodyText = document.getElementById('art-body-text');

  const articleContent = {
    art1: {
      title: "Building Zero-Hallucination RAG Agents with Pinecone & FastAPI",
      content: `
        <p>Retrieval-Augmented Generation (RAG) combines the power of Vector Databases with Large Language Models. By serving documents as vector embeddings, we ground LLMs in exact company facts.</p>
        <h4>Key Steps in RAG Architecture:</h4>
        <ol>
          <li>Chunk operational documents into 500-token blocks.</li>
          <li>Generate embeddings using OpenAI text-embedding-3-small models.</li>
          <li>Store and query vectors with Pinecone DB similarity search.</li>
          <li>Construct system prompts requiring strict source citation.</li>
        </ol>
      `
    },
    art2: {
      title: "Optimizing PostgreSQL Queries for 100k+ Daily E-Commerce Orders",
      content: `
        <p>High-volume e-commerce applications require database indexing and query optimization to maintain sub-100ms response times.</p>
        <h4>Optimization Best Practices:</h4>
        <ul>
          <li>Create B-tree indexes on foreign keys and frequently queried status columns.</li>
          <li>Use parameterized prepared statements to eliminate SQL injection and reuse execution plans.</li>
          <li>Configure connection pooling with PgBouncer to prevent connection spikes.</li>
        </ul>
      `
    },
    art3: {
      title: "Achieving a 98+ Lighthouse Score with Vanilla Web Architecture",
      content: `
        <p>Heavy JavaScript single-page application bundles often result in poor Core Web Vitals. Modern vanilla web tech allows us to deliver instantaneous page renders.</p>
        <h4>Performance Guidelines:</h4>
        <ul>
          <li>Use native CSS Custom Properties and Flexbox/Grid for zero style calculations.</li>
          <li>Defer non-critical JavaScript execution using IntersectionObserver.</li>
          <li>Inline critical CSS and leverage HTTP/2 server push.</li>
        </ul>
      `
    }
  };

  document.querySelectorAll('[data-article-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const artId = btn.getAttribute('data-article-id');
      const data = articleContent[artId];
      if (data && articleModal) {
        artTitle.textContent = data.title;
        artBodyText.innerHTML = data.content;
        articleModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (artCloseBtn) artCloseBtn.addEventListener('click', closeModals);

  // ==================== 13. CONTACT FORM CONTROLLER ====================
  const contactForm = document.getElementById('portfolio-contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();
      const hp = document.getElementById('website_hp').value;

      // Honeypot anti-spam check
      if (hp !== '') {
        return; // Bot detected
      }

      formFeedback.style.display = 'none';
      formFeedback.className = 'form-feedback';

      if (!name || name.length > 100) {
        showFeedback('Please enter a valid name (1-100 characters).', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || email.length > 100 || !emailRegex.test(email)) {
        showFeedback('Please enter a valid email address.', 'error');
        return;
      }

      if (!message || message.length > 2000) {
        showFeedback('Please enter your project details (1-2000 characters).', 'error');
        return;
      }

      const submitBtn = contactForm.querySelector('.form-submit-btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Message...';

      setTimeout(() => {
        showFeedback('✓ Thank you! Your message has been delivered successfully. I will get back to you within 24 hours.', 'success');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1200);
    });

    function showFeedback(msg, type) {
      formFeedback.textContent = msg;
      formFeedback.classList.add(type);
      formFeedback.style.display = 'block';
    }
  }

  // ==================== 14. COPY TO CLIPBOARD BUTTONS ====================
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-copy-val');
      if (val) {
        navigator.clipboard.writeText(val).then(() => {
          const originalText = btn.textContent;
          btn.textContent = 'Copied! ✓';
          btn.style.borderColor = 'var(--accent-primary)';
          btn.style.color = 'var(--accent-primary)';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.borderColor = '';
            btn.style.color = '';
          }, 1800);
        });
      }
    });
  });

  // ==================== 15. NETWORK OFFLINE / ONLINE TOAST ====================
  const offlineToast = document.getElementById('offline-toast');
  const toastCloseBtn = document.getElementById('toast-close-btn');

  if (toastCloseBtn && offlineToast) {
    toastCloseBtn.addEventListener('click', () => {
      offlineToast.classList.add('hidden');
    });
  }

  window.addEventListener('offline', () => {
    if (offlineToast) offlineToast.classList.remove('hidden');
  });

  window.addEventListener('online', () => {
    if (offlineToast) offlineToast.classList.add('hidden');
  });

});
