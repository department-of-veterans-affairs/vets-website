import React from 'react';
import PropTypes from 'prop-types';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

const ReviewPage = ({ onNext }) => (
  <div>
    <FormTitle
      title="File for disability compensation"
      subTitle="VA Form 21-526EZ"
    />

    <va-segmented-progress-bar current="6" total="6" label="Review" />

    <va-accordion bordered>
      <va-accordion-item header="Review Veteran details" />
      <va-accordion-item header="Conditions" />
      <va-accordion-item header="Mental health statement" />
      <va-accordion-item header="Supporting evidence" />
      <va-accordion-item header="Additional information" />
    </va-accordion>

    <p className="vads-u-margin-top--3">
      <strong>Note:</strong> According to federal law, there are criminal
      penalties, including a fine and/or imprisonment for up to 5 years, for
      withholding information or for providing incorrect information (Reference:
      18 U.S.C. 1001).
    </p>

    <section
      aria-labelledby="statement-of-truth-heading"
      className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-top--3 vads-u-radius--large"
    >
      <h2 id="statement-of-truth-heading" className="vads-u-margin-top--0">
        Statement of truth
      </h2>

      <p>
        I confirm that the identifying information in this form is accurate and
        has been represented correctly.
      </p>
      <p>
        I have read and accept the
        <va-link href="#" text="privacy policy (opens in a new tab)" />.
      </p>

      <va-text-input
        label="Your full name"
        required
        error=""
        value="Leslie Jackson"
      />

      <va-checkbox
        class="vads-u-margin-top--2"
        label="I certify that the information above is correct and true to the best of my knowledge and belief. (*Required)"
        required
      />
    </section>

    <va-alert status="success" class="vads-u-margin-top--3">
      <p className="vads-u-margin--0">
        We’ve saved your request. We saved it on August 27, 2025 at 5:25 p.m.
        ET. Your request ID number is 15428.
      </p>
    </va-alert>

    <div className="vads-u-margin-top--4">
      <p>This is the simplified review page for the static demo.</p>
      <va-button onClick={onNext} text="Submit and go to confirmation" />

      {/* <va-button-pair
        continue
        onPrimaryClick={() => {}}
        onSecondaryClick={() => {}}
        rightButtonText="Submit application"
      /> */}
    </div>

    <div className="vads-u-margin-top--4">
      <va-need-help>
        <div slot="content">
          <p>
            If you have questions or need help filling out this form, please
            call us at <va-telephone contact="8008271000" />. We’re here Monday
            through Friday, 8:00 a.m to 9:00 p.m ET.
          </p>
          <p>
            If you have hearing loss, call <va-telephone contact="711" tty />.
          </p>
        </div>
      </va-need-help>
      <br />
    </div>
  </div>
);

ReviewPage.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default ReviewPage;
