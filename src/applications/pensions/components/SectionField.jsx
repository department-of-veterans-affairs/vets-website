import React from 'react';
import { formatSSN } from 'platform/utilities/ui';

export const convertDateFormat = date => {
  const [year, month, day] = date.split('-');
  return `${month}/${day}/${year}`;
};

export const formatCurrency = num => `$${num.toLocaleString()}`;
// const bytesToKB = bytes => `${Math.round(bytes / 1024)} KB`;

// const ArrayComponent = ({ value }) => {
//   if (!value || value.length === 0) return null;

//   if (value[0].size) {
//     return value.map((item, index) => (
//       <div
//         key={index}
//         className="vads-u-margin-top--4 vads-u-background-color--gray-lightest vads-u-padding--2"
//       >
//         <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
//           <u>
//             <strong>{item.name}</strong>
//           </u>
//         </p>
//         <p>{bytesToKB(item.size)}</p>
//       </div>
//     ));
//   }

//   if (value[0].disabilityStartDate && value.length === 1) {
//     return value.map((item, index) => (
//       <div key={index}>
//         <p>{item.name}</p>
//         <p className="vads-u-color--gray">Disability start date</p>
//         <p>{convertDateFormat(item.disabilityStartDate)}</p>
//       </div>
//     ));
//   }

//   if (value[0].disabilityStartDate) {
//     return value.map((item, index) => (
//       <div
//         key={index}
//         className="vads-u-margin-top--4 vads-u-background-color--gray-lightest vads-u-padding--2"
//       >
//         <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
//           <strong>{item.name}</strong>
//         </p>
//         <p className="vads-u-color--gray vads-u-margin-bottom--0">
//           Disability start date
//         </p>
//         <p className="vads-u-margin-bottom--1">
//           {convertDateFormat(item.disabilityStartDate)}
//         </p>
//       </div>
//     ));
//   }

//   return value.map((item, index) => (
//     <div key={index} className="vads-u-margin-top--4">
//       <div className="vads-u-background-color--gray-lightest vads-u-padding--1p5">
//         <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
//           <strong>First: </strong>
//           {item.first}
//         </p>
//         <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
//           <strong>Middle: </strong>
//           {item.middle ? item.middle : 'None'}
//         </p>
//         <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
//           <strong>Last: </strong>
//           {item.last}
//         </p>
//         <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
//           <strong>Suffix: </strong>
//           {item.suffix ? item.suffix : 'None'}
//         </p>
//       </div>
//     </div>
//   ));
// };

export function ApplicantInformation({ title, id, formData }) {
  return (
    <>
      <h2 id={id}>{title}</h2>
      <hr className="vads-u-border-color--primary-darker" />
      <div>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Your first name
        </p>
        <p className="vads-u-margin-top--0">
          {formData.veteranFullName?.first}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Your middle name
        </p>
        <p className="vads-u-margin-top--0">
          {formData.veteranFullName?.middle}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Your last name
        </p>
        <p className="vads-u-margin-top--0">{formData.veteranFullName?.last}</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">Suffix</p>
        <p className="vads-u-margin-top--0">
          {formData.veteranFullName?.suffix}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Social Security number
        </p>
        <p className="vads-u-margin-top--0">
          {formData.veteranSocialSecurityNumber
            ? formatSSN(formData.veteranSocialSecurityNumber)
            : ''}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          VA file number
        </p>
        <p className="vads-u-margin-top--0">{formData?.vaFileNumber}</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Date of birth
        </p>
        <p className="vads-u-margin-top--0">
          {formData.veteranDateOfBirth
            ? convertDateFormat(formData.veteranDateOfBirth)
            : ''}
        </p>
      </div>
    </>
  );
}

export function MilitaryHistory({ title, id, formData }) {
  return (
    <>
      <h2 id={id}>{title}</h2>
      <hr className="vads-u-border-color--primary-darker" />
      <div>
        <h3>General history</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Did you serve under another name?
        </p>
        <p className="vads-u-margin-top--0">
          {/* add your mapping names here */}
          {/* {formData.previousNames?.length > 0 ? formData.previousNames : 'No'} */}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Place of last or anticipated separation (city and state or foreign
          country)
        </p>
        <p className="vads-u-margin-top--0">{formData.placeOfSeparation}</p>

        <h3>Reserve and National Guard</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Are you currently on federal active duty in the National Guard?
        </p>
        <p className="vads-u-margin-top--0">
          {formData.nationalGuardActivation ? 'Yes' : 'No'}
        </p>

        <h3>POW status &amp; severance pay</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Have you ever been a POW?
        </p>
        <p className="vads-u-margin-top--0">
          {formData['view:powStatus']
            ? `Yes
            ${convertDateFormat(
              formData.powDateRange.from,
            )} - ${convertDateFormat(formData.powDateRange.to)}`
            : 'No'}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Have you received any type of severance or separation pay
        </p>
        <p className="vads-u-margin-top--0">
          {formData.severancePay
            ? `${formData.severancePay.type}
            ${formatCurrency(formData.severancePay.amount)}`
            : 'No'}
        </p>
      </div>
    </>
  );
}

export function WorkHistory({ title, id, formData }) {
  return (
    <>
      <h2 id={id}>{title}</h2>
      <hr className="vads-u-border-color--primary-darker" />
      <div>
        <h3>Disability history</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Have you been treated at a VA medical center for this disability?
        </p>
        <p className="vads-u-margin-top--0">
          {formData['view:hasVisitedVaMc'] ? 'Yes' : 'No'}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Disability
        </p>
        <p className="vads-u-margin-top--0">
          {/** do mapping here */}
          {/* {formData.disabilities?.length > 0 ? formData.disabilities : 'No'} */}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Date disability began
        </p>
        <p className="vads-u-margin-top--0">
          {/** do mapping here */}
          {'01/01/1966'}
        </p>
        <h3>Employment history</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Have you had a job (including being self-employed) from 1 year before
          you became disabled?
        </p>
        <p className="vads-u-margin-top--0">
          {/** do mapping here */}
          {'Yes'}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Name of employer
        </p>
        <p className="vads-u-margin-top--0">DreamJob Inc.</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">Address</p>
        <p className="vads-u-margin-top--0">render address</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Job title
        </p>
        <p className="vads-u-margin-top--0">Construction</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">From</p>
        <p className="vads-u-margin-top--0">01/01/1980</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">To</p>
        <p className="vads-u-margin-top--0">01/01/1989</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          How many days lost to disability
        </p>
        <p className="vads-u-margin-top--0">300</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Total annual earnings
        </p>
        <p className="vads-u-margin-top--0">$30,000.00</p>
      </div>
    </>
  );
}

// need to put formData here
export function HouseholdInformation({ title, id, formData }) {
  return (
    <>
      <h2 id={id}>{title}</h2>
      <hr className="vads-u-border-color--primary-darker" />
      <div>
        <h3>Marriage history</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          What's your marital status?
        </p>
        <p className="vads-u-margin-top--0">Never Married</p>
        <h3>Dependent children</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Do you have any dependent children?
        </p>
        <p className="vads-u-margin-top--0">{formData['view:hasDependents']}</p>
      </div>
    </>
  );
}

export function FinancialDisclosure({ title, id, formData }) {
  const veteranName = `${formData.veteranFullName.first} ${
    formData.veteranFullName.last
  }'s`;
  return (
    <>
      <h2 id={id}>{title}</h2>
      <hr className="vads-u-border-color--primary-darker" />
      <div>
        <h3>{veteranName} net worth</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Cash/Non-interest bearing accounts
        </p>
        <p className="vads-u-margin-top--0">$0.00</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Interest bearing accounts
        </p>
        <p className="vads-u-margin-top--0">$0.00</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          IRAs, KEOGH Plans, etc.
        </p>
        <p className="vads-u-margin-top--0">$0.00</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Stocks, bonds,mutual funds, etc.
        </p>
        <p className="vads-u-margin-top--0">$0.00</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Real property (not your home, vehicle, furniture, or clothing)
        </p>
        <p className="vads-u-margin-top--0">$0.00</p>
        <h3>{veteranName} monthly income</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Social Security
        </p>
        <p className="vads-u-margin-top--0">$0.00</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          US Civil Service
        </p>
        <p className="vads-u-margin-top--0">$0.00</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          US Railroad Retirement
        </p>
        <p className="vads-u-margin-top--0">$0.00</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Black Lung Benefits
        </p>
        <p className="vads-u-margin-top--0">$0.00</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Service Retirement
        </p>
        <p className="vads-u-margin-top--0">$0.00</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Supplemental Security Income (SSI) or Public Assistance
        </p>
        <p className="vads-u-margin-top--0">$0.00</p>

        <h3>{veteranName} monthly expenses</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Gross wages and salary
        </p>
        <p className="vads-u-margin-top--0">$0.00</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Total dividends and interest
        </p>
        <p className="vads-u-margin-top--0">$0.00</p>
      </div>
    </>
  );
}

export function AdditionalInformation({ title, id, formData }) {
  return (
    <>
      <h2 id={id}>{title}</h2>
      <hr className="vads-u-border-color--primary-darker" />
      <div>
        <h3>Direct Deposity</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          You did not select to use direct deposit
        </p>
        <p className="vads-u-margin-top--0" />
        <h3>Contact information</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Mailing Address
        </p>
        <p className="vads-u-margin-top--0">render mailing address</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Primary email
        </p>
        <p className="vads-u-margin-top--0">{formData.email}</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Secondary email
        </p>
        <p className="vads-u-margin-top--0">None</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Daytime phone
        </p>
        <p className="vads-u-margin-top--0">None</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Evening phone
        </p>
        <p className="vads-u-margin-top--0">None</p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Mobile phone
        </p>
        <p className="vads-u-margin-top--0">(202) 111-1111</p>
        <h3>Document upload</h3>
        <p>Review all your uploaded documentation to support your claim.</p>
        <p>
          If you're claiming for Aid and Attendance or Housebound benefits, this
          includes:
        </p>
        <ul>
          <li>
            A completed Examination for Housebound Status or Permanent Need for
            Regular Aid and Attendance (
            <va-link download href="#" type="PDF">
              VA Form 21-2680
            </va-link>
            )
          </li>
          <li>
            A completed Request for Nursing Home Information in Connection with
            Claim for Aid and Attendance (
            <va-link download href="#" type="PDF">
              VA Form 21-0779
            </va-link>
            )
          </li>
        </ul>
        {/** Render uploaded documents here */}
        <h3>Fully Developed Claim program</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Do you want to apply using the Fully Developed Claim program?
        </p>
        <p className="vads-u-margin-top--0">
          No, I have some extra information that I will submit to VA later.
        </p>
      </div>
    </>
  );
}
