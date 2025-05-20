import React from 'react';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { PAGE_TITLE } from '../config/constants';

export const IntroductionPageHeader = () => (
  <>
    <FormTitle title={PAGE_TITLE} />
    <p>
      Equal to VA Form 21-686c (Application Request to Add And/Or Remove
      Dependents) and/or Equal to VA Form 21-674 (Request for Approval of School
      Attendance) and/or Equal to VA Form 21P-527EZ (Application for Veterans
      Pension)
    </p>
  </>
);
