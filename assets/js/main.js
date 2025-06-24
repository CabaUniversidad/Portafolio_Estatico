// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem("theme") || "light"
    this.init()
  }

  init() {
    this.setTheme(this.theme)
    this.bindEvents()
  }

  setTheme(theme) {
    this.theme = theme

    // Aplicar el tema inmediatamente sin transición
    document.documentElement.style.transition = "none"
    document.documentElement.setAttribute("data-theme", theme)

    // Restaurar las transiciones después de un frame
    requestAnimationFrame(() => {
      document.documentElement.style.transition = ""
    })

    localStorage.setItem("theme", theme)

    // Actualizar el navbar inmediatamente
    this.updateNavbarTheme(theme)
  }

  updateNavbarTheme(theme) {
    const navbar = document.getElementById("navbar")
    if (navbar) {
      if (theme === "dark") {
        navbar.style.background = "rgba(15, 23, 42, 0.8)"
        navbar.style.borderBottomColor = "rgba(71, 85, 105, 0.5)"
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.8)"
        navbar.style.borderBottomColor = "rgba(226, 232, 240, 0.5)"
      }
    }
  }

  toggleTheme() {
    const newTheme = this.theme === "light" ? "dark" : "light"
    this.setTheme(newTheme)
  }

  bindEvents() {
    const themeToggle = document.getElementById("theme-toggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme())
    }
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.navbar = document.getElementById("navbar")
    this.mobileMenuToggle = document.getElementById("mobile-menu-toggle")
    this.navMenu = document.getElementById("nav-menu")
    this.navLinks = document.querySelectorAll(".nav-link")
    this.sections = document.querySelectorAll("section[id]")
    this.init()
  }

  init() {
    this.bindEvents()
    this.handleScroll()
    this.updateActiveLink()
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.addEventListener("click", () => this.toggleMobileMenu())
    }

    // Navigation links
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("data-section")
        this.scrollToSection(targetId)
        this.closeMobileMenu()
      })
    })

    // Scroll events
    window.addEventListener("scroll", () => {
      this.handleScroll()
      this.updateActiveLink()
    })

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.navbar.contains(e.target)) {
        this.closeMobileMenu()
      }
    })
  }

  toggleMobileMenu() {
    this.mobileMenuToggle.classList.toggle("active")
    this.navMenu.classList.toggle("mobile-open")
  }

  closeMobileMenu() {
    this.mobileMenuToggle.classList.remove("active")
    this.navMenu.classList.remove("mobile-open")
  }

  handleScroll() {
    const scrolled = window.scrollY > 50
    this.navbar.style.background = scrolled ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.8)"

    if (document.documentElement.getAttribute("data-theme") === "dark") {
      this.navbar.style.background = scrolled ? "rgba(15, 23, 42, 0.9)" : "rgba(15, 23, 42, 0.8)"
    }
  }

  updateActiveLink() {
    let current = ""
    const scrollPosition = window.scrollY + 100

    this.sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute("id")
      }
    })

    this.navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("data-section") === current) {
        link.classList.add("active")
      }
    })
  }

  scrollToSection(sectionId) {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  }
}

// Skills Animation
class SkillsManager {
  constructor() {
    this.skillsSection = document.getElementById("habilidades")
    this.skillsGrid = document.getElementById("skills-grid")
    this.filterButtons = document.querySelectorAll(".skills-filters .filter-btn")
    this.skillCards = document.querySelectorAll(".skill-card")
    this.progressBars = document.querySelectorAll(".progress-fill")
    this.animated = false
    this.init()
  }

  init() {
    this.bindEvents()
    this.observeSkillsSection()
  }

  bindEvents() {
    this.filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter")
        this.filterSkills(filter)
        this.updateActiveFilter(button)
      })
    })
  }

  observeSkillsSection() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.animated) {
            this.animateProgressBars()
            this.animated = true
          }
        })
      },
      { threshold: 0.3 },
    )

    if (this.skillsSection) {
      observer.observe(this.skillsSection)
    }
  }

  animateProgressBars() {
    this.progressBars.forEach((bar, index) => {
      setTimeout(() => {
        const progress = bar.getAttribute("data-progress")
        bar.style.width = progress + "%"
      }, index * 100)
    })
  }

  filterSkills(filter) {
    this.skillCards.forEach((card) => {
      const category = card.getAttribute("data-category")
      if (filter === "all" || category === filter) {
        card.style.display = "block"
        card.style.animation = "fadeInUp 0.5s ease"
      } else {
        card.style.display = "none"
      }
    })
  }

  updateActiveFilter(activeButton) {
    this.filterButtons.forEach((button) => {
      button.classList.remove("active")
    })
    activeButton.classList.add("active")
  }
}

// Projects Management
class ProjectsManager {
  constructor() {
    this.projectsGrid = document.getElementById("projects-grid")
    this.filterButtons = document.querySelectorAll(".projects-filters .filter-btn")
    this.projectCards = document.querySelectorAll(".project-card")
    this.init()
  }

  init() {
    this.bindEvents()
  }

  bindEvents() {
    this.filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter")
        this.filterProjects(filter)
        this.updateActiveFilter(button)
      })
    })
  }

  filterProjects(filter) {
    this.projectCards.forEach((card) => {
      const category = card.getAttribute("data-category")
      if (filter === "all" || category === filter) {
        card.style.display = "block"
        card.style.animation = "fadeInUp 0.5s ease"
      } else {
        card.style.display = "none"
      }
    })
  }

  updateActiveFilter(activeButton) {
    this.filterButtons.forEach((button) => {
      button.classList.remove("active")
    })
    activeButton.classList.add("active")
  }
}

// Contact Form Management
class ContactFormManager {
  constructor() {
    this.form = document.getElementById("contact-form")
    this.submitBtn = document.getElementById("submit-btn")
    this.toast = document.getElementById("toast")
    this.init()
  }

  init() {
    this.bindEvents()
  }

  bindEvents() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e))
    }
  }

  async handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData(this.form)
    const data = {
      nombre: formData.get("nombre"),
      email: formData.get("email"),
      asunto: formData.get("asunto"),
      mensaje: formData.get("mensaje"),
    }

    // Validate form
    if (!this.validateForm(data)) {
      return
    }

    // Show loading state
    this.setLoadingState(true)

    try {
      // Simulate form submission
      await this.simulateSubmission(data)

      // Show success message
      this.showToast("¡Mensaje enviado correctamente!", "success")

      // Reset form
      this.form.reset()
    } catch (error) {
      // Show error message
      this.showToast("Error al enviar el mensaje. Inténtalo de nuevo.", "error")
    } finally {
      // Hide loading state
      this.setLoadingState(false)
    }
  }

  validateForm(data) {
    const { nombre, email, asunto, mensaje } = data

    if (!nombre || !email || !asunto || !mensaje) {
      this.showToast("Por favor, completa todos los campos.", "error")
      return false
    }

    if (!this.isValidEmail(email)) {
      this.showToast("Por favor, ingresa un email válido.", "error")
      return false
    }

    return true
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  async simulateSubmission(data) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Form submitted:", data)
        resolve()
      }, 2000)
    })
  }

  setLoadingState(loading) {
    if (loading) {
      this.submitBtn.classList.add("loading")
      this.submitBtn.disabled = true
    } else {
      this.submitBtn.classList.remove("loading")
      this.submitBtn.disabled = false
    }
  }

  showToast(message, type = "success") {
    const toastMessage = this.toast.querySelector(".toast-message")
    const toastIcon = this.toast.querySelector(".toast-icon")

    toastMessage.textContent = message

    // Update icon based on type
    if (type === "success") {
      toastIcon.setAttribute("data-lucide", "check-circle")
      this.toast.style.background = "#22c55e"
    } else {
      toastIcon.setAttribute("data-lucide", "x-circle")
      this.toast.style.background = "#ef4444"
    }

    // Re-initialize lucide icons
    if (typeof lucide !== "undefined") {
      lucide && lucide.createIcons()
    }

    // Show toast
    this.toast.classList.add("show")

    // Hide toast after 3 seconds
    setTimeout(() => {
      this.toast.classList.remove("show")
    }, 3000)
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll('[class*="animate-"]')
    this.init()
  }

  init() {
    this.observeElements()
  }

  observeElements() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running"
          }
        })
      },
      { threshold: 0.1 },
    )

    this.animatedElements.forEach((element) => {
      element.style.animationPlayState = "paused"
      observer.observe(element)
    })
  }
}

// Utility Functions
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    const offsetTop = element.offsetTop - 80
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    })
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons()
  }

  // Initialize managers
  new ThemeManager()
  new NavigationManager()
  new SkillsManager()
  new ProjectsManager()
  new ContactFormManager()
  new ScrollAnimations()

  // Add smooth scrolling to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
})

// Handle window resize
window.addEventListener("resize", () => {
  // Close mobile menu on resize
  const navMenu = document.getElementById("nav-menu")
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle")

  if (window.innerWidth >= 768) {
    navMenu.classList.remove("mobile-open")
    mobileMenuToggle.classList.remove("active")
  }
})

// Handle page visibility change
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Page is hidden
    document.title = "👋 ¡Vuelve pronto! - Franz Caballero"
  } else {
    // Page is visible
    document.title = "Franz Caballero - Portafolio | Estudiante de Sistemas Informáticos"
  }
})
