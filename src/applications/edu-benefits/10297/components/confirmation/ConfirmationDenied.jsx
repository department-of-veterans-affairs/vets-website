import React from 'react';
import PropTypes from 'prop-types';
import { LETTER_URL, FORM_TITLE } from '../../constants';
import NeedHelp from '../NeedHelp';

const ConfirmationDenied = ({
  confirmationDate,
  printPage,
  formConfig,
  formData,
}) => {
  return (
    <div className="vt2-confirmation-page vt2-confirmation-page_denied">
      <va-alert status="info">
        <h2 slot="headline">You’re not eligible for this benefit</h2>
        <p>
          Unfortunately, based on the information you provided and Department of
          Defense records, we have determined you are not eligible for the VET
          TEC 2.0 Program at this time.
        </p>
        <p>
          Your denial letter, which explains why you are ineligible, is now
          available. A physical copy will also be mailed to your mailing
          address.
        </p>
        <va-button
          href={LETTER_URL}
          download
          text="Download your letter"
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
      <ul>
        <li>
          We will review your eligibility for other VA education benefit
          programs.
        </li>
        <li>
          You will be notified if you are eligible for other VA education
          benefits.
        </li>
        <li>There is no further action required by you at this time.</li>
      </ul>

      <h3>If you believe this decision is incorrect</h3>
      <p>
        If you need help with your application or have questions about
        enrollment or eligibility, please contact{' '}
        <va-link href="https://ask.va.gov/" external text="Ask VA" />.
      </p>

      <div className="vads-u-margin-top--4">
        <h2>Need help?</h2>
        <NeedHelp />
      </div>

      <h2>How to contact us if you have questions</h2>
      <p>
        If you have questions about this form or need help, you can submit a
        request with{' '}
        <va-link href="https://www.va.gov/contact-us" external text="Ask VA" />.
      </p>

      <va-link-action
        href="/"
        text="Go back to VA.gov homepage"
        type="primary"
        class="vads-u-margin-top--2"
      />
    </div>
  );
};

ConfirmationDenied.propTypes = {
  confirmationDate: PropTypes.string,
  formConfig: PropTypes.object,
  formData: PropTypes.object,
  printPage: PropTypes.func,
};

export default ConfirmationDenied;
