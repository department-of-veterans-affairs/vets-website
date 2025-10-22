import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const Intro = () => (
  <div>
    <p>
      On the next screen, we’ll ask you to submit supporting documents and
      additional evidence for your claim.
    </p>
    <p>
      <strong>Note:</strong> If you upload all this information online now, you
      may be able to get a faster decision on your claim.
    </p>
  </div>
);

const Documents = () => (
  <div>
    <p>You’ll need to submit these supporting documents:</p>
    <ul>
      <li>Veteran’s DD214</li>
      <li>Veteran’s death certificate</li>
      <li>Marriage license or proof of marriage</li>
      <li>Birth certificate</li>
      <li>Divorce decree</li>
      <li>Adoption decree</li>
      <li>
        A completed Examination for Housebound Status or Permanent Need for
        Regular Aid and Attendance (VA Form 21-2680)
        <br />
        <va-link
          href="https://www.va.gov/find-forms/about-form-21-2680"
          external
          text="Get VA Form 21-2680 to download (opens in new tab)"
        />
      </li>
      <li>
        A completed Request for Nursing Home Information in Connection with
        Claim for Aid and Attendance (VA Form 21-0779)
        <br />
        <va-link
          href="https://www.va.gov/find-forms/about-form-21-0779"
          external
          text="Get VA Form 21-0779 to download (opens in new tab)"
        />
      </li>
      <li>
        A completed Request for Approval of School Attendance (VA Form 21-674)
        <br />
        <va-link
          href="https://www.va.gov/find-forms/about-form-21-674"
          external
          text="Get VA Form 21-674 to download (opens in new tab)"
        />
      </li>
      <li>
        A completed Income and Asset Statement in Support of Claim for Pension
        or Parents' Dependency and Indemnity Compensation (VA Form 21P-0969)
        <br />
        <va-link
          href="https://www.va.gov/find-forms/about-form-21p-0969"
          external
          text="Get VA Form 21P-0969 to download (opens in new tab)"
        />
      </li>
    </ul>

    <p className="vads-u-margin-top--6">
      You’ll also need to submit certain additional evidence depending on your
      situation.
    </p>

    <va-accordion>
      <va-accordion-item header="If you need the help of another person for daily living">
        <p>You’ll need to submit evidence that shows one of these is true:</p>
        <ul>
          <li>
            You need another person to help you perform daily activities, like
            bathing, feeding, and dressing, <strong>or</strong>
          </li>
          <li>
            You have to stay in bed—or spend a large portion of the day in
            bed—because of illness, <strong>or</strong>
          </li>
          <li>
            You’re a patient in a nursing home due to the loss of mental or
            physical abilities related to a disability, <strong>or</strong>
          </li>
          <li>
            Your eyesight is limited (even with glasses or contact lenses you
            have only 5/200 or less in both eyes, or concentric contraction of
            the visual field to 5 degrees or less)
          </li>
        </ul>
      </va-accordion-item>

      <va-accordion-item header="If you’re housebound and you live independently">
        <p>
          You’ll need to submit additional evidence that shows one of these is
          true:
        </p>
        <ul>
          <li>
            You have a single, permanent disability that’s rated as 100%
            disabling, and this means you’ll always need to be in your home or
            another living space most of the time, <strong>or</strong>
          </li>
          <li>
            You have a single, permanent disability rated as 100% disabling and
            at least one other disability rated as 60% or more disabling
          </li>
        </ul>
      </va-accordion-item>
    </va-accordion>
  </div>
);

export default {
  title: 'Supporting documents',
  path: 'additional-information/supporting-documents',
  uiSchema: {
    ...titleUI('Supporting documents', Intro),
    'ui:description': Documents,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
