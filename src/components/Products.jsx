const Products = () => {
  return (
    <section id="products" style={{ background: '#f1f6fb' }}>
      <h2>What We Offer</h2>
      <ul style={styles.list}>
        <li>Televisions & Audio Systems</li>
        <li>Home Appliances</li>
        <li>Electronic Accessories</li>
        <li>Trusted Brands & After-Sales Support</li>
      </ul>
    </section>
  )
}

const styles = {
  list: {
    marginTop: '20px',
    lineHeight: '2',
    color: '#374151'
  }
}

export default Products
