import React from 'react';
import CollapsiblePanel from '@department-of-veterans-affairs/formation/CollapsiblePanel';

const houseAssistanceContent = (
  <CollapsiblePanel panelName="Adapted housing assistance">
    <p>
      To apply for an adapted housing grant, you’ll need to fill out an
      Application in Acquiring Specially Adapted Housing or Special Home
      Adaptation Grant (VA Form 26-4555).
    </p>
    <p>
      <a href="https://www.vba.va.gov/pubs/forms/vba-26-4555-are.pdf">
        Download VA Form 26-4555
      </a>
      .
    </p>
  </CollapsiblePanel>
);

const carAssistanceContent = (
  <CollapsiblePanel panelName="Automobile allowance">
    <p>
      To file a claim for a one-time payment to help you buy a specially
      equipped vehicle, you’ll need to fill out an Application for Automobile or
      Other Conveyance and Adaptive Equipment (VA Form 21-4502).
      <div>
        <a href="https://www.vba.va.gov/pubs/forms/VBA-21-4502-ARE.pdf">
          Download VA Form 21-4502
        </a>
        .
      </div>
    </p>
    <p>
      To file a claim for adaptive equipment, you’ll need to fill out an
      Application for Adaptive Equipment—Motor Vehicle (VA Form 10-1394).
      <div>
        <a href="https://www.va.gov/vaforms/medical/pdf/10-1394-fill.pdf">
          Download VA Form 10-1394.
        </a>
      </div>
    </p>
  </CollapsiblePanel>
);

const aidAndAttendanceContent = (
  <CollapsiblePanel panelName="Aid and Attendance">
    <p>
      To apply for Aid and Attendance benefits, you’ll need to turn in an
      Examination for Housebound Status or Permanent Need for Regular Aid and
      Attendance (VA Form 21-2680), which your doctor needs to fill out.
    </p>
    <div>
      <a href="https://www.vba.va.gov/pubs/forms/VBA-21-2680-ARE.pdf">
        Download VA Form 21-2680
      </a>
      .
    </div>
  </CollapsiblePanel>
);

const individualUnemployabilityContent = (
  <CollapsiblePanel panelName="Individual Unemployability">
    <p>
      To file a claim for Individual Unemployability, you’ll need to fill out:
    </p>
    <ul>
      <li>
        A Veteran’s Application for Increased Compensation Based on
        Unemployability (VA Form 21-8940)
        <div>
          <a href="https://www.vba.va.gov/pubs/forms/vba-21-8940-are.pdf">
            Download VA Form 21-8940
          </a>
          , <strong>and</strong>
        </div>
      </li>
      <li>
        A Request for Employment Information in Connection with Claim for
        Disability Benefits (VA Form 21-4192)
        <div>
          <a href="https://www.vba.va.gov/pubs/forms/VBA-21-4192-ARE.pdf">
            Download VA Form 21-4192
          </a>
          .
        </div>
      </li>
    </ul>
  </CollapsiblePanel>
);

export default function summaryDescription({ formData }) {
  return (
    <div>
      <p>
        Based on what you told us, you may be eligible for these additional
        disability benefits.
      </p>
      {formData['view:modifyingHome'] && houseAssistanceContent}
      {formData['view:modifyingCar'] && carAssistanceContent}
      {formData['view:aidAndAttendance'] && aidAndAttendanceContent}
      {formData['view:unemployable'] && individualUnemployabilityContent}
    </div>
  );
}
