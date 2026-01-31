import React from 'react';

export default function FindAPathAccordionItem() {
  return (
    <va-accordion-item header="2. Find a Path" open bordered>
      <ul className="va-nav-linkslist-list vads-u-margin-bottom--3">
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link
              href="https://www.youtube.com/watch?v=49eWvGitLPw"
              text="Orientation Video"
              external
            />
          </h3>
          <p className="va-nav-linkslist-description">
            Learn more about the 5 tracks that you can use in VR&E.
          </p>
        </li>
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link
              href="https://www.careeronestop.org/ExploreCareers/Learn/self-employment.aspx?secondaryNavPanels=Ag%3D%3D"
              text="Employment Options"
              external
            />
          </h3>
          <p className="va-nav-linkslist-description">
            Return to your last employer, find a transferable skills occupation,
            self-employment, or training for a new employment.
          </p>
        </li>
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link
              href="https://www.careeronestop.org/Toolkit/Training/find-local-training.aspx"
              text="Location Training Finder"
              external
            />
          </h3>
          <p className="va-nav-linkslist-description">
            Search for training programs, schools, and education opportunities
            available near your location or in areas where you’d like to train.
          </p>
        </li>
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link
              href="https://www.careeronestop.org/Toolkit/Training/find-certifications.aspx"
              text="Certification Finder"
              external
            />
          </h3>
          <p className="va-nav-linkslist-description">
            Explore certifications available for your chosen field and
            understand requirements, cost, and career relevance.
          </p>
        </li>
      </ul>
    </va-accordion-item>
  );
}
