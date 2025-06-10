import React, { useEffect } from 'react';

const Hero = title => {
  useEffect(
    () => {
      document.title = title.title;
    },
    [title],
  );
  return (
    <section className="home">
      <div className="home__hero">
        <div className="home__hero-container">
          <div className="home__hero-bg">
            <h1
              className="home__hero-header"
              data-testid="landing-page-heading"
            >
              Welcome to the Accredited Representative Portal
            </h1>
            <p
              className="home__hero-sub-header"
              data-testid="landing-page-hero-text"
            >
              A secure, user-friendly system that streamlines the power of
              attorney and claims process for representatives and the Veterans
              they support
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
