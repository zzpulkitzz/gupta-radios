const EnquireButton = ({ product }) => {
  const phoneNumber = "917500701500"

  const message = encodeURIComponent(
    `Hi, we need a little help with ${product}.` 
  )

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      style={styles.button}
    >
      Enquire Now
    </a>
  )
}

const styles = {
  button: {
    display: "inline-block",
    marginTop: "20px",
    padding: "10px 18px",
    backgroundColor: "#39A3E6",
    color: "#ffffff",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: 500
  }
}

export default EnquireButton
