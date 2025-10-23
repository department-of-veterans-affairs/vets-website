import React from 'react';

const faqs = [
  {
    question: 'What will my benefits cover?',
    answer: (
      <p className="faq-answer">
        Part of your entitlement can be used to cover the costs of tests, up to
        $2000, for a job that requires a license or certification—even if you’re
        already receiving other education benefits. Your benefits will only
        cover tests approved for the GI Bill.
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
          href="https://www.va.gov/education/about-gi-bill-benefits/how-to-use-benefits/licensing-and-certification-tests/"
        />
        <br />
        <br />
        <p className="faq-answer">
          For license or certification tests print and fill out form Request for
          Reimbursement of Licensing or Certification Test Fees after you’ve
          taken the test. Send the completed application to the Regional
          Processing Office for your region listed in the form.{' '}
          <va-link
            text="Get VA Form 22-0803 to download."
            href="https://www.va.gov/find-forms/about-form-22-0803/"
          />
        </p>
        <br />
        <br />
        <p className="faq-answer">
          For prep courses, print and fill out form Request for Reimbursement of
          Preparatory (Prep) Course for Licensing or Certification Test after
          you’ve taken the test. Send the completed application to the Regional
          Processing Office for your region listed in the form.{' '}
          <va-link
            text="Get VA Form 22-10272 to download."
            href="https://www.va.gov/find-forms/about-form-22-10272/"
          />
        </p>
      </>
    ),
  },
  {
    question: 'Can I get paid to take a test more than once?',
    answer: (
      <>
        <p className="faq-answer">
          If you fail a license or certification test, we will pay again. If the
          license or certification expires, you can take it again and we’ll pay
          for the renewal.
        </p>
        <br />
        <br />
        <p className="faq-answer">
          There is no limit on the number of tests taken, including repeated
          tests, except for remaining entitlement and delimiting (expiration)
          date of your benefits. For a beneficiary with less than one month
          entitlement remaining the payment may be adjusted based on the number
          of days remaining entitlement.
        </p>
      </>
    ),
  },
  {
    question:
      'How do I apply for a license, certification, or prep course to be approved?',
    answer: (
      <>
        <p className="faq-answer">
          If you don’t see a test or prep course listed, it may be a valid test
          that’s not yet approved.
        </p>
        <br />
        <br />
        <p className="faq-answer">
          For license or certification, take the test, then apply for approval
          by submitting VA Form 22-0803.{' '}
          <va-link
            text="Get VA Form 22-0803 to download."
            href="https://www.va.gov/find-forms/about-form-22-0803/"
          />{' '}
          For prep course, take the course, then apply for approval by
          submitting VA Form 22-10272.{' '}
          <va-link
            text="Get VA Form 22-10272 to download."
            href="https://www.va.gov/find-forms/about-form-22-10272/"
          />
        </p>
      </>
    ),
  },
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
    question: 'What is a prep course?',
    answer: (
      <p className="faq-answer">
        A preparatory course (prep course) is a course that prepares students
        for success tied to a specific license or certification.
      </p>
    ),
  },
];

export default function LicenseCertificationFaq() {
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

  return (
    <div className="usa-width-two-thirds">
      <h2 className="vads-u-margin-y--0 vads-u-padding-bottom--2">FAQs</h2>
      <va-accordion open-single class="">
        {faqs.map((faq, index) => {
          return (
            <va-accordion-item
              id={`faq-${index}`}
              header={faq.question}
              key={index}
              onClick={() => handleFaqClick(index)}
              onKeyDown={e => handleKeyDown(e, index)}
            >
              <div className="vads-u-padding-bottom--2p5 vads-u-padding-top--1">
                {faq.answer}
              </div>
            </va-accordion-item>
          );
        })}
      </va-accordion>
    </div>
  );
}
