document.addEventListener('DOMContentLoaded', () => {
  // === THEME MANAGER ===
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('harsh-portfolio-theme') || 'dark';
  
  // Set theme base attribute
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('harsh-portfolio-theme', newTheme);
    });
  }

  // === RESPONSIVE MOBILE MENU ===
  const burgerMenu = document.getElementById('mobile-burger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (burgerMenu && navMenu) {
    const toggleMenu = () => {
      burgerMenu.classList.toggle('open');
      navMenu.classList.toggle('open');
    };

    burgerMenu.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burgerMenu.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });

    // Close menu when clicked outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !burgerMenu.contains(e.target) && navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  }

  // === HEADER SCROLL SHRUNK EFFECT ===
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('shrink');
    } else {
      header.classList.remove('shrink');
    }
  });

  // === TYPEWRITER ANIMATION ===
  const typedSpan = document.querySelector('.typing-container span');
  const roles = ['AI Integration Expert', 'Full-Stack Developer', 'Chatbot & Agent Creator', 'UI/UX Visual Architect'];
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 100;
  let currentWord = roles[roleIdx];

  function runWriter() {
    isDeleting ? charIdx-- : charIdx++;
    typedSpan.textContent = currentWord.substring(0, charIdx);

    if (!isDeleting && charIdx === currentWord.length) {
      isDeleting = true;
      typeSpeed = 2200; // Pause at full word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      currentWord = roles[roleIdx];
      typeSpeed = 120; // Pause before typing next
    } else {
      typeSpeed = isDeleting ? 40 : 80;
    }

    setTimeout(runWriter, typeSpeed);
  }

  if (typedSpan) {
    setTimeout(runWriter, 800);
  }

  // === INTERSECTION OBSERVER: SCROLL REVEALS & PASSIVE LINKS & SKILL BARS ===
  const reveals = document.querySelectorAll('.revealer');
  const skillBarFills = document.querySelectorAll('.skill-bar-fill');
  
  // Custom scroll reveal
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // If skill bars reveal matches, activate width animations
        if (entry.target.id === 'skills') {
          animateSkillBars();
        }
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(rev => sectionObserver.observe(rev));

  function animateSkillBars() {
    skillBarFills.forEach(bar => {
      const percentage = bar.getAttribute('data-percentage');
      bar.style.width = `${percentage}%`;
    });
  }

  // Active section indicator in Nav
  const sections = document.querySelectorAll('section[id]');
  const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.45, rootMargin: '-80px 0px -40% 0px' });

  sections.forEach(sec => activeLinkObserver.observe(sec));

  // === SKILL CATEGORY SHOWCASE PICKER ===
  const skillCategoryButtons = document.querySelectorAll('.skill-category-btn');
  const skillGroups = document.querySelectorAll('.skills-content-group');

  skillCategoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.getAttribute('data-category');
      
      // Toggle button states
      skillCategoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Toggle displayed skill group tabs
      skillGroups.forEach(group => {
        if (group.getAttribute('id') === `group-${targetCategory}`) {
          group.classList.add('active');
          // Animate newly active panel's fills
          const fills = group.querySelectorAll('.skill-bar-fill');
          fills.forEach(fill => {
            const percentage = fill.getAttribute('data-percentage');
            // Reset and trigger redraw to animate again
            fill.style.width = '0';
            setTimeout(() => fill.style.width = `${percentage}%`, 50);
          });
        } else {
          group.classList.remove('active');
        }
      });
    });
  });

  // === PORTFOLIO PROJECTS CATEGORY FILTER & INTERACTION ===
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');
      
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.style.transition = 'opacity 0.4s var(--ease-sq), transform 0.4s var(--ease-sq)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // === PROJECT CARDS SPOTLIGHT & 3D TILT EFFECT ===
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // === ARCHITECTURE BLUEPRINT MODAL CONTROLLER ===
  const archModal = document.getElementById('architecture-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalBadge = document.getElementById('modal-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalSpecsList = document.getElementById('modal-specs-list');
  const modalTechStack = document.getElementById('modal-tech-stack');
  const modalGithubLink = document.getElementById('modal-github-link');

  const projectDetails = {
    p1: {
      title: "Shree Ganesh E-Commerce & Mini Cart Engine",
      badge: "● LIVE STORE",
      badgeClass: "badge-live",
      desc: "Built as a high-speed production spice platform capable of handling localized payment webhooks, customer cart state synchronization, and scalable checkout procedures.",
      specs: [
        "Reactive slide-out Mini Cart drawer synchronized with HTML5 LocalStorage.",
        "Razorpay Webhook API endpoint integration for automated order status confirmation.",
        "PostgreSQL query optimization with parameterized filters for spice categories.",
        "Protected Admin portal with JWT token session management."
      ],
      tech: ["React", "NodeJS", "Express", "PostgreSQL", "Razorpay API", "JWT"],
      github: "https://github.com/harshsathvara134-cpu"
    },
    p2: {
      title: "NeuroChat Enterprise RAG Agent",
      badge: "⚡ RAG PIPELINE ACTIVE",
      badgeClass: "badge-ai",
      desc: "An intelligent Retrieval-Augmented Generation agent system designed for enterprise operational documentation querying and automated ticket resolution.",
      specs: [
        "Pinecone Vector Database indexing 50,000+ operational handbook embeddings.",
        "FastAPI async pipeline serving streaming responses under 150ms latency.",
        "Custom LangChain prompt chains with hallucination guardrails & source citations.",
        "WebSocket connection for live character token streaming."
      ],
      tech: ["Python", "LangChain", "Pinecone DB", "FastAPI", "OpenAI GPT-4o"],
      github: "https://github.com/harshsathvara134-cpu"
    },
    p3: {
      title: "KingRemedies Admin & Analytics Hub",
      badge: "🔐 SECURE SAAS",
      badgeClass: "badge-sec",
      desc: "Comprehensive SaaS management system for medical/retail inventory, category tracking, user permissions, and analytics.",
      specs: [
        "Multi-role user permission system (Super Admin, Inventory Manager, Cashier).",
        "ApexCharts interactive analytics for gross revenue, sales trends, and category distribution.",
        "Automated batch PDF invoice generation and stock threshold alert triggers.",
        "PHP 8.2 backend with MySQL indexing and clean REST architecture."
      ],
      tech: ["PHP 8.2", "MySQL", "Tailwind CSS", "ApexCharts", "REST API"],
      github: "https://github.com/harshsathvara134-cpu"
    },
    p4: {
      title: "CyberVision Real-Time Image Inspector",
      badge: "👁️ VISION MODEL ACTIVE",
      badgeClass: "badge-hud",
      desc: "Automated vision model performing real-time quality assurance inspection over 60 FPS live video streams.",
      specs: [
        "OpenCV frame processing and YOLO/TensorFlow object classification.",
        "Real-time bounding box vector overlay with confidence scoring.",
        "Instant WebSocket event trigger upon defect detection.",
        "Sub-15ms image preprocessing pipeline."
      ],
      tech: ["Python", "OpenCV", "TensorFlow", "FastAPI", "WebSockets"],
      github: "https://github.com/harshsathvara134-cpu"
    }
  };

  const openArchModal = (projectId) => {
    const data = projectDetails[projectId];
    if (!data || !archModal) return;

    modalTitle.textContent = data.title;
    modalBadge.textContent = data.badge;
    modalBadge.className = `window-badge ${data.badgeClass}`;
    modalDesc.textContent = data.desc;

    // Populate specs list
    modalSpecsList.innerHTML = data.specs.map(spec => `<li>${spec}</li>`).join('');

    // Populate tech stack
    modalTechStack.innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

    if (modalGithubLink) {
      modalGithubLink.href = data.github;
    }

    archModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeArchModal = () => {
    if (archModal) {
      archModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-open-modal');
      openArchModal(projectId);
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeArchModal);
  }

  if (archModal) {
    archModal.addEventListener('click', (e) => {
      if (e.target === archModal) closeArchModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && archModal && archModal.classList.contains('active')) {
      closeArchModal();
    }
  });

  // === TESTIMONIALS SLIDER MODULE ===
  const slides = document.querySelectorAll('.testimonial-slide');
  const bullets = document.querySelectorAll('.slider-bullets .bullet');
  let currentSlide = 0;
  let slideInterval;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      bullets[i].classList.remove('active');
      if (i === index) {
        slide.classList.add('active');
        bullets[i].classList.add('active');
        
        // Custom slide placement for slider movement
        const track = document.getElementById('testimonial-track');
        if (track) {
          track.style.transform = `translateX(-${index * 100}%)`;
        }
      }
    });
    currentSlide = index;
  };

  const nextSlide = () => {
    const nextIdx = (currentSlide + 1) % slides.length;
    showSlide(nextIdx);
  };

  const startAutoSlide = () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  };

  if (slides.length > 0) {
    // bullet navigator listener trigger
    bullets.forEach((bullet, index) => {
      bullet.addEventListener('click', () => {
        showSlide(index);
        startAutoSlide(); // Reset auto slide timer on user click
      });
    });

    startAutoSlide();
  }

  // === FAQ ACCORDION ENGINE ===
  const faqCards = document.querySelectorAll('.faq-card');

  faqCards.forEach(card => {
    const trigger = card.querySelector('.faq-trigger');
    const panel = card.querySelector('.faq-panel');

    if (trigger && panel) {
      trigger.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');
        
        // Close all other panels
        faqCards.forEach(otherCard => {
          if (otherCard !== card && otherCard.classList.contains('open')) {
            otherCard.classList.remove('open');
            otherCard.querySelector('.faq-panel').style.maxHeight = null;
          }
        });

        // Toggle active status
        if (isOpen) {
          card.classList.remove('open');
          panel.style.maxHeight = null;
        } else {
          card.classList.add('open');
          panel.style.maxHeight = `${panel.scrollHeight}px`;
        }
      });
    }
  });

  // === UTILITY: CLIPBOARD COPY ACTIONS ===
  const copyButtons = document.querySelectorAll('.channel-copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy-val');
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Find existing SVG elements and transition with temporary check icon
        const originalSVG = btn.innerHTML;
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px;stroke:#10B981">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        `;
        btn.style.borderColor = '#10B981';
        btn.style.background = 'rgba(16, 185, 129, 0.1)';

        setTimeout(() => {
          btn.innerHTML = originalSVG;
          btn.style.borderColor = '';
          btn.style.background = '';
        }, 1800);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  });

  // === CONTACT FORM CONTROLLER ===
  const contactForm = document.getElementById('portfolio-contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form controls
      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const messageInput = document.getElementById('form-message');
      const serviceSelect = document.getElementById('form-service');
      const submitBtn = contactForm.querySelector('.form-submit-btn');

      // Clear previous feedbacks
      formFeedback.style.display = 'none';
      formFeedback.className = 'form-feedback';

      // Advanced Javascript Validations
      if (!nameInput.value.trim()) {
        showFeedback('Please enter your name.', 'error');
        nameInput.focus();
        return;
      }

      if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
        showFeedback('Please enter a valid email address.', 'error');
        emailInput.focus();
        return;
      }

      if (!messageInput.value.trim()) {
        showFeedback('Please write a message detailing your project scope.', 'error');
        messageInput.focus();
        return;
      }

      // Submission animation simulation
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width:18px;height:18px;animation: spin 1s linear infinite; margin-right:8px; display:inline-block">
          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)"></circle>
          <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Sending message...
      `;

      // Simulate API submit request delay
      setTimeout(() => {
        showFeedback('✓ Thank you! Your message has been sent successfully. I will get back to you within 24 hours.', 'success');
        contactForm.reset();
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Reset skill observer levels if required or scroll to top feedback
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1500);
    });

    const showFeedback = (text, status) => {
      formFeedback.textContent = text;
      formFeedback.classList.add(status);
      formFeedback.style.display = 'block';
    };

    const validateEmail = (email) => {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    };
  }
});
