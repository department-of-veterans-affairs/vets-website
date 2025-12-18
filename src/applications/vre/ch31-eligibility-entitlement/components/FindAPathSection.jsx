import React from 'react';

export default function FindAPathSection() {
  return (
    <>
      <h2 className="va-nav-linkslist-heading vads-u-margin-top--1 vads-u-margin-bottom--0">
        2. Find a Path
      </h2>
      <ul className="va-nav-linkslist-list">
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link href="https://www.va.gov" text="Orientation Video" />
          </h3>
          <p className="va-nav-linkslist-description">
            Learn more about the 5 tracks that you can use in VR&E.
          </p>
        </li>
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link href="https://www.va.gov" text="Employment Options" />
          </h3>
          <p className="va-nav-linkslist-description">
            Return to your last employer, find a transferable skills occupation,
            self-employment, or training for a new employment.
          </p>
        </li>
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link
              href="https://www.va.gov"
              text="Location Training Finder"
            />
          </h3>
          <p className="va-nav-linkslist-description">
            Search for training programs, schools, and education opportunities
            available near your location or in areas where you’d like to train.
          </p>
        </li>
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link href="https://www.va.gov" text="Certification Finder" />
          </h3>
          <p className="va-nav-linkslist-description">
            Explore certifications available for your chosen field and
            understand requirements, cost, and career relevance.
          </p>
        </li>
      </ul>
    </>
  );
}
