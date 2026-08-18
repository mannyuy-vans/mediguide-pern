import "../App.css";

function About() {
  return (
    <main className="about-page">

      {/* About Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <p className="eyebrow">ABOUT MEDIGUIDE</p>

          <h1>
            Healthcare guidance,
            <span> made simpler.</span>
          </h1>

          <p>
            MEDIGUIDE is an intelligent health platform designed to help
            people understand their symptoms, access useful health
            information, and make more informed decisions about their care.
          </p>
        </div>
      </section>

      {/* What is MEDIGUIDE? */}
      <section className="about-introduction">
        <div className="about-text">
          <p className="eyebrow">WHAT IS MEDIGUIDE?</p>

          <h2>
            Technology that puts
            <span> health understanding </span>
            within reach.
          </h2>

          <p>
            MEDIGUIDE combines modern web technology with artificial
            intelligence to provide users with accessible health guidance.
          </p>

          <p>
            Users can describe their symptoms and receive possible
            explanations, general health guidance, and recommendations on
            when professional medical attention may be necessary.
          </p>
        </div>

        <div className="about-highlight">
          <div className="highlight-icon">+</div>

          <h3>Built around the patient</h3>

          <p>
            Our goal is to make health information easier to understand,
            easier to access, and available when people need it.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
<section className="mission-section">

  <div className="mission-header">
    <p className="eyebrow">OUR PURPOSE</p>

    <h2>
      Built to make healthcare
      <span> easier to understand.</span>
    </h2>

    <p>
      MEDIGUIDE is designed around a simple idea: technology should
      help people access useful health information without making
      healthcare feel complicated.
    </p>
  </div>

  <div className="mission-grid">

    <div className="mission-card mission-card-main">
      <div className="mission-number">01</div>

      <h3>Our Mission</h3>

      <p>
        To provide accessible, intelligent, and user-friendly health
        guidance that helps people better understand their symptoms
        and make informed decisions about seeking professional care.
      </p>
    </div>

    <div className="mission-card mission-card-secondary">
      <div className="mission-number">02</div>

      <h3>Our Vision</h3>

      <p>
        To create a future where technology helps bridge the gap
        between people and reliable health information, making
        healthcare guidance more accessible to everyone.
      </p>
    </div>

  </div>

</section>

      {/* Footer */}
      <footer className="footer">

        <div className="footer-main">

          <div className="footer-brand">
            <div className="footer-logo">
              <span>MEDI</span><strong>GUIDE</strong>
            </div>

            <p>
              Intelligent health guidance designed to help you
              understand your symptoms and make informed decisions.
            </p>

            <div className="footer-socials">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Instagram">◎</a>
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="LinkedIn">in</a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>

            <a href="/">Home</a>
            <a href="/about">About Us</a>
            <a href="/how-it-works">How It Works</a>
            <a href="/features">Features</a>
          </div>

          <div className="footer-column">
            <h3>Services</h3>

            <a href="/login">Symptom Checker</a>
            <a href="/login">Diagnosis History</a>
            <a href="/login">Appointments</a>
            <a href="/login">Community</a>
          </div>

          <div className="footer-column">
            <h3>Account</h3>

            <a href="/login">Login</a>
            <a href="/register">Create Account</a>
            <a href="/login">Patient Portal</a>
          </div>

        </div>

        <div className="footer-bottom">
          <p>
            © 2026 MEDIGUIDE. All rights reserved.
          </p>

          <div>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </div>
        </div>

      </footer>

    </main>
  );
}

export default About;