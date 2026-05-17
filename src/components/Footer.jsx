import { useEffect, useState } from 'react';

const Footer = ({ setActive }) => {
  const [floating, setFloating] = useState(false)
  let lastScrollY = window.scrollY

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY

      // User scrolling down
      if (currentScrollY > lastScrollY) {
        setFloating(true)
      } else {
        setFloating(false)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <footer
      style={{
        ...styles.footer,
        transform: floating
          ? "translateY(-12px)"
          : "translateY(0)",
        opacity: floating ? 1 : 0.95
      }}
    >
      <div style={styles.grid}>
        {/* Brand */}
        <div>
          <h3 style={styles.brand}>Gupta Radios</h3>
          <p style={styles.text}>
            Trusted electronics & electricals since 1975.
          </p>
        </div>

        {/* Products */}
        <div>
          <h4 style={styles.heading}>Products</h4>
          <ul style={styles.list}>
            <li onClick={() => setActive("audioVision")}>Audio & Vision</li>
            <li onClick={() => setActive("homeAppliances")}>Home Appliances</li>
            <li onClick={() => setActive("commercial")}>Commercial Products</li>
          </ul>
          
          <h4 style={styles.heading}>Home Appliances</h4>
          <ul style={styles.list}>
            <li onClick={() => setActive("homeAppliances")}>Air Conditioners</li>
            <li onClick={() => setActive("homeAppliances")}>Refrigerators</li>
            <li onClick={() => setActive("homeAppliances")}>Washing Machines</li>
            <li onClick={() => setActive("homeAppliances")}>
              Inverter & Battery Systems
            </li>
            <li onClick={() => setActive("homeAppliances")}>Small Appliances</li>
            <li onClick={() => setActive("homeAppliances")}>Kitchen Appliances</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={styles.heading}>Contact</h4>
          <ul style={styles.list}>
            <li><a href="tel:7500701500">Sales: 7500701500</a></li>
            <li><a href="tel:7500709200">Support: 7500709200</a></li>
            <li>
              <a href="mailto:guptaradios05943@gmail.com">
                guptaradios05943@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://www.google.com/maps/dir//Gupta+Radios,+main+market,+Tanakpur,+Uttarakhand+262309"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Google Maps
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Services</h4>
          <ul style={styles.list}>
            <li onClick={() => setActive("services")}>Service Request</li>
            <li>Installation</li>
            <li>Maintenance</li>
          </ul>
        </div>

        <div>
          <h4>Connect With Us</h4>

          <div style={styles.socials}>
            <a
              href="https://www.facebook.com/guptaradios05943"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gupta Radios Facebook"
              style={styles.link}
            >
              Facebook
            </a>

            <a
              href="https://www.instagram.com/gupta_radios_?igsh=M3Fibm5zYWZocXg="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gupta Radios Instagram"
              style={styles.link}
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div style={styles.bottom}>
        &copy; {new Date().getFullYear()} Gupta Radios. All rights reserved.
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background: "#0b1c2d",
    color: "#ffffff",
    padding: "48px 10% 20px",
    marginTop: "80px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "40px",
    marginBottom: "30px"
  },
  text: {
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: "1.6"
  },
  heading: {
    marginBottom: "12px"
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    lineHeight: "2",
    fontSize: "14px",
    color: "#cbd5e1",
    cursor: "pointer"
  },
  bottom: {
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: "16px",
    textAlign: "center",
    fontSize: "13px",
    color: "#94a3b8"
  },
  socials: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "8px"
  },
  link: {
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "14px"
  }
}

export default Footer
