import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Navbar = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [role, setRole] = useState(null)
  const [token, setToken] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Load from localStorage and apply once
  useEffect(() => {
    setRole(localStorage.getItem("role"))
    setToken(localStorage.getItem("token"))
    const dm = localStorage.getItem("darkMode") === "true"
    setDarkMode(dm)
  }, [])

  // Whenever darkMode flips, update <html> & <body> styles
  useEffect(() => {
    // html class for tailwind dark:*
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // inline body background/text
    document.body.style.backgroundColor = darkMode ? "#1f2937" : "#ffffff"   // gray-800 or white
    document.body.style.color = darkMode ? "#d1d5db" : "#111827"             // gray-300 or gray-900
  }, [darkMode])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const next = !darkMode
    setDarkMode(next)
    localStorage.setItem("darkMode", next.toString())
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    alert("Logged out")
    navigate("/login")
  }

  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/contact", label: "Contact Us" },
    { href: "/faq", label: "FAQ" },
  ]
  if (role === "admin") navLinks.push({ href: "/admin", label: "Admin Dashboard" })

  // Inline styles
  const headerStyle = {
    backgroundColor: isScrolled
      ? darkMode
        ? "rgba(31, 41, 55, 0.95)"     // gray-900/95
        : "rgba(255, 255, 255, 0.95)"  // white/95
      : "transparent",
    boxShadow: isScrolled
      ? darkMode
        ? "0 2px 4px rgba(0,0,0,0.6)"
        : "0 2px 4px rgba(0,0,0,0.1)"
      : "none",
    transition: "background-color 0.3s, box-shadow 0.3s",
  }

  const linkStyle = (href) => {
    const active = window.location.pathname === href
    return {
      color: active
        ? darkMode
          ? "#A78BFA"  // purple-300
          : "#7C3AED"  // purple-600
        : darkMode
        ? "#9CA3AF"    // gray-400
        : "#6B7280",   // gray-500
      textDecoration: "none",
      fontWeight: 500,
      transition: "color 0.2s",
      cursor: "pointer",
      padding: "0.25rem 0.5rem",
    }
  }

  const btnBase = "font-medium rounded cursor-pointer transition"
  const btnBorder = darkMode ? "#8B5CF6" : "#7C3AED"

  return (
    <header style={headerStyle} className="fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          tabIndex={0}
          role="button"
          onClick={() => navigate("/home")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/home")}
          style={{
            background: "linear-gradient(to right, #8B5CF6, #3B82F6)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontWeight: "bold",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          EventMaster
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map(({ href, label }) => (
            <span key={href} onClick={() => navigate(href)} style={linkStyle(href)}>
              {label}
            </span>
          ))}
        </nav>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button onClick={toggleDarkMode} title="Toggle dark mode" style={{ fontSize: "1.25rem" }}>
            {darkMode ? "🌞" : "🌙"}
          </button>

          {!token ? (
            <>
              <button
                onClick={() => navigate("/login")}
                style={{
                  border: `2px solid ${btnBorder}`,
                  color: btnBorder,
                  padding: "0.375rem 0.75rem",
                }}
                className={btnBase}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                style={{
                  border: `2px solid ${btnBorder}`,
                  color: btnBorder,
                  padding: "0.375rem 0.75rem",
                }}
                className={btnBase}
              >
                Register
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                border: "2px solid #DC2626",
                color: "#DC2626",
                padding: "0.375rem 0.75rem",
              }}
              className={btnBase}
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <nav
          style={{
            backgroundColor: darkMode ? "rgba(31,41,55,0.95)" : "rgba(255,255,255,0.95)",
          }}
          className="md:hidden shadow-lg fixed top-16 left-0 right-0 z-40 flex flex-col p-4 space-y-3"
        >
          {navLinks.map(({ href, label }) => (
            <span
              key={href}
              onClick={() => {
                navigate(href)
                setIsOpen(false)
              }}
              style={linkStyle(href)}
            >
              {label}
            </span>
          ))}

          <div className="flex flex-col space-y-2 mt-2">
            <button
              onClick={() => {
                toggleDarkMode()
                setIsOpen(false)
              }}
              title="Toggle dark mode"
              style={{ fontSize: "1.25rem" }}
            >
              {darkMode ? "🌞" : "🌙"}
            </button>

            {!token ? (
              <>
                <button
                  onClick={() => {
                    navigate("/login")
                    setIsOpen(false)
                  }}
                  style={{
                    border: `2px solid ${btnBorder}`,
                    color: btnBorder,
                    padding: "0.375rem 0.75rem",
                  }}
                  className={btnBase}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/register")
                    setIsOpen(false)
                  }}
                  style={{
                    border: `2px solid ${btnBorder}`,
                    color: btnBorder,
                    padding: "0.375rem 0.75rem",
                  }}
                  className={btnBase}
                >
                  Register
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout()
                  setIsOpen(false)
                }}
                style={{
                  border: "2px solid #DC2626",
                  color: "#DC2626",
                  padding: "0.375rem 0.75rem",
                }}
                className={btnBase}
              >
                Logout
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar
