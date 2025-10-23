import React from 'react';
import PropTypes from 'prop-types';

import DownloadLink from '../components/DownloadLink';

export const SummaryTitle = () => <h3>Summary of additional benefits</h3>;

const houseAssistanceContent = (
  <va-accordion-item bordered uswds>
    <h4 slot="headline">Adapted housing assistance</h4>
    <p>
      To apply for an adapted housing grant, you’ll need to fill out an
      Application in Acquiring Specially Adapted Housing or Special Home
      Adaptation Grant (VA Form 26-4555).
    </p>
    <p>
      <DownloadLink
        url="https://www.vba.va.gov/pubs/forms/vba-26-4555-are.pdf"
        content="Download VA Form 26-4555"
        size="0.8"
      />
      .
    </p>
  </va-accordion-item>
);

const carAssistanceContent = (
  <va-accordion-item bordered uswds>
    <h4 slot="headline">Automobile allowance</h4>
    <p>
      To apply for a one-time payment to help you buy a specially equipped
      vehicle, you’ll need to fill out an Application for Automobile or Other
      Conveyance and Adaptive Equipment (VA Form 21-4502).
    </p>
    <p>
      <DownloadLink
        url="https://www.vba.va.gov/pubs/forms/VBA-21-4502-ARE.pdf"
        content="Download VA Form 21-4502"
        size="2.7"
      />
      .
    </p>
    <p>
      To apply for an adaptive equipment grant, you’ll need to fill out an
      Application for Adaptive Equipment-Motor Vehicle (VA Form 10-1394).
    </p>
    <p>
      <DownloadLink
        url="https://www.va.gov/vaforms/medical/pdf/10-1394-fill.pdf"
        content="Download VA Form 10-1394"
        size="0.7"
      />
      .
    </p>
  </va-accordion-item>
);

const aidAndAttendanceContent = (
  <va-accordion-item bordered uswds>
    <h4 slot="headline">Aid and Attendance</h4>
    <p>
      To apply for Aid and Attendance benefits, your doctor needs to fill out an
      Examination for Housebound Status or Permanent Need for Regular Aid and
      Attendance (VA Form 21-2680). You can submit this form once it’s
      completed.
    </p>
    <p>
      <DownloadLink
        url="https://www.vba.va.gov/pubs/forms/VBA-21-2680-ARE.pdf"
        content="Download VA Form 21-2680"
        size="1.5"
      />
      .
    </p>
  </va-accordion-item>
);

const individualUnemployabilityContent = (
  <va-accordion-item bordered uswds>
    <h4 slot="headline">Individual Unemployability</h4>
    <p>
      To file a claim for Individual Unemployability, you’ll need to fill out:
    </p>
    <ul>
      <li>
        A Veteran’s Application for Increased Compensation Based on
        Unemployability (VA Form 21-8940)
        <p>
          <DownloadLink
            url="https://www.vba.va.gov/pubs/forms/vba-21-8940-are.pdf"
            content="Download VA Form 21-8940"
            size="1.6"
          />
          , <strong>and</strong>
        </p>
      </li>
      <li>
        A Request for Employment Information in Connection with Claim for
        Disability Benefits (VA Form 21-4192)
        <p>
          <DownloadLink
            url="https://www.vba.va.gov/pubs/forms/VBA-21-4192-ARE.pdf"
            content="Download VA Form 21-4192"
            size="2"
          />
          .
        </p>
      </li>
    </ul>
  </va-accordion-item>
);

export const SummaryDescription = ({ formData }) => {
  // In production, users should see the unemployable content if they indicate
  // that they're unemployable. In other environments, they should see the
  // unemployable content only when indicate unemployability and no selection
  // has been made for `view:unemployabilityUploadChoice` (selecting any
  // option for that question will evaluate to true because all the answers
  // are strings). Since `view:unemployabilityUploadChoice` is only a question
  // in non-prod environments, it will always be `falsey` on prod
  const showUnemployableContent =
    formData['view:unemployable'] &&
    !formData['view:unemployabilityUploadChoice'];

  return (
    <>
      <p>
        Based on what you told us, you may be eligible for these additional
        disability benefits.
      </p>
      <va-accordion bordered uswds>
        {formData['view:modifyingHome'] && houseAssistanceContent}
        {formData['view:modifyingCar'] && carAssistanceContent}
        {formData['view:aidAndAttendance'] && aidAndAttendanceContent}
        {showUnemployableContent && individualUnemployabilityContent}
      </va-accordion>
    </>
  );
};

SummaryDescription.propTypes = {
  formData: PropTypes.shape({
    'view:aidAndAttendance': PropTypes.bool,
    'view:modifyingCar': PropTypes.bool,
    'view:modifyingHome': PropTypes.bool,
    'view:unemployabilityUploadChoice': PropTypes.string,
    'view:unemployable': PropTypes.bool,
  }),
};
