function Home() {
  return (
    <main className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
            
          <h1>
            Your health,
            <br />
            <span>understood better.</span>
          </h1>

          <p className="hero-description">
            Describe your symptoms and get intelligent health guidance
            designed to help you understand what might be happening
            and what steps you can take next.
          </p>

          <div className="hero-actions">
            <button className="primary-button">
              Check Your Symptoms
            </button>

            <a href="#how-it-works" className="text-button">
              See how it works →
            </a>
          </div>

          <div className="hero-trust">
            <span>✓ AI-powered guidance</span>
            <span>✓ Available anytime</span>
            <span>✓ Privacy focused</span>
          </div>
        </div>

        {/* AI Assistant Preview */}
        <div className="assistant-preview">
          <div className="assistant-header">
            <div className="assistant-title">
              <div className="assistant-icon">✚</div>

              <div>
                <strong>MEDIGUIDE AI</strong>
                <span>Health Assistant</span>
              </div>
            </div>

            <span className="online-status">
              <span></span>
              Online
            </span>
          </div>

          <div className="chat-preview">
            <div className="message ai-message">
              Hello! 👋
              <br />
              How are you feeling today?
            </div>

            <div className="message user-message">
              I've been having a headache and feeling tired.
            </div>

            <div className="message ai-message">
              I can help you understand those symptoms. Tell me a little
              more about your headache.
            </div>
          </div>

          <div className="assistant-input">
            <span>Describe your symptoms...</span>
            <button>→</button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section" id="how-it-works">
        <div className="section-intro">
          <p className="eyebrow">HOW IT WORKS</p>

          <h2>
            Healthcare guidance,
            <br />
            <span>made simple.</span>
          </h2>

          <p>
            MEDIGUIDE helps you move from uncertainty to a clearer
            understanding of your symptoms in a few simple steps.
          </p>
        </div>

        <div className="steps">
          <div className="step">
            <div className="step-number">01</div>

            <h3>Describe</h3>

            <p>
              Tell MEDIGUIDE what you're experiencing using your own words.
            </p>
          </div>

          <div className="step">
            <div className="step-number">02</div>

            <h3>Analyze</h3>

            <p>
              Our system analyzes your symptoms and identifies possible
              health conditions.
            </p>
          </div>

          <div className="step">
            <div className="step-number">03</div>

            <h3>Get Guidance</h3>

            <p>
              Receive general guidance and recommendations about what to
              consider doing next.
            </p>
          </div>
        </div>
      </section>

      {/* Why MEDIGUIDE */}
      <section className="why-section">
        <div className="section-intro centered">
          <p className="eyebrow">WHY MEDIGUIDE</p>

          <h2>
            More than a symptom checker.
          </h2>

          <p>
            A complete digital health experience designed around you.
          </p>
        </div>

        <div className="benefits">
          <div className="benefit">
            <div className="benefit-icon">✦</div>

            <h3>AI Symptom Analysis</h3>

            <p>
              Explore possible conditions based on the symptoms you
              provide.
            </p>
          </div>

          <div className="benefit">
            <div className="benefit-icon">◷</div>

            <h3>Health History</h3>

            <p>
              Keep your previous health information and diagnosis history
              organized.
            </p>
          </div>

          <div className="benefit">
            <div className="benefit-icon">+</div>

            <h3>Professional Support</h3>

            <p>
              Connect your health journey with healthcare professionals
              when needed.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div>
          <p className="eyebrow">START YOUR JOURNEY</p>

          <h2>
            Understanding your health
            <br />
            starts with one conversation.
          </h2>

          <p>
            Create your MEDIGUIDE account and get started.
          </p>
        </div>

        <button className="cta-button">
          Get Started →
        </button>
      </section>

      {/* Disclaimer */}
      <section className="disclaimer">
        <strong>Important:</strong> MEDIGUIDE provides general health
        information and is not a substitute for professional medical
        diagnosis, treatment, or emergency care.
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

export default Home;