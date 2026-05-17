const Hero = () => {
  return (
    <section style={styles.hero}>
      <h1>Serving Trust Since Generations</h1>
      <p>
        Gupta Radios is a family-owned electronics business delivering
        quality appliances and long-lasting relationships for decades.
      </p>
    </section>
  )
}

const styles = {
  hero: {
    height: '80vh',
    background: 'linear-gradient(135deg, #1e3a5f, #4da8da)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 20px'
  }
}

export default Hero
