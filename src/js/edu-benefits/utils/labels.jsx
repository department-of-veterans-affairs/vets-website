import React from 'react';

import { states } from '../../common/utils/options-for-select';
import { createUSAStateLabels } from '../../common/schemaform/helpers';
import AdditionalInfo from '../../common/components/AdditionalInfo';

export const chapterNames = {
  veteranInformation: 'Veteran Information',
  benefitsEligibility: 'Benefits Eligibility',
  militaryHistory: 'Military History',
  educationHistory: 'Education History',
  employmentHistory: 'Employment History',
  schoolSelection: 'School Selection',
  personalInformation: 'Personal Information',
  review: 'Review'
};

export const benefitsLabels = {
  chapter33: <p>Post-9/11 GI Bill (Chapter 33)<br/><AdditionalInfo triggerText="Learn more.">
      If you served on active duty after September 10, 2001, you may qualify for Post-9/11 GI Bill education benefits—like money for tuition, housing, books, and supplies. <a href="/education/gi-bill/post-9-11/" target="_blank">Find out if you’re eligible for the Post-9/11 GI Bill.</a>
  </AdditionalInfo>
  </p>,
  chapter30: <p>Montgomery GI Bill (MGIB-AD, Chapter 30)<br/>
    <AdditionalInfo triggerText="Learn more.">
       If you served at least 2 years on active duty, you may qualify for MGIB-AD benefits—like money for tuition or training. <a href="/education/gi-bill/montgomery-active-duty/" target="_blank">Find out if you’re eligible for the MGIB-AD program.</a>
   </AdditionalInfo>
  </p>,
  chapter1606: <p>Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)<br/>
    <AdditionalInfo triggerText="Learn more.">
      If you served in the Select Reserve for at least 6 years, you may qualify for up to 36 months of education and training benefits under the MGIB-SR program. <a href="/education/gi-bill/montgomery-selected-reserve/" target="_blank">Find out if you’re eligible for MGIB-SR benefits.</a>
    </AdditionalInfo>
  </p>,
  chapter32: <p>Post-Vietnam Era Veterans’ Educational Assistance Program<br/>(VEAP, Chapter 32)<br/>
    <AdditionalInfo triggerText="Learn more.">
    You can continue your education by contributing part of your military pay to help cover the cost of school. The government will match $2 for every $1 you contribute. <a href="/education/other-educational-assistance-programs/veap/" target="_blank">Find out if you can get benefits through VEAP.</a>
    </AdditionalInfo>
  </p>,
  chapter1607: <p>Reserve Educational Assistance Program (REAP, Chapter 1607)<br/>
    <AdditionalInfo triggerText="Learn more.">
      REAP ended on November 25, 2015, but some REAP benefits will remain in place until November 2019. The Post-9/11 GI Bill has replaced REAP for Reserve and National Guard members called to active duty on or after September 11, 2001. If you’d like to stop using REAP and use the Post-9/11 GI Bill instead, call 1-888-GI-BILL-1 (1-888-442-4551). <a href="/education/other-educational-assistance-programs/reap/" target="_blank">Learn more about REAP benefits.</a>
    </AdditionalInfo>
  </p>,
  transferOfEntitlement: <p>Transfer of Entitlement Program (TOE)<br/>
    <AdditionalInfo triggerText="Learn more.">
      If you don’t use all of your GI Bill education benefits, you can transfer some of your unused benefits to your spouse or dependent children. You must request to transfer benefits while on active duty. <a href="/education/gi-bill/transfer/" target="_blank">Find out how to transfer your education benefits.</a>
    </AdditionalInfo>
  </p>
};

// The links and labels are different from the above
export const survivorBenefitsLabels = {
  chapter35: <p>Survivors’ and Dependents’ Educational Assistance<br/>(DEA, Chapter 35)<br/><a href="/education/gi-bill/survivors-dependent-assistance/dependents-education/" target="_blank">Learn more</a></p>,
  chapter33: <p>The Fry Scholarship (Chapter 33)<br/><a href="/education/gi-bill/survivors-dependent-assistance/fry-scholarship/" target="_blank">Learn more</a></p>,
};

export const preferredContactMethodLabels = {
  mail: 'Mail',
  email: 'Email',
  phone: 'Phone'
};

export const hoursTypeLabels = {
  semester: 'Semester',
  quarter: 'Quarter',
  clock: 'Clock'
};

export const stateLabels = createUSAStateLabels(states);

export const civilianBenefitsLabel = (
  <span>
    Are you getting benefits from the U.S. Government as a <strong>civilian employee</strong> during the same time as you are seeking benefits from VA?
  </span>
);

export const bankAccountChangeLabels = {
  startUpdate: 'Start or update direct deposit',
  stop: 'Stop direct deposit',
  noChange: 'No change to payment method'
};

export const directDepositWarning = (
  <div className="edu-dd-warning">
    The Department of Treasury requires all federal benefit payments be made by electronic funds transfer (EFT), also called direct deposit (direct deposit isn’t an option for Chapter 32 (VEAP) recipients). If you don’t have a bank account, you must get your payment through Direct Express Debit MasterCard. To request a Direct Express Debit MasterCard you must apply at <a href="http://www.usdirectexpress.com" target="_blank">www.usdirectexpress.com</a> or by telephone at <a href="tel:8003331795" target="_blank">1-800-333-1795</a>. If you chose not to enroll, you must contact representatives handling waiver requests for the Department of Treasury at <a href="tel:8882242950" target="_blank">1-888-224-2950</a>. They will address any questions or concerns you may have and encourage your participation in EFT.
  </div>
);
