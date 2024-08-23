// Node modules.
import React from 'react';

// export const YellowRibbonSection = ({ school, onYellowRibbonSectionClick }) => (
export const YellowRibbonSection = () => (
  <li className="usa-unstyled-list vads-l-col vads-u-margin-bottom--2 vads-u-padding-x--2 vads-u-padding-y--2 vads-u-background-color--gray-light-alt">
    {/* School Name */}
    <dl className="vads-u-margin--0">
      <dt className="sr-only">School name:</dt>
      <dd
        className="vads-u-font-size--h3 vads-u-font-weight--bold vads-u-font-family--serif vads-u-margin--0"
        data-e2e-id="result-title"
      >
        <h3 className="vads-u-margin--0">University of Phasellus ligula </h3>
        {/* <h3 className="vads-u-margin--0">{deriveNameLabel(school)}</h3> */}
      </dd>

      {/* School Location */}
      <dt className="sr-only">School location</dt>
      {/* <dd className="vads-u-margin-bottom--1 vads-u-margin-top--0">
        {deriveLocationLabel(school)}
      </dd> */}
      <dd className="vads-u-margin-bottom--1 vads-u-margin-top--0">
        Aliquam est mauris
      </dd>
    </dl>

    <div className="vads-l-row vads-u-margin-top--2">
      <div className="vads-l-col--12 vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--space-between medium-screen:vads-l-col--6">
        {/* Max Contribution Amount */}
        <div className="vads-u-col">
          <dl className="vads-u-margin--0">
            <dt className="vads-u-font-weight--bold vads-u-font-family--sans vads-u-font-size--h5 vads-u-margin--0">
              Maximum Yellow Ribbon funding amount
              <br />
              (per student, per year)
              <dfn className="sr-only">:</dfn>
            </dt>
            <dd>$17,000</dd>
            {/* <dd>{deriveMaxAmountLabel(school)}</dd> */}
          </dl>
        </div>

        {/* Student Count */}
        <dl className="vads-u-margin--0">
          <dt className="vads-u-font-weight--bold vads-u-font-family--sans vads-u-font-size--h5 vads-u-margin-top--2 vads-u-margin-bottom--0">
            Funding available for
            <dfn className="sr-only">:</dfn>
          </dt>
          <dd>75 students</dd>
          {/* <dd>{deriveEligibleStudentsLabel(school)}</dd> */}

          {/* School Website */}
          <dt className="vads-u-font-weight--bold vads-u-font-family--sans vads-u-font-size--h5 vads-u-margin-top--2 vads-u-margin-bottom--0">
            School website
            <dfn className="sr-only">:</dfn>
          </dt>
          <dd>google.com</dd>
          {/* <dd>{deriveInstURLLabel(school, onYellowRibbonSectionClick)}</dd> */}
        </dl>
      </div>

      <div className="vads-l-col--12 medium-screen:vads-l-col--6 medium-screen:vads-u-padding-left--2">
        <dl className="vads-u-margin--0">
          {/* Degree Level */}
          <dt className="vads-u-font-weight--bold vads-u-margin-top--2 vads-u-margin-bottom--0 vads-u-font-family--sans vads-u-font-size--h5 medium-screen:vads-u-margin--0">
            Degree type
            <dfn className="sr-only">:</dfn>
          </dt>
          <dd>Undergraduate</dd>
          {/* <dd>{deriveDegreeLevel(school)}</dd> */}

          {/* Division Professional School */}
          <dt className="school-program vads-u-font-weight--bold vads-u-margin-top--2 vads-u-margin-bottom--0 vads-u-font-family--sans vads-u-font-size--h5 medium-screen:vads-u-margin-bottom--0">
            School or program
            <dfn className="sr-only">:</dfn>
          </dt>
          <dd>All</dd>
          {/* <dd>{deriveDivisionProfessionalSchool(school)}</dd> */}
        </dl>
      </div>
    </div>
  </li>
);

export default YellowRibbonSection;
