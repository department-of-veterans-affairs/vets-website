import React from 'react';

const RatedDisabilitiesSidebar = () => (
  <div className="medium-screen:vads-u-padding-left--4">
    <h3 className="vads-u-padding-bottom--1p5 vads-u-border-bottom--3px vads-u-border-color--primary">
      How did I get this rating?
    </h3>
    <p>
      Your total disability rating is based on evidence you provide, the results
      of your VA claim exam, and information from other sources, like federal
      agencies.
    </p>
    <a
      href="https://www.youtube.com/watch?v=oM7oYzL2DCg"
      aria-label="Compensation 101: How did I get this rating (YouTube)"
      target="_blank"
      rel="noopener noreferrer"
      title="view information on how you recieved the rating you did on YouTube"
    >
      Compensation 101: How did I get this rating (YouTube)
    </a>
    <h3 className="vads-u-padding-bottom--1p5 vads-u-border-bottom--3px vads-u-border-color--primary">
      Learn about VA disability ratings
    </h3>
    <p>
      To learn how we determined your VA combined disability rating, use our
      disability rating calculator and ratings table.
    </p>
    <a
      href="/disability/about-disability-ratings/"
      aria-label="About VA disability ratings"
    >
      About VA disability ratings
    </a>
    <h3 className="vads-u-padding-bottom--1p5 vads-u-border-bottom--3px vads-u-border-color--primary">
      What if I have questions?
    </h3>
    <p>
      You can call us at
      <a
        className="vads-u-margin-left--0p5"
        href="tel:8008271000"
        aria-label="800. 8 2 7. 1 0 0 0."
        title="Dial the telephone number 800-827-1000"
      >
        800-827-1000
      </a>
      . We're here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
    </p>
  </div>
);

export default RatedDisabilitiesSidebar;
