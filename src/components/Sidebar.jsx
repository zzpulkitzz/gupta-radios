import { useState } from 'react';

const Sidebar = ({ active, setActive, open, setOpen }) => {
  const [openCategory, setOpenCategory] = useState(null)

  const toggleCategory = category =>
    setOpenCategory(prev => (prev === category ? null : category))

  return (
    <>
      {open && <div style={styles.overlay} onClick={() => setOpen(false)} />}

      <aside
        style={{
          ...styles.sidebar,
          transform: open ? "translateX(0)" : "translateX(-100%)"
        }}
      >
        <button style={styles.closeBtn} onClick={() => setOpen(false)}>
          ✕
        </button>

        <h3 style={styles.title}>Gupta Radios</h3>

        {/* Legacy */}
        <button
          style={active === "legacy" ? styles.active : styles.item}
          onClick={() => {
            setActive("legacy")
            setOpen(false)
          }}
        >
          Our Legacy
        </button>

        {/* AUDIO & VISION */}
        <div>
          <button
            style={styles.item}
            onClick={() => toggleCategory("audioVision")}
          >
            Audio & Vision ▾
          </button>

          {openCategory === "audioVision" && (
            <div style={styles.subGroup}>
              <SubItem label="LED TVs" onClick={() => setActive("audioVision")} />
              <SubItem label="Projectors" onClick={() => setActive("audioVision")} />
              <SubItem label="Party Speakers" onClick={() => setActive("audioVision")} />
              <SubItem label="Home Theatre" onClick={() => setActive("audioVision")} />
              <SubItem label="Portable Speakers" onClick={() => setActive("audioVision")} />
            </div>
          )}
        </div>

        {/* HOME APPLIANCES */}
        <div>
          <button
            style={styles.item}
            onClick={() => toggleCategory("homeAppliances")}
          >
            Home Appliances ▾
          </button>

          {openCategory === "homeAppliances" && (
            <div style={styles.subGroup}>
              <SubItem label="Air Conditioners" onClick={() => setActive("homeAppliances")} />
              <SubItem label="Refrigerators" onClick={() => setActive("homeAppliances")} />
              <SubItem label="Washing Machines" onClick={() => setActive("homeAppliances")} />
              <SubItem label="Inverter & Battery" onClick={() => setActive("homeAppliances")} />
              <SubItem label="Small Appliances" onClick={() => setActive("homeAppliances")} />
              <SubItem label="Microwave Ovens" onClick={() => setActive("homeAppliances")} />
              <SubItem label="Kitchen Chimneys & Gas Stoves" onClick={() => setActive("homeAppliances")} />
            </div>
          )}
        </div>

        {/* COMMERCIAL */}
        <div>
          <button
            style={styles.item}
            onClick={() => toggleCategory("commercial")}
          >
            Commercial Products ▾
          </button>

          {openCategory === "commercial" && (
            <div style={styles.subGroup}>
              <SubItem label="HVAC Systems" onClick={() => setActive("commercial")} />
              <SubItem
                label="Chest / Deep Freezers"
                onClick={() => setActive("commercial")}
              />
            </div>
          )}
        </div>

        {/* SERVICES */}
        <button
          style={active === "services" ? styles.active : styles.item}
          onClick={() => {
            setActive("services")
            setOpen(false)
          }}
        >
          Services
        </button>

        {/* CONTACT */}
        <button
          style={active === "contact" ? styles.active : styles.item}
          onClick={() => {
            setActive("contact")
            setOpen(false)
          }}
        >
          Contact Us
        </button>
      </aside>
    </>
  )
}

const SubItem = ({ label, onClick }) => (
  <button
    style={styles.subItem}
    onClick={onClick}
  >
    {label}
  </button>
)

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 998
  },
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "270px",
    height: "100vh",
    background: "#ffffff",
    padding: "24px",
    boxShadow: "2px 0 20px rgba(0,0,0,0.15)",
    transition: "transform 0.3s ease",
    zIndex: 999,
    overflowY: "auto"
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    marginBottom: "16px"
  },
  title: {
    marginBottom: "20px",
    fontSize: "20px",
    fontWeight: 600,
    color: "#1e293b"
  },
  item: {
    display: "block",
    width: "100%",
    padding: "10px",
    background: "none",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "15px",
    color: "#334155",
    borderRadius: "6px",
    margin: "4px 0",
    transition: "all 0.2s"
  },
  active: {
    background: "#eef7fd",
    color: "#39A3E6",
    borderRadius: "6px",
    padding: "10px",
    border: "none",
    textAlign: "left"
  },
  subGroup: {
    marginLeft: "10px",
    marginBottom: "10px",
    borderLeft: "2px solid #e2e8f0",
    paddingLeft: "10px"
  },
  subItem: {
    display: "block",
    width: "100%",
    padding: "6px 12px",
    background: "none",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    color: "#475569",
    borderRadius: "4px",
    margin: "2px 0",
    transition: "all 0.2s"
  }
}

export default Sidebar
