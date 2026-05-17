import { useState } from "react"

const Services = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    product: "",
    service: "",
    serviceType: ""
  })

  const products = [
    "LED TVs",
    "Projectors",
    "Party Speakers",
    "Home Theatre Systems",
    "Portable Speakers",
    "Air Conditioners",
    "Refrigerators",
    "Washing Machines",
    "Inverter & Battery Systems",
    "Dry Iron",
    "Mixer Grinders",
    "Juicers",
    "Induction Cooktops",
    "Electric Kettle",
    "Toasters & Grillers",
    "Microwave Ovens",
    "Kitchen Chimneys & Gas Stoves",
    "HVAC Systems",
    "Chest Freezer / Deep Freezer"
  ]

  const services = [
    "Breakdown",
    "Demo / Installation",
    "Service & Maintenance"
  ]

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()

    const message = `
Service Request from Gupta Radios Website

Name: ${form.name}
WhatsApp Number: ${form.phone}
Address: ${form.address}

Product: ${form.product}
Service Needed: ${form.service}
Service Type: ${form.serviceType}

Invoice: Will be shared in WhatsApp (if available)
`.trim()

    const phoneNumber = "917500701500" // WhatsApp number
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`

    window.open(url, "_blank")
  }

  return (
    <div style={styles.container}>
      <h2>Service Request</h2>
      <p style={styles.desc}>
        Please fill in the details below and our service team will get in touch
        with you.
      </p>
      <p style={styles.note}>
        ⚠️ Please use a WhatsApp-enabled number only
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Phone *</label>
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={3}
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Product *</label>
          <select
            name="product"
            value={form.product}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">Select a product</option>
            {products.map(product => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Service Type *</label>
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">Select service type</option>
            {services.map(service => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Warranty Status *</label>
          <select
            name="serviceType"
            value={form.serviceType}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">Service Type</option>
            <option value="Under Warranty">Under Warranty</option>
            <option value="Paid / Out of Warranty">Paid / Out of Warranty</option>
          </select>
        </div>

        <div style={styles.uploadBox}>
          <label style={styles.uploadLabel}>
            Upload Sales Invoice (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
          />
          <small style={styles.uploadNote}>
            You can attach invoice photo in WhatsApp after submitting the form.
          </small>
        </div>

        <button type="submit" style={styles.button}>
          Submit Service Request
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "40px 20px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
  },
  title: {
    fontSize: "32px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "16px",
    textAlign: "center"
  },
  subtitle: {
    fontSize: "16px",
    color: "#64748b",
    marginBottom: "32px",
    textAlign: "center",
    lineHeight: "1.5"
  },
  desc: {
    fontSize: "16px",
    color: "#64748b",
    marginBottom: "32px",
    textAlign: "center",
    lineHeight: "1.5"
  },
  note: {
    fontSize: "14px",
    color: "#f59e0b",
    marginBottom: "24px",
    textAlign: "center",
    lineHeight: "1.4",
    fontWeight: "500"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151"
  },
  input: {
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s"
  },
  textarea: {
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
    resize: "vertical"
  },
  select: {
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: "#ffffff"
  },
  button: {
    padding: "14px 24px",
    background: "#39A3E6",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginTop: "16px"
  },
  uploadBox: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  uploadLabel: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151"
  },
  uploadNote: {
    fontSize: "12px",
    color: "#6b7280",
    lineHeight: "1.4"
  }
}

export default Services
