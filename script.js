document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     1. DUAL THEME TOGGLE (DARK & LIGHT) WITH PERSISTENCE
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  
  if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
    document.body.classList.add('light-theme');
  }
  
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
  });

  /* ==========================================================================
     2. MOBILE NAVIGATION HAMBURGER MENU
     ========================================================================== */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const toggleMobileMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  };
  
  hamburger.addEventListener('click', toggleMobileMenu);
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  /* ==========================================================================
     3. STICKY HEADER & SCROLL PROGRESS
     ========================================================================== */
  const header = document.querySelector('.header');
  const scrollProgress = document.querySelector('.scroll-progress');
  const backToTopBtn = document.querySelector('.back-to-top');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Sticky Header Scroll State
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Scroll Progress bar width
    if (docHeight > 0) {
      const scrollPercent = (scrollY / docHeight) * 100;
      scrollProgress.style.width = `${scrollPercent}%`;
    }
    
    // Back to Top Button visibility
    if (scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
    
    // Active Link Highlighting based on scroll position
    const scrollPosition = scrollY + 120; // offset for nav header height
    document.querySelectorAll('section').forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
  
  // Back to Top action
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* ==========================================================================
     4. TYPING ANIMATION (HERO SECTION HEADLINE)
     ========================================================================== */
  const typingElement = document.querySelector('.typing-text');
  const roles = [
    "Aspiring Data Scientist",
    "Full-Stack Developer",
    "B.Tech Computer Science & Design Student"
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  const typeEffect = () => {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      // Remove characters
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // faster deletion
    } else {
      // Add characters
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // standard typing speed
    }
    
    // Typing states logic
    if (!isDeleting && charIndex === currentRole.length) {
      // Full word typed, pause before deleting
      isDeleting = true;
      typingSpeed = 1800; // pause duration
    } else if (isDeleting && charIndex === 0) {
      // Word completely deleted, switch to next word
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // small pause before next word
    }
    
    setTimeout(typeEffect, typingSpeed);
  };
  
  // Start the typing loop
  if (typingElement) {
    typeEffect();
  }

  /* ==========================================================================
     5. ABOUT ME SECTION TABS SWITCHER
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.about-tab-btn');
  const tabContents = document.querySelectorAll('.about-tab-content');
  
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.getAttribute('data-tab');
      
      // Remove active states from buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      // Remove active states from content divs
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Set active states on targeted elements
      btn.classList.add('active');
      const targetContent = document.getElementById(tabTarget);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     6. PROJECTS SEARCH AND CATEGORY FILTERING SYSTEM
     ========================================================================== */
  const searchInput = document.getElementById('project-search');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card-wrapper');
  
  let currentFilter = 'all';
  let currentQuery = '';
  
  const filterProjects = () => {
    projectCards.forEach(wrapper => {
      const card = wrapper.querySelector('.project-card');
      const title = card.querySelector('.project-title').textContent.toLowerCase();
      const description = card.querySelector('.project-desc').textContent.toLowerCase();
      const category = card.getAttribute('data-category');
      
      const matchesSearch = title.includes(currentQuery) || description.includes(currentQuery);
      const matchesCategory = currentFilter === 'all' || category === currentFilter;
      
      if (matchesSearch && matchesCategory) {
        wrapper.style.display = 'block';
        // Add dynamic fade-in
        wrapper.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        wrapper.style.display = 'none';
      }
    });
  };
  
  // Search text handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentQuery = e.target.value.toLowerCase().trim();
      filterProjects();
    });
  }
  
  // Filter category buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active states
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentFilter = btn.getAttribute('data-filter');
      filterProjects();
    });
  });

  /* ==========================================================================
     7. CONTACT FORM SUBMISSION WITH TOAST NOTIFICATION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const toastCloseBtn = document.getElementById('toast-close');
  
  const showToast = (title, message, isSuccess = true) => {
    const toastTitleEl = toast.querySelector('.toast-title');
    const toastDescEl = toast.querySelector('.toast-desc');
    const toastIconEl = toast.querySelector('.toast-icon');
    
    toastTitleEl.textContent = title;
    toastDescEl.textContent = message;
    
    if (isSuccess) {
      toast.style.borderLeftColor = 'var(--accent-cyan)';
      toastIconEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.25 15L6.5 12.75l1.414-1.414 2.836 2.835 6.329-6.33 1.414 1.414L10.75 17z"/>
        </svg>
      `;
    } else {
      toast.style.borderLeftColor = 'var(--accent-pink)';
      toastIconEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      `;
    }
    
    toast.classList.add('show');
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
  };
  
  if (toastCloseBtn) {
    toastCloseBtn.addEventListener('click', () => {
      toast.classList.remove('show');
    });
  }
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameVal = document.getElementById('name').value.trim();
      const emailVal = document.getElementById('email').value.trim();
      const subjectVal = document.getElementById('subject').value.trim();
      const messageVal = document.getElementById('message').value.trim();
      
      // Simple validation checks
      if (!nameVal || !emailVal || !subjectVal || !messageVal) {
        showToast("Validation Error", "All fields are required. Please fill in the details.", false);
        return;
      }
      
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailVal)) {
        showToast("Invalid Email", "Please enter a valid email address.", false);
        return;
      }
      
      // Form Submission Simulation
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Message...';
      
      // Simulate network request duration
      setTimeout(() => {
        showToast("Message Sent!", "Thank you, Manuel will get back to you shortly.");
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }, 1500);
    });
  }
});
