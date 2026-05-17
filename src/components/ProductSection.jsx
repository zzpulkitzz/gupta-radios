import EnquireButton from "./EnquireButton"
import kettle from "../assets/products/home-appliances/kettle.jpg"
import toaster from "../assets/products/home-appliances/toaster-griller.jpg"
import microwave from "../assets/products/home-appliances/microwave.jpg"
import chimney from "../assets/products/home-appliances/chimney-gas-stove.jpg"
import inverterBattery from "../assets/products/home-appliances/inverter-battery.jpg"
import hvac from "../assets/products/commercial/hvac.jpg"

// Fallback image for products without specific images
const fallbackImage = "https://picsum.photos/seed/product-placeholder/300/200.jpg"

const imageMap = {
  "LED TVs": "https://images.unsplash.com/photo-1594730369342-b5d7c1e5c2e7?w=300&h=200&fit=crop&auto=format",
  "Projectors": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop&auto=format",
  "Party Speakers": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop&auto=format",
  "Home Theatre Systems": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop&auto=format",
  "Portable Speakers": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&h=200&fit=crop&auto=format",

  "Air Conditioners": "https://images.unsplash.com/photo-1580837119756-563d608dd119?w=300&h=200&fit=crop&auto=format",
  "Refrigerators": "https://images.unsplash.com/photo-1585493981438-0997a055c0e6?w=300&h=200&fit=crop&auto=format",
  "Washing Machines": "https://images.unsplash.com/photo-1584464491033-06638f3b1c77?w=300&h=200&fit=crop&auto=format",
  "Inverter & Battery Systems": inverterBattery,
  "Dry Iron": "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=300&h=200&fit=crop&auto=format",
  "Mixer Grinders": "https://images.unsplash.com/photo-1607305387299-a3d9611cd212?w=300&h=200&fit=crop&auto=format",
  "Juicers": "https://images.unsplash.com/photo-1600701885708-0404b75e2e80?w=300&h=200&fit=crop&auto=format",
  "Induction Cooktops": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&h=200&fit=crop&auto=format",
  "Electric Kettle": "https://images.unsplash.com/photo-1596894317894-56c0272c4d31?w=300&h=200&fit=crop&auto=format",
  "Toasters & Grillers": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&auto=format",
  "Microwave Ovens": "https://images.unsplash.com/photo-1563241527-954e32c66339?w=300&h=200&fit=crop&auto=format",
  "Kitchen Chimneys & Gas Stoves": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop&auto=format",

  "HVAC Systems": "https://images.unsplash.com/photo-1615676702313-2f6f0abf1f3e?w=300&h=200&fit=crop&auto=format",
  "Chest Freezer / Deep Freezer": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop&auto=format"
}

const ProductSection = ({ title, description, products }) => {
  return (
    <section style={styles.section}>
      <h2>{title}</h2>
      <p style={styles.desc}>{description}</p>

      <div style={styles.grid}>
        {products.map(product => (
          <div key={product} style={styles.card}>
            <img
              src={imageMap[product] || fallbackImage}
              alt={product}
              style={styles.image}
            />

            <h4>{product}</h4>
            <EnquireButton product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}

const styles = {
  section: {
    maxWidth: "1000px"
  },
  desc: {
    marginBottom: "32px",
    color: "#475569"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "28px"
  },
  card: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "18px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    textAlign: "center"
  },
  image: {
    width: "100%",
    height: "160px",
    objectFit: "contain",
    marginBottom: "16px"
  }
}

export default ProductSection
