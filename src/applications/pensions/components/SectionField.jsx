import React from 'react';
import { formatSSN } from 'platform/utilities/ui';
import { getJobTitleOrType } from '../helpers';

export const convertDateFormat = date => {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return `${month}/${day}/${year}`;
};

export const formatPhoneNumber = num => {
  return typeof num === 'string'
    ? `(${num.substr(0, 3)}) ${num.substr(3, 3)}-${num.substr(6)}`
    : '';
};

export const formatCurrency = num => {
  if (num == null) {
    return '$0.00';
  }
  const rounded = Math.round(num);
  return `$${rounded.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
export const bytesToKB = bytes => `${Math.round(bytes / 1024)} KB`;

/**
 * @typedef {object} ApplicantInformationProps
 * @property {string} title - The title of the section
 * @property {string} id - The id of the section
 * @property {object} formData - The form data for the applicant
 *
 * @param {ApplicantInformationProps} props - The props for the component
 * @returns {React.Element} - The rendered applicant information section
 */
export function ApplicantInformation({ title, id, formData }) {
  return (
    <>
      <h2
        id={id}
        className="vads-u-margin-bottom--0 vads-u-padding-bottom--1 vads-u-font-size--h3 vads-u-border-bottom--2px vads-u-border-color--primary-darker"
      >
        {title}
      </h2>
      <div>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Your first name
        </p>
        <p className="vads-u-margin-top--0">
          {formData?.veteranFullName?.first}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Your middle name
        </p>
        <p className="vads-u-margin-top--0">
          {formData?.veteranFullName?.middle}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Your last name
        </p>
        <p className="vads-u-margin-top--0">
          {formData?.veteranFullName?.last}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">Suffix</p>
        <p className="vads-u-margin-top--0">
          {formData?.veteranFullName?.suffix}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Social Security number
        </p>
        <p className="vads-u-margin-top--0">
          {formData?.veteranSocialSecurityNumber
            ? formatSSN(formData?.veteranSocialSecurityNumber)
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
          {convertDateFormat(formData?.veteranDateOfBirth)}
        </p>
      </div>
    </>
  );
}

/**
 * @typedef {object} MilitaryHistoryProps
 * @property {string} title - The title of the section
 * @property {string} id - The id of the section
 * @property {object} formData - The form data for the military history
 *
 * @param {MilitaryHistoryProps} props - The props for the component
 * @returns {React.Element} - The rendered military history section
 */
export function MilitaryHistory({ title, id, formData }) {
  return (
    <>
      <h2
        id={id}
        className="vads-u-margin-bottom--0 vads-u-padding-bottom--1 vads-u-font-size--h3 vads-u-border-bottom--2px vads-u-border-color--primary-darker"
      >
        {title}
      </h2>
      <div>
        <h3 className="vads-u-font-size--h4">General history</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Did you serve under another name?
        </p>
        <div className="vads-u-margin-top--0">
          {formData?.previousNames
            ? formData?.previousNames.map((name, index) => {
                return (
                  <div key={index} className="vads-u-margin-top--2">
                    <div className="vads-u-background-color--gray-lightest vads-u-padding--1p5">
                      <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                        <strong>First: </strong>
                        {name?.first ? name?.first : ''}
                      </p>
                      <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                        <strong>Middle: </strong>
                        {name?.middle ? name?.middle : ''}
                      </p>
                      <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                        <strong>Last: </strong>
                        {name?.last ? name?.last : ''}
                      </p>
                      <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                        <strong>Suffix: </strong>
                        {name?.suffix ? name?.suffix : 'None'}
                      </p>
                    </div>
                  </div>
                );
              })
            : 'None'}
        </div>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Place of last or anticipated separation (city and state or foreign
          country)
        </p>
        <p className="vads-u-margin-top--0">
          {formData?.placeOfSeparation ? formData?.placeOfSeparation : ''}
        </p>

        <h3 className="vads-u-font-size--h4">Reserve and National Guard</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Are you currently on federal active duty in the National Guard?
        </p>
        <p className="vads-u-margin-top--0">
          {formData?.nationalGuardActivation ? 'Yes' : 'No'}
        </p>

        <h3 className="vads-u-font-size--h4">POW status &amp; severance pay</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Have you ever been a POW?
        </p>
        <p className="vads-u-margin-top--0" style={{ whiteSpace: 'pre-wrap' }}>
          {formData['view:powStatus']
            ? `Yes
            \n${convertDateFormat(
              formData?.powDateRange?.from,
            )} - ${convertDateFormat(formData?.powDateRange?.to)}`
            : 'No'}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Have you received any type of severance or separation pay?
        </p>
        <p className="vads-u-margin-top--0" style={{ whiteSpace: 'pre-wrap' }}>
          {formData.severancePay
            ? `${formData?.severancePay?.type}
            \n${formatCurrency(formData?.severancePay?.amount)}`
            : 'No'}
        </p>
      </div>
    </>
  );
}

/**
 * @typedef {object} WorkHistoryProps
 * @property {string} title - The title of the section
 * @property {string} id - The id of the section
 * @property {object} formData - The form data for the work history
 *
 * @param {WorkHistoryProps} props - The props for the component
 * @returns {React.Element} - The rendered work history section
 */
export function WorkHistory({ title, id, formData }) {
  return (
    <>
      <h2
        id={id}
        className="vads-u-margin-bottom--0 vads-u-padding-bottom--1 vads-u-font-size--h3 vads-u-border-bottom--2px vads-u-border-color--primary-darker"
      >
        {title}
      </h2>
      <div>
        <h3 className="vads-u-font-size--h4">Disability history</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Have you been treated at a VA medical center for this disability?
        </p>
        <p className="vads-u-margin-top--0">
          {formData['view:hasVisitedVaMc'] ? 'Yes' : 'No'}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Disability
        </p>
        <div className="vads-u-margin-top--0">
          {formData?.disabilities?.length > 0
            ? formData?.disabilities?.map(item => {
                return (
                  <div key={item?.name}>
                    <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                      {item?.name ? item?.name : ''}
                    </p>
                    <p className="vads-u-color--gray vads-u-margin-bottom--0">
                      Date disability began
                    </p>
                    <p className="vads-u-margin-bottom--1">
                      {convertDateFormat(item?.disabilityStartDate)}
                    </p>
                  </div>
                );
              })
            : 'None'}
        </div>
        <h3 className="vads-u-font-size--h4">Employment history</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Have you had a job (including being self-employed) from 1 year before
          you became disabled?
        </p>
        <p className="vads-u-margin-top--0">
          {formData['view:workedBeforeDisabled'] ? 'Yes' : 'No'}
        </p>
        {formData['view:history']?.jobs?.length > 0
          ? formData['view:history']?.jobs?.map((item, index) => {
              return (
                <div key={index}>
                  <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
                    Address
                  </p>
                  <p className="vads-u-margin-top--0">
                    {item?.address?.street ? item?.address?.street : ''} <br />
                    {item?.address?.street2 ? item?.address?.street2 : ''}{' '}
                    <br />
                    {item?.address?.city && item?.address?.state
                      ? `${item?.address?.city}, ${item?.address?.state}`
                      : ''}
                    <br />
                    {item?.address?.postalCode ? item?.address?.postalCode : ''}
                    <br />
                    {item?.address?.country ? item?.address?.country : ''}
                  </p>
                  <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
                    Job title
                  </p>
                  <p className="vads-u-margin-top--0">
                    {getJobTitleOrType(item)}
                  </p>
                  <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
                    From
                  </p>
                  <p className="vads-u-margin-top--0">
                    {convertDateFormat(
                      item?.dateRange?.from ? item?.dateRange?.from : '',
                    )}
                  </p>
                  <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
                    To
                  </p>
                  <p className="vads-u-margin-top--0">
                    {convertDateFormat(
                      item?.dateRange?.to ? item?.dateRange?.to : '',
                    )}
                  </p>
                  <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
                    How many days lost to disability?
                  </p>
                  <p className="vads-u-margin-top--0">
                    {item?.daysMissed ? item?.daysMissed : ''}
                  </p>
                  <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
                    Total annual earnings
                  </p>
                  <p className="vads-u-margin-top--0">
                    {item?.annualEarnings
                      ? formatCurrency(item?.annualEarnings)
                      : ''}
                  </p>
                </div>
              );
            })
          : ''}
      </div>
    </>
  );
}

/**
 * @typedef {object} HouseholdInformationProps
 * @property {string} title - The title of the section
 * @property {string} id - The id of the section
 * @property {object} formData - The form data for the household information
 *
 * @param {HouseholdInformationProps} props - The props for the component
 * @returns {React.Element} - The rendered household information section
 */
export function HouseholdInformation({ title, id, formData }) {
  return (
    <>
      <h2
        id={id}
        className="vads-u-margin-bottom--0 vads-u-padding-bottom--1 vads-u-font-size--h3 vads-u-border-bottom--2px vads-u-border-color--primary-darker"
      >
        {title}
      </h2>
      <div>
        <h3 className="vads-u-font-size--h4">Marriage history</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          What's your marital status?
        </p>
        <p className="vads-u-margin-top--0">
          {formData?.maritalStatus ? formData?.maritalStatus : ''}
        </p>
        <h3 className="vads-u-font-size--h4">Dependent children</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Do you have any dependent children?
        </p>
        <p className="vads-u-margin-top--0">
          {formData['view:hasDependents'] ? 'Yes' : 'No'}
        </p>
      </div>
    </>
  );
}

/**
 * @typedef {object} FinancialDisclosureProps
 * @property {string} title - The title of the section
 * @property {string} id - The id of the section
 * @property {object} formData - The form data for the household information
 *
 * @param {FinancialDisclosureProps} props - The props for the component
 * @returns {React.Element} - The rendered financial disclosure section
 */
export function FinancialDisclosure({ title, id, formData }) {
  const veteranName = `${formData?.veteranFullName?.first} ${formData?.veteranFullName?.last}'s`;
  return (
    <>
      <h2
        id={id}
        className="vads-u-margin-bottom--0 vads-u-padding-bottom--1 vads-u-font-size--h3 vads-u-border-bottom--2px vads-u-border-color--primary-darker"
      >
        {title}
      </h2>
      <>
        <h3 className="vads-u-font-size--h4">{veteranName} net worth</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Cash/Non-interest bearing accounts
        </p>
        <p className="vads-u-margin-top--0">
          {formatCurrency(formData?.netWorth?.bank)}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Interest bearing accounts
        </p>
        <p className="vads-u-margin-top--0">
          {formatCurrency(formData?.netWorth?.interestBank)}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          IRAs, KEOGH Plans, etc.
        </p>
        <p className="vads-u-margin-top--0">
          {formatCurrency(formData?.netWorth?.ira)}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Stocks, bonds,mutual funds, etc.
        </p>
        <p className="vads-u-margin-top--0">
          {formatCurrency(formData?.netWorth?.stocks)}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Real property (not your home, vehicle, furniture, or clothing)
        </p>
        <p className="vads-u-margin-top--0">
          {formatCurrency(formData?.netWorth?.realProperty)}
        </p>
        <h3 className="vads-u-font-size--h4">{veteranName} monthly income</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Social Security
        </p>
        <p className="vads-u-margin-top--0">
          {formatCurrency(formData?.monthlyIncome?.socialSecurity)}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          US Civil Service
        </p>
        <p className="vads-u-margin-top--0">
          {formatCurrency(formData?.monthlyIncome?.civilService)}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          US Railroad Retirement
        </p>
        <p className="vads-u-margin-top--0">
          {formatCurrency(formData?.monthlyIncome?.railroad)}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Black Lung Benefits
        </p>
        <p className="vads-u-margin-top--0">
          {formatCurrency(formData?.monthlyIncome?.blackLung)}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Service Retirement
        </p>
        <p className="vads-u-margin-top--0">
          {formatCurrency(formData?.monthlyIncome?.serviceRetirement)}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Supplemental Security Income (SSI) or Public Assistance
        </p>
        <p className="vads-u-margin-top--0">
          {formatCurrency(formData?.monthlyIncome?.ssi)}
        </p>

        <h3 className="vads-u-font-size--h4">{veteranName} expected income</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Gross wages and salary
        </p>
        <p className="vads-u-margin-top--0">
          {formatCurrency(formData?.expectedIncome?.salary)}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Total dividends and interest
        </p>
        <p className="vads-u-margin-top--0">
          {formatCurrency(formData?.expectedIncome?.interest)}
        </p>

        <h3 className="vads-u-font-size--h4">{veteranName} expected income</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Do you have any medical, legal or other unreimbursed expenses?
        </p>
        {formData?.otherExpenses?.length > 0
          ? formData?.otherExpenses?.map((item, index) => {
              return (
                <div key={[index]}>
                  <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
                    Paid to
                  </p>
                  <p className="vads-u-margin-top--0">
                    {item?.paidTo ? item?.paidTo : ''}
                  </p>
                  <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
                    Purpose
                  </p>
                  <p className="vads-u-margin-top--0">
                    {item?.purpose ? item?.purpose : ''}
                  </p>
                  <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
                    Amount
                  </p>
                  <p className="vads-u-margin-top--0">
                    {item?.amount ? formatCurrency(item?.amount) : ''}
                  </p>
                  <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
                    Date
                  </p>
                  <p className="vads-u-margin-top--0">
                    {convertDateFormat(item?.date)}
                  </p>
                </div>
              );
            })
          : 'No'}
      </>
    </>
  );
}

