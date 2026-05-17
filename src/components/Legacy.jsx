import '../styles/theme.css';
import '../styles/legacy.css';

const Legacy = () => {
  return (
    <section id="legacy" className="legacy-section">
      <div className="legacy-content">
        <h2>Our Legacy <span className="accent-text">— Since 1975</span></h2>
        
        <div className="legacy-text">
          <p>
            Gupta Radios began its journey in 1975 with a simple belief — 
            quality electronics build lasting trust. What started as a small
            radio store soon became a familiar name in households that valued
            reliability and honest service.
          </p>

          <p>
            As technology evolved, so did we. From radios to black and white
            televisions, from TV antennas to colour TVs, we continuously adapted
            to bring the latest innovations to our customers while preserving
            the values that defined us.
          </p>

          <p>
            Over the years, our offerings expanded into electricals and home
            solutions, partnering with top-class brands such as Havells.
            Today, we proudly bring premium LED and OLED televisions and
            modern electrical appliances — combining cutting-edge technology
            with decades of experience.
          </p>

          <p className="highlight">
            Our journey reflects more than products; it reflects generations
            of relationships built on trust, service, and a deep understanding
            of what our customers truly need.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Legacy;
