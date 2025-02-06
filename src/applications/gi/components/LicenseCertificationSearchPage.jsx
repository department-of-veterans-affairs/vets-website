import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import LicenseCertificationSearchForm from '../containers/LicenseCertificationSearchForm';
import { handleLcResultsSearch, updateQueryParam } from '../utils/helpers';

const faqs = [
  {
    question: 'What is the difference between a license and certification?',
    answer: (
      <p className="faq-answer">
        A license is granted by the state or a governing authority; whereas, a
        certification is granted by professional organizations or associations.
      </p>
    ),
  },
  {
    question: 'What will my benefits cover?',
    answer: (
      <p className="faq-answer">
        Part of your entitlement can be used to cover the costs of tests, up to
        \$2000, for a job that requires a license or certification—even if
        you’re already receiving other education benefits. Your benefits will
        only cover tests approved for the GI Bill.
      </p>
    ),
  },
  {
    question:
      'How do I get reimbursed for the licenses, certifications, and prep courses?',
    answer: (
      <>
        <va-link
          text="Find out how to get reimbursed for licenses, certifications and prep courses"
          href="../about-gi-bill-benefits/how-to-use-benefits/licensing-and-certification-tests/" // check link structure
        />
        <br />
        <br />
        <p className="faq-answer">
          Print and fill out form Request for Reimbursement of Licensing or
          Certification Test Fees. Send the completed application to the
          Regional Processing Office for your region listed in the form.
        </p>
        <br />
        <br />
        <va-link
          text="Get VA Form22-0803 to download"
          href="../find-forms/about-form-22-0803/"
        />
      </>
    ),
  },
  {
    question: 'What is a prep course?',
    answer: (
      <p className="faq-answer">
        A preparatory course (prep course) is a course that prepares students
        for success tied to a specific license or certification.
      </p>
    ),
  },
  {
    question: 'Can I get paid to take a test more than once?',
    answer: (
      <p className="faq-answer">
        If you fail a license or certification test, we will pay again. If the
        license or certification expires, you can take it again and we’ll pay
        for the renewal.
      </p>
    ),
  },
];

export default function LicenseCertificationSearchPage({ flag }) {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // create function for reuse
  }, []);

  const handleFaqClick = index => {
    const element = document.getElementById(`faq-${index}`);
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleFaqClick(index);
    }
  };

  const handleSearch = (category, name) => {
    const newParams = {
      category: [category],
      name,
    };

    // preserves category filter option in case user navigates back to this page
    updateQueryParam(history, location, newParams);

    handleLcResultsSearch(history, newParams.category, name, 'all', category);
  };

  const handleReset = callback => {
    history.replace('/lc-search');
    callback?.();
  };

  return (
    <div className="lc-page-wrapper">
      <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
        <div className="row">
          <h1 className="mobile-lg:vads-u-text-align--left">
            Licenses, certifications, and prep courses
          </h1>
          <p className="vads-u-color--gray-dark">
            Use the search tool to find out which tests or related prep courses
            are reimbursable. If you don’t see a test or prep course listed, it
            may be a valid test that’s not yet approved. We encourage you to
            submit an application for reimbursement. We’ll prorate the
            entitlement charges based on the actual amount of the fee charged
            for the test.
            <br />
            <br /> Tests to obtain licenses tend to be state-specific, while
            certifications are valid nationally. Be aware of the requirements
            for the specific license or certification test you’re trying to
            obtain and whether or not it is state-specific.
          </p>
        </div>
        <div className="lc-form-wrapper row">
          <LicenseCertificationSearchForm
            handleSearch={handleSearch}
            location={location}
            handleReset={handleReset}
            flag={flag}
          />
        </div>
        <div className="row">
          <h2 className="vads-u-margin-y--0 vads-u-padding-bottom--2">FAQs</h2>
          <va-accordion open-single>
            {faqs.map((faq, index) => {
              return (
                <va-accordion-item
                  id={`faq-${index}`}
                  header={faq.question}
                  key={index}
                  onClick={() => handleFaqClick(index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                >
                  {faq.answer}
                </va-accordion-item>
              );
            })}
          </va-accordion>
        </div>
      </section>
    </div>
  );
}

LicenseCertificationSearchPage.propTypes = {
  flag: PropTypes.string.isRequired,
};
