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
          Print and fill out form Request for Reimbursement of Licensing or
          Certification Test Fees. Send the completed application to the
          Regional Processing Office for your region listed in the form.
        </p>
        <br />
        <br />
        <va-link
          text="Get VA Form22-0803 to download"
          href="https://www.va.gov/find-forms/about-form-22-0803/"
        />
      </>
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
    <>
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
              <div className="vads-u-padding-y--3">{faq.answer}</div>
            </va-accordion-item>
          );
        })}
      </va-accordion>
    </>
  );
}
