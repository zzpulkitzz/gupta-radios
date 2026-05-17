import ProductSection from "./ProductSection"
import Legacy from "./Legacy"
import Contact from "./Contact"
import Services from "./Services"

const Content = ({ active }) => {
  const pages = {
    legacy: <Legacy />,

    audioVision: (
      <ProductSection
        title="Audio & Vision"
        description="Experience immersive sound and stunning visuals with our modern entertainment solutions."
        products={[
          "LED TVs",
          "Projectors",
          "Party Speakers",
          "Home Theatre Systems",
          "Portable Speakers"
        ]}
      />
    ),

    homeAppliances: (
      <ProductSection
        title="Home Appliances & Power Solutions"
        description="Essential appliances and reliable power solutions designed for everyday comfort and uninterrupted living."
        products={[
          "Air Conditioners",
          "Refrigerators",
          "Washing Machines",

          // Power Solutions
          "Inverter & Battery Systems",

          "Dry Iron",
          "Mixer Grinders",
          "Juicers",
          "Induction Cooktops",
          "Electric Kettle",
          "Toasters & Grillers",
          "Microwave Ovens",
          "Kitchen Chimneys & Gas Stoves"
        ]}
      />
    ),

    commercial: (
      <ProductSection
        title="Commercial Products"
        description="High-performance cooling and refrigeration solutions for commercial and business environments."
        products={[
          "HVAC Systems",
          "Chest Freezer / Deep Freezer"
        ]}
      />
    ),

    services: <Services />,
    
    contact: <Contact />
  }

  return <main style={styles.main}>{pages[active] || <Legacy />}</main>
}

const styles = {
  main: {
    padding: "48px 64px"
  }
}

export default Content