/**
 * @typedef {object} AdditionalInformationProps
 * @property {string} title - The title of the section
 * @property {string} id - The id of the section
 * @property {object} formData - The form data for the household information
 *
 * @param {AdditionalInformationProps} props - The props for the component
 * @returns {React.Element} - The rendered additional information section
 */
export function AdditionalInformation({ title, id, formData }) {
  return (
    <>
      <h2
        id={id}
        className="vads-u-margin-bottom--0 vads-u-padding-bottom--1 vads-u-font-size--h3 vads-u-border-bottom--2px vads-u-border-color--primary-darker"
      >
        {title}
      </h2>
      <div>
        <h3 className="vads-u-font-size--h4">Direct Deposit</h3>
        <p style={{ whiteSpace: 'pre-wrap' }}>
          {formData['view:noDirectDeposit']
            ? 'You did not select to use direct deposit'
            : `${formData?.bankAccount?.bankName}
            \n Account type: ${
              formData?.bankAccount?.accountType === 'checking'
                ? 'Checking'
                : 'Savings'
            }
            \n Account number: ${
              formData?.bankAccount?.accountNumber
                ? formData?.bankAccount?.accountNumber
                : ''
            }
            \n Routing number: ${
              formData?.bankAccount?.routingNumber
                ? formData?.bankAccount?.routingNumber
                : ''
            }`}
        </p>
        <p className="vads-u-margin-top--0" />
        <h3 className="vads-u-font-size--h4">Contact information</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Mailing Address
        </p>
        <p className="vads-u-margin-top--0">
          {formData?.veteranAddress?.street
            ? formData?.veteranAddress?.street
            : ''}
          <br />
          {`${
            formData?.veteranAddress?.city ? formData?.veteranAddress?.city : ''
          }, ${
            formData?.veteranAddress?.state
              ? formData?.veteranAddress?.state
              : ''
          }`}
          <br />
          {formData?.veteranAddress?.postalCode
            ? formData?.veteranAddress?.postalCode
            : ''}
          <br />
          {formData?.veteranAddress?.country
            ? formData?.veteranAddress?.country
            : ''}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Primary email
        </p>
        <p className="vads-u-margin-top--0">
          {formData?.email ? formData?.email : ''}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Secondary email
        </p>
        <p className="vads-u-margin-top--0">
          {formData?.altEmail ? formData?.altEmail : ''}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Daytime phone
        </p>
        <p className="vads-u-margin-top--0">
          {formatPhoneNumber(formData?.dayPhone)}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Evening phone
        </p>
        <p className="vads-u-margin-top--0">
          {formatPhoneNumber(formData?.nightPhone)}
        </p>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Mobile phone
        </p>
        <p className="vads-u-margin-top--0">
          {formatPhoneNumber(formData?.mobilePhone)}
        </p>
        <h3 className="vads-u-font-size--h4">Document upload</h3>
        <p>Review all your uploaded documentation to support your claim.</p>
        <p>
          If you're claiming for Aid and Attendance or Housebound benefits, this
          includes:
        </p>
        <ul className="vads-u-margin-bottom--5">
          <li>
            A completed Examination for Housebound Status or Permanent Need for
            Regular Aid and Attendance (
            <va-link
              href="http://www.vba.va.gov/pubs/forms/VBA-21-2680-ARE.pdf"
              text="VA Form 21-2680"
              type="PDF"
              pages={4}
              download
            />
            )
          </li>
          <li>
            A completed Request for Nursing Home Information in Connection with
            Claim for Aid and Attendance (
            <va-link
              href="http://www.vba.va.gov/pubs/forms/VBA-21-0779-ARE.pdf"
              text="VA Form 21-0779"
              type="PDF"
              pages={2}
              download
            />
            )
          </li>
        </ul>
        {formData?.files
          ? formData?.files?.map((item, index) => {
              return (
                <div key={index} className="vads-u-margin-top--2">
                  <div className="vads-u-background-color--gray-lightest vads-u-padding--1p5">
                    <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                      <strong>{item?.name}</strong>
                    </p>
                    <p>{bytesToKB(item?.size)}</p>
                  </div>
                </div>
              );
            })
          : null}
        <h3 className="vads-u-font-size--h4">Fully Developed Claim program</h3>
        <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
          Do you want to apply using the Fully Developed Claim program?
        </p>
        <p className="vads-u-margin-top--0">
          {formData?.noRapidProcessing
            ? 'No, I have some extra information that I will submit to VA later.'
            : 'Yes, I have uploaded all my documentation'}
        </p>
      </div>
    </>
  );
}
