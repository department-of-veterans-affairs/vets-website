import React from 'react';
import PropTypes from 'prop-types';
import { LETTER_URL, FORM_TITLE } from '../../constants';
import NeedHelp from '../NeedHelp';

const ConfirmationApproved = ({
  confirmationDate,
  printPage,
  formConfig,
  formData,
}) => {
  return (
    <div className="vt2-confirmation-page vt2-confirmation-page_approved">
      <va-alert status="success">
        <h2 slot="headline">
          Congratulations! You’ve been approved for the VET TEC 2.0 Program
        </h2>
        <p>
          We reviewed your application and have determined that you are eligible
          for educational benefits under the VET TEC 2.0 Program. Your
          Certificate of Eligibility is now available. A physical copy will also
          be mailed to your mailing address. Please be aware that VET TEC 2.0
          has an annual student participation limit (October 1 to September 30).
          You are eligible, but if the participation limit has been met, we may
          not be able to award you benefits in this fiscal year.
        </p>
        <va-button
          href={LETTER_URL}
          download
          text="Download your certificate of eligibility"
          class="vads-u-margin-top--2"
          primary
        />
      </va-alert>

      <div className="vads-u-margin-top--3">
        <h3 className="vads-u-margin-bottom--0">{FORM_TITLE}</h3>

        {confirmationDate && (
          <p>
            <strong>Date received:</strong> {confirmationDate}
          </p>
        )}

        <va-accordion open-single>
          <va-accordion-item header="Information you submitted on this form">
            {formConfig &&
              formData &&
              Object.keys(formConfig.chapters).map(chapterKey => {
                const chapter = formConfig.chapters[chapterKey];
                return (
                  <div key={chapterKey} className="vads-u-margin-bottom--2">
                    <h4>{chapter.title}</h4>
                    {Object.keys(chapter.pages).map(pageKey => {
                      const page = chapter.pages[pageKey];
                      return (
                        <p key={pageKey} className="vads-u-margin-y--0p5">
                          {page.title}
                        </p>
                      );
                    })}
                  </div>
                );
              })}
          </va-accordion-item>
        </va-accordion>

        <h3>Print this confirmation page</h3>
        <p>
          If you’d like to keep a copy of the information on this page, you can
          print it now. You won’t be able to access this page later. Please note
          that an email with this information will be automatically sent to your
          email provided on the application.
        </p>
        <va-button
          text="Print this page for your records"
          onClick={printPage}
        />
      </div>

      <h2>What to expect next</h2>
      <va-process-list>
        <va-process-list-item header="Download your Certificate of Eligibility">
          <p>
            Once you’ve selected a school or program, you may bring your
            Certificate of Eligibility to your School Certifying Official to
            provide proof of eligibility. Please be aware that VET TEC 2.0 has
            an annual student participation limit (October 1 to September 30).
            You are eligible, but if the participation limit has been met, we
            may not be able to award you benefits in this fiscal year.
          </p>
        </va-process-list-item>
        <va-process-list-item header="We'll check the training provider(s) you listed">
          <p>
            If you provided a school, we’ll review whether that school has
            programs currently approved for the VET TEC 2.0 Program. If it
            doesn’t, we’ll reach out to the school to explore if approval can be
            set up.
          </p>
          <p>
            <va-link
              href="/education/gi-bill-comparison-tool/"
              text="Use the GI Bill Comparison Tool"
            />{' '}
            or{' '}
            <va-link
              href="https://www.va.gov/education/about-gi-bill-benefits/post-9-11/approved-programs/"
              text="explore a list of current VA-approved program providers"
              external
            />{' '}
            to find the best education program for you.
          </p>
        </va-process-list-item>
        <va-process-list-item header="We'll keep you updated">
          <ul>
            <li>
              Review and/or update your direct deposit information on your{' '}
              <va-link href="/profile" text="VA.gov profile" />.
            </li>
            <li>
              Learn more about VA benefits and programs through the{' '}
              <va-link
                href="https://www.va.gov/education/"
                text="VA Education and Training Benefits page"
                external
              />
              .
            </li>
          </ul>
        </va-process-list-item>
      </va-process-list>

      <va-additional-info trigger="What is a Certificate of Eligibility?">
        <p>
          A Certificate of Eligibility is an official document from the U.S.
          Department of Veterans Affairs that details your GI Bill benefit
          status. You may provide this official document to your educational
          institution to prove your eligibility status.
        </p>
        <va-link
          href="https://benefits.va.gov/gibill/understandingyourcoe.asp"
          external
          text="Understanding your Certificate of Eligibility"
        />
      </va-additional-info>

      <h2 className="vads-u-margin-top--4">
        How to contact us if you have questions
      </h2>
      <p>
        If you have questions about this form or need help, you can submit a
        request with{' '}
        <va-link
          href="https://www.va.gov/contact-us"
          external
          text="Ask VA (opens in a new tab)"
        />
        .
      </p>

      <va-link-action
        href="/"
        text="Go back to VA.gov homepage"
        type="primary"
        class="vads-u-margin-top--2"
      />

      <div className="vads-u-margin-top--4">
        <h2 className="vads-u-font-size--h3">Need help?</h2>
        <NeedHelp />
      </div>
    </div>
  );
};

ConfirmationApproved.propTypes = {
  confirmationDate: PropTypes.string,
  formConfig: PropTypes.object,
  formData: PropTypes.object,
  printPage: PropTypes.func,
};

export default ConfirmationApproved;
