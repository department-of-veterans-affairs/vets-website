import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import recordEvent from 'platform/monitoring/record-event';

const StemDeniedDetails = ({
  deniedAt,
  isEnrolledStem,
  isPursuingTeachingCert,
}) => {
  const date = moment(deniedAt).format('MMM D, YYYY');

  const recordResourceLinkClick = (header, section) => {
    recordEvent({
      event: 'nav-linkslist',
      'links-list-section-header': section,
      'links-list-header': header,
    });
  };

  return (
    <>
      <h1>Your Edith Nourse Rogers STEM Scholarship application</h1>
      <div className="vads-u-background-color--primary-alt-lightest vads-u-padding--2 vads-u-margin-bottom--3">
        <h2 className="claims-alert-header vads-u-font-size--h4">
          Your application was denied on {date}
        </h2>
      </div>
      <p className="va-introtext">
        You must meet all 3 of the eligibility criteria to be considered for the
        Rogers STEM Scholarship.
      </p>
      <h3 className="vads-u-font-family--sans vads-u-margin-bottom--1">
        You didn’t meet the following criteria for the Rogers STEM Scholarship:
      </h3>
      <ul className="stem-ad-list">
        <li className="stem-ad-list-item">
          You didn’t meet the benefit requirements for the Rogers STEM
          Scholarship.
          <ul className="stem-ad-list-secondary">
            <li className="stem-ad-list-item">
              According to your service and school data records on file, as of{' '}
              {date}, you have more than 6 months of Post-9/11 GI Bill (Chapter
              33) benefits remaining.
            </li>
            <li className="stem-ad-list-item">
              By law, all Rogers STEM Scholarship recipients must have 6 months
              or less of Post-9/11 GI Bill (Chapter 33) benefits left (38 U.S.
              Code § 3320).
            </li>
          </ul>
        </li>
      </ul>
      <h3 className="vads-u-font-family--sans vads-u-margin-bottom--1">
        You met these criteria for the Rogers STEM Scholarship:
      </h3>
      <ul className="stem-ad-list">
        <li className="stem-ad-list-item">
          You’re eligible for Post-9/11 GI Bill benefits.
          <ul className="stem-ad-list-secondary">
            <li className="stem-ad-list-item">
              According to your service and school data records on file, as of{' '}
              {date}, you’re eligible for Post-9/11 GI Bill benefits.
            </li>
            <li className="stem-ad-list-item">
              By law, all Rogers STEM scholarship recipients must be eligible
              for Post-9/11 GI Bill (Chapter 33) benefits. (38 U.S. Code §
              3320).
            </li>
          </ul>
        </li>
        {(isEnrolledStem || isPursuingTeachingCert) && (
          <li>
            You meet the degree requirements for the Rogers STEM Scholarship.
            <ul className="stem-ad-list-secondary">
              <li className="stem-ad-list-item">
                You meet the degree requirements because you answered "Yes" to
                one of these questions on the Rogers STEM Scholarship
                application.
                <ul>
                  <li>
                    "Are you enrolled in a science, technology, engineering, or
                    math (STEM) degree program?" or
                  </li>
                  <li>
                    "Do you have a STEM undergraduate degree and are now
                    pursuing a teaching certification?"
                  </li>
                </ul>
              </li>
              <li className="stem-ad-list-item">
                By law, all Rogers STEM Scholarship recipients must either:
                <ol>
                  <li>
                    Be enrolled in an eligible STEM undergraduate degree,{' '}
                    <strong>or</strong>
                  </li>
                  <li>
                    Have an eligible STEM undergraduate degree and be pursuing a
                    teaching degree
                  </li>
                </ol>
              </li>
            </ul>
          </li>
        )}
      </ul>
      <h3 className="vads-u-font-family--sans">
        What should I do if I disagree with your decision?
      </h3>
      <p>
        If you disagree with our decision, you have 1 year from the date of this
        decision to request a decision review or appeal. You have 3 options to
        do this:
      </p>
      <ul className="stem-ad-list">
        <li className="stem-ad-list-item">
          If you have new or previously unprovided evidence to prove your
          eligibility for this scholarship, you can file a Supplemental Claim by
          completing VA Form 20-0995.{' '}
          <VaLink
            external
            href="https://www.vba.va.gov/pubs/forms/VBA-20-0995-ARE.pdf"
            aria-label="Download VA Form 20 - 0 9 9 5. Opens in new browser tab."
            target="_blank"
            text="Download VA Form 20-0995"
          />
          .
        </li>
        <li className="stem-ad-list-item">
          If you don’t have new evidence but would like a more senior reviewer
          to look at your case, you can request a Higher-Level Review by
          completing VA Form 20-0996.{' '}
          <VaLink
            external
            href="https://www.vba.va.gov/pubs/forms/VBA-20-0996-ARE.pdf"
            aria-label="Download VA Form 20 - 0 9 9 6. Opens in new browser tab."
            target="_blank"
            text="Download VA Form 20-0996"
          />
          .
        </li>
        <li className="stem-ad-list-item">
          If you filed a Supplemental Claim or Higher-Level Review and don’t
          agree with the decision, you can appeal to a Veterans Law Judge by
          completing VA Form 10182.{' '}
          <VaLink
            external
            href="https://www.va.gov/vaforms/va/pdf/VA10182.pdf"
            aria-label="Download VA Form 1 0 1 8 2. Opens in new browser tab."
            target="_blank"
            text="Download VA Form 10182"
          />
          .
        </li>
      </ul>
      <p>
        For more information about these options, please read "Your Right to
        Seek Review of Our Decision" (VA Form 20-0998).{' '}
        <VaLink
          external
          href="https://www.vba.va.gov/pubs/forms/VBA-20-0998-ARE.pdf"
          aria-label="Download Your Right to Seek Review of Our Decision VA Form 20 - 0 9 9 8. Opens in new browser tab"
          target="_blank"
          text="Download VA Form 20-0998"
        />
        .
      </p>
      <p>
        You can also contact us at <va-telephone contact={CONTACTS.GI_BILL} />
        to request any of these forms.
      </p>
      <p>
        <VaLink
          href="https://www.va.gov/decision-reviews"
          text="Learn more about the decision review process."
        />{' '}
        If you would like to review the evidence we used in our decision, please
        contact us. You may be able to review some evidence by signing in to
        your <VaLink href="https://www.va.gov/" text="VA.gov" /> account.
      </p>
      <div className="vads-u-background-color--gray-lightest vads-u-padding-x--2 vads-u-padding-top--1px vads-u-padding-bottom--2p5 vads-u-margin-top--3 vads-u-margin-bottom--5">
        <h3 className="vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-padding-top--2 vads-u-padding-bottom--0p5 vads-u-margin--0">
          More resources about VA benefits
        </h3>
        <VaLink
          data-testid="edith-north-rodgers-stem-link"
          href="https://www.va.gov/education/other-va-education-benefits/stem-scholarship/"
          onClick={() => {
            recordResourceLinkClick(
              'More resources about VA benefits',
              'Learn more about eligibility and how to apply for this scholarship.',
            );
          }}
          className="vads-u-margin-top--3 vads-u-margin-bottom--1 vads-u-display--inline-block va-nav-linkslist-title vads-u-font-size--h4 vads-u-font-weight--bold vads-u-font-family--serif vads-u-text-decoration--none"
          text="Edith Nourse Rogers STEM Scholarship"
        />
        <p className="vads-u-margin--0 vads-u-color--base">
          Learn more about eligibility and how to apply for this scholarship.
        </p>
        <VaLink
          data-testid="find-va-form-link"
          href="https://www.va.gov/vaforms"
          onClick={() => {
            recordResourceLinkClick('Find a VA Form', 'Search for a VA form.');
          }}
          className="vads-u-margin-top--3 vads-u-margin-bottom--1 vads-u-display--inline-block va-nav-linkslist-title vads-u-font-size--h4 vads-u-font-weight--bold vads-u-font-family--serif vads-u-text-decoration--none"
          text="Find a VA Form"
        />
        <p className="vads-u-margin--0 vads-u-color--base">
          Search for a VA form.
        </p>
        <VaLink
          data-testid="gi-bill-comp-tool-link"
          href="https://www.va.gov/education/gi-bill-comparison-tool"
          onClick={() => {
            recordResourceLinkClick(
              'GI Bill® Comparison Tool',
              'Get information on a school’s value and affordability; and compare estimated benefits by school.',
            );
          }}
          className="vads-u-margin-top--3 vads-u-margin-bottom--1 vads-u-display--inline-block va-nav-linkslist-title vads-u-font-size--h4 vads-u-font-weight--bold vads-u-font-family--serif vads-u-text-decoration--none"
          text="GI Bill® Comparison Tool"
        />
        <p className="vads-u-margin--0 vads-u-color--base">
          Get information on a school’s value and affordability; and compare
          estimated benefits by school.
        </p>
      </div>
    </>
  );
};

StemDeniedDetails.propTypes = {
  deniedAt: PropTypes.string,
  isEnrolledStem: PropTypes.bool,
  isPursuingTeachingCert: PropTypes.bool,
};

export default StemDeniedDetails;
