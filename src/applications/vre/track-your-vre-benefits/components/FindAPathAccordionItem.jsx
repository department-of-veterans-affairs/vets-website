import React from 'react';

export default function FindAPathAccordionItem() {
  return (
    <va-accordion-item header="2. Find a Path" open bordered>
      <ul className="va-nav-linkslist-list vads-u-margin-bottom--3">
        <li className="vads-u-border-bottom--2px vads-u-border-color--gray-light vads-u-padding-bottom--2 vads-u-margin-bottom--4">
          <p className="va-nav-linkslist-description">
            Learn more about the 5 tracks available in the Vocational
            Rehabilitation and Employment (VR&E) program.
          </p>
          <p className="va-nav-linkslist-description vads-u-margin-top--2 vads-u-font-weight--bold">
            <va-link
              href="https://www.youtube.com/watch?v=49eWvGitLPw"
              text="View Orientation Video on YouTube website"
              external
            />
          </p>
        </li>
        <li className="vads-u-border-bottom--2px vads-u-border-color--gray-light vads-u-padding-bottom--2 vads-u-margin-bottom--4">
          <p className="va-nav-linkslist-description">
            Explore options such as returning to your last employer, finding a
            transferable skills occupation, self-employment, or training for new
            employment.
          </p>
          <p className="va-nav-linkslist-description vads-u-margin-top--2 vads-u-font-weight--bold">
            <va-link
              href="https://www.careeronestop.org/ExploreCareers/Learn/self-employment.aspx?secondaryNavPanels=Ag%3D%3D"
              text="View Employment Options on Career One Stop website"
              external
            />
          </p>
        </li>
        <li className="vads-u-border-bottom--2px vads-u-border-color--gray-light vads-u-padding-bottom--2 vads-u-margin-bottom--4">
          <p className="va-nav-linkslist-description">
            Search for training programs, schools, and educational opportunities
            available near your location or in areas where you'd like to train.
          </p>
          <p className="va-nav-linkslist-description vads-u-margin-top--2 vads-u-font-weight--bold">
            <va-link
              href="https://www.careeronestop.org/Toolkit/Training/find-local-training.aspx"
              text="View Location Training Finder on Career One Stop website"
              external
            />
          </p>
        </li>
        <li>
          <p className="va-nav-linkslist-description">
            Explore available certifications for your chosen field and
            understand the requirements, costs, and career relevance.
          </p>
          <p className="va-nav-linkslist-description vads-u-margin-top--2 vads-u-font-weight--bold">
            <va-link
              href="https://www.careeronestop.org/Toolkit/Training/find-certifications.aspx"
              text="View Certification Finder on Career One Stop website"
              external
            />
          </p>
        </li>
      </ul>
    </va-accordion-item>
  );
}
