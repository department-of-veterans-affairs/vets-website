import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { ROUTES } from '../constants';
import {
  getFirstAccordionHeader,
  getSecondAccordionHeader,
  getThirdAccordionHeader,
  getFourthAccordionHeader,
  getFifthAccordionHeader,
} from '../utilities/results-accordions';
import { getPreviousYear, redirectIfFormIncomplete } from '../utilities/utils';

/**
 * There are two pathways to displaying income ranges on this page
 * Both are mapped in this Mural: https://app.mural.co/t/departmentofveteransaffairs9999/m/departmentofveteransaffairs9999/1683232214853/cfc6da5007d8f99ee0bc83e261e118e7074ffa85?wid=0-1683331066052&sender=ue51e6049230e03c1248b5078)
 * 1) Standard: GMT > NMT
 * 2) Non-standard: GMT < NMT  In some rural areas, the Geographic Means Test is lower than the National Means Test
 */
const Results = ({ dependents, pastMode, results, router, year, zipCode }) => {
  const APPLY_URL = '/health-care/apply-for-health-care-form-10-10ez/';
  const currentYear = new Date().getFullYear();

  const [linkText, setLinkText] = useState('Apply for VA health care');

  useEffect(
    () => {
      redirectIfFormIncomplete(dependents, pastMode, router, year, zipCode);

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      waitForRenderThenFocus('h1');
    },
    [dependents, pastMode, router, year, zipCode],
  );

  if (results) {
    const {
      gmt_threshold: gmt,
      national_threshold: national,
      pension_threshold: pension,
    } = results;

    const isStandard = gmt > national;
    const previousYear = getPreviousYear(pastMode, year);

    const currentFlowCopy = (
      <>
        <p>
          We use your last year&#8217;s household income, minus certain
          deductions, to determine your VA health care eligibility and costs.
          Select your income range to find out how your income may affect your
          eligibility and costs. But remember, the only way to know for sure is
          to apply.
        </p>
        <p>How to estimate your household income range:</p>
        <ul>
          <li>
            Add up all the money your household earned in {previousYear} from
            jobs and other sources. Your household includes you and your spouse
            and dependents if you have them.
          </li>
          <li>
            Then subtract any deductions you had in {previousYear}. You can
            deduct some health care costs you didn&#8217;t get paid back for,
            expenses for your own college or vocational training, and any
            funeral or burial expenses for a spouse or dependent child.
          </li>
        </ul>
      </>
    );

    const pastFlowCopy = (
      <>
        <p>
          We used your previous year&#8217;s household income, minus certain
          deductions, to determine your VA health care eligibility and costs for{' '}
          {year}. Select your income range to find out how your income may have
          affected your eligibility and costs for the year.
        </p>
        <p>How to estimate your household income range:</p>
        <ul>
          <li>
            Add up all the money your household earned in {previousYear} from
            jobs and other sources. Your household includes you and your spouse
            and dependents if you have them.
          </li>
          <li>
            Then subtract any deductions you had in {previousYear}. You can
            deduct some health care costs you didn&#8217;t get paid back for,
            expenses for your own college or vocational training, and any
            funeral or burial expenses for a spouse or dependent child.
          </li>
        </ul>
      </>
    );

    const currentFlowEligibility = `Here's what you may be eligible for:`;
    const pastFlowEligibility = `Here's what you may have been eligible for:`;

    const currentFlowDisclaimer = (
      <p>
        You may not be eligible for VA health care based on your income. But you
        may still be eligible based on factors like your VA disability rating or
        service history.
      </p>
    );

    const pastFlowDisclaimer = (
      <p>
        You may not have been eligible for VA health care based on your income.
        But you may still have been eligible based on factors like your VA
        disability rating or service history.
      </p>
    );

    const applyUrl = <va-link-action href={APPLY_URL} text={linkText} />;

    const handlePrint = () => {
      setLinkText(`Apply for VA health care (https://va.gov${APPLY_URL})`);
      setTimeout(() => {
        window.print();
        setTimeout(() => setLinkText('Apply for VA health care'), 500); // Restore text after printing
      }, 100);
    };

    return (
      <>
        <h1>Your income limits for {year || currentYear}</h1>
        {pastMode && pastFlowCopy}
        {!pastMode && currentFlowCopy}
        <va-link
          external
          href="/resources/va-health-care-income-limits"
          text="Learn more about income limits and deductions"
        />
        <h2>Select your {previousYear} household income range</h2>
        <va-accordion bordered data-testid="il-results" open-single>
          <va-accordion-item
            bordered
            level="3"
            data-testid="il-results-1"
            header={getFirstAccordionHeader(pension)}
          >
            <p>{pastMode ? pastFlowEligibility : currentFlowEligibility}</p>
            <ul>
              <li>
                Free VA health care for most types of care (like outpatient
                primary care, outpatient specialty care, and inpatient hospital
                care)
              </li>
              <li>Free prescription medicines</li>
              <li>
                Travel reimbursement (meaning we&#8217;ll pay you back for the
                cost of travel to and from health care appointments)
              </li>
            </ul>
            {!pastMode && applyUrl}
          </va-accordion-item>
          <va-accordion-item
            bordered
            level="3"
            data-testid="il-results-2"
            header={getSecondAccordionHeader(pension, national)}
          >
            <p>{pastMode ? pastFlowEligibility : currentFlowEligibility}</p>
            <ul>
              <li>
                Free VA health care for most types of care (like primary care,
                outpatient specialty care, and inpatient hospital care)
              </li>
              <li>Prescription medicines with copays</li>
            </ul>
            {!pastMode && applyUrl}
          </va-accordion-item>
          {isStandard && (
            <va-accordion-item
              bordered
              level="3"
              data-testid="il-results-3"
              header={getThirdAccordionHeader(national, gmt)}
            >
              <p>{pastMode ? pastFlowEligibility : currentFlowEligibility}</p>
              <ul>
                <li>
                  VA health care with copays for most types of care (like
                  primary and outpatient specialty care) and reduced copays for
                  inpatient hospital care
                </li>
                <li>Prescription medicines with copays</li>
              </ul>
              {!pastMode && applyUrl}
            </va-accordion-item>
          )}
          <va-accordion-item
            bordered
            level="3"
            data-testid="il-results-4"
            header={getFourthAccordionHeader(national, gmt, isStandard)}
          >
            <p>{pastMode ? pastFlowEligibility : currentFlowEligibility}</p>
            <ul>
              <li>
                VA health care with copays for most types of care (like primary
                care, outpatient specialty care, and inpatient hospital care)
              </li>
              <li>Prescription medicines with copays</li>
            </ul>
            {!pastMode && applyUrl}
          </va-accordion-item>
          <va-accordion-item
            bordered
            level="3"
            data-testid="il-results-5"
            header={getFifthAccordionHeader(national, gmt, isStandard)}
          >
            {pastMode ? pastFlowDisclaimer : currentFlowDisclaimer}
            {!pastMode && (
              <>
                <va-link
                  external
                  href="/health-care/eligibility/"
                  text="Find out if you may be eligible for VA health care"
                />
                <p>
                  We can connect you with mental health care&#8212;no matter
                  your discharge status, service history, or eligibility for VA
                  health care.
                </p>
                <va-link
                  external
                  href="/health-care/health-needs-conditions/mental-health/"
                  text="Find out how to get mental health care"
                />
                <p>You can also explore non-VA health insurance options.</p>
                <va-link
                  external
                  href="https://www.healthcare.gov/"
                  text="Explore health insurance options on the HealthCare.gov website"
                />
              </>
            )}
          </va-accordion-item>
        </va-accordion>
        <va-button
          class="il-print vads-u-margin-top--3"
          data-testid="il-print"
          onClick={handlePrint}
          text="Print this page"
        />
        <va-button
          back
          class="vads-u-margin-top--3"
          data-testid="il-results-back"
          onClick={() => router.push(ROUTES.REVIEW)}
        />
        <h2>More helpful information</h2>
        <ul className="il-results-more-info">
          <li>
            <va-link
              external
              href="/health-care/eligibility/"
              text="Eligibility for VA health care"
            />
          </li>
          <li>
            <va-link
              external
              href="/health-care/copay-rates/"
              text="Current VA health care copay rates"
            />
          </li>
          <li>
            <va-link
              external
              href="/health-care/update-health-information/"
              text="Update your VA health benefits information"
            />
          </li>
          <li>
            <va-link
              external
              href="/health-care/get-reimbursed-for-travel-pay/"
              text="VA travel pay reimbursement"
            />
          </li>
          <li>
            <va-link
              external
              href="/health-care/health-needs-conditions/mental-health/"
              text="VA mental health services"
            />
          </li>
          <li>
            <va-link
              external
              href="/health-care/about-va-health-benefits/"
              text="About VA health benefits"
            />
          </li>
        </ul>
        <h2>What to do if you have more questions</h2>
        <p>
          Call us at{' '}
          <va-telephone
            className="il-results-links"
            contact={CONTACTS['222_VETS']}
          />{' '}
          (
          <va-telephone
            className="il-results-links"
            contact={CONTACTS[711]}
            tty
          />
          ). We&#8217;re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
      </>
    );
  }

  return null;
};

const mapStateToProps = state => ({
  dependents: state?.incomeLimits?.form?.dependents,
  pastMode: state?.incomeLimits?.pastMode,
  results: state?.incomeLimits?.results,
  year: state?.incomeLimits?.form?.year,
  zipCode: state?.incomeLimits?.form?.zipCode,
});

Results.propTypes = {
  dependents: PropTypes.string.isRequired,
  pastMode: PropTypes.bool.isRequired,
  results: PropTypes.shape({
    // eslint-disable-next-line camelcase
    gmt_threshold: PropTypes.number,
    // eslint-disable-next-line camelcase
    national_threshold: PropTypes.number,
    // eslint-disable-next-line camelcase
    pension_threshold: PropTypes.number,
  }).isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  zipCode: PropTypes.string.isRequired,
  year: PropTypes.string,
};

export default connect(mapStateToProps)(Results);
