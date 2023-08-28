import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiRequest } from 'platform/utilities/api';
import { formatSSN } from 'platform/utilities/ui';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';

const convertDateFormat = date => {
  date.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$2/$3/$1');
};

const formatPhoneNumber = num =>
  `(${num.substr(0, 3)}) ${num.substr(3, 3)}-${num.substr(6)}`;

const locationOfDeath = {
  nursingHome: 'Nursing home under VA contract',
  vaMedicalCenter: 'VA medical center',
  stateVeteransHome: 'State Veterans home',
};

const burialAllowanceRequest = {
  nonService: 'Non-Service connected death',
  vaMedicalCenter:
    'Service-connected death (for a Veteran death related to, or resulting from, a service-connected disability)',
};

const formatCurrency = num => `$${num.toLocaleString()}`;
const bytesToKB = bytes => `${Math.round(bytes / 1024)} KB`;

const formatAddress = address => {
  return `${Object.values(address)
    .filter(line => line !== undefined)
    .join('\n')}`;
};

const relationshipType = {
  spouse: 'Spouse',
  child: 'Child',
  parent: 'Parent',
  executor: 'Executor/Administrator of estate',
};

const renderFields = [
  {
    title: 'Claimant information',
    id: 'claimant-information',
  },
  {
    title: 'Deceased Veteran information',
    id: 'deceased-veteran-information',
  },
  {
    title: 'Military history',
    id: 'military-history',
  },
  {
    title: 'Benefits selection',
    id: 'benefits-selection',
  },
  {
    title: 'Additional information',
    id: 'additional-information',
  },
];

const generateData = (type, formData) => {
  switch (type) {
    case 'claimant-information':
      return {
        'Claimant’s first name': formData.claimantFullName.first
          ? formData.claimantFullName.first
          : '',
        'Claimant’s middle name': formData.claimantFullName?.middle ?? 'None',
        'Claimant’s last name': formData.claimantFullName.last
          ? formData.claimantFullName.last
          : '',
        Suffix: formData.claimantFullName?.suffix ?? 'None',
        'Relationship to the deceased Veterans': formData.relationship.type
          ?.other
          ? formData.relationship.other
          : relationshipType[formData.relationship.type],
      };
    case 'deceased-veteran-information':
      return {
        'Veteran’s first name': formData.veteranFullName.first
          ? formData.veteranFullName.first
          : '',
        'Veteran’s middle name': formData.veteranFullName?.middle ?? 'None',
        'Veteran’s last name': formData.veteranFullName.last
          ? formData.veteranFullName.last
          : '',
        Suffix: formData.veteranFullName?.suffix ?? 'None',
        'Social Security number': formData.veteranSocialSecurityNumber
          ? formatSSN(formData.veteranSocialSecurityNumber)
          : '',
        'VA file number': formData.vaFileNumber ? formData.vaFileNumber : '',
        'Date of birth': formData.veteranDateOfBirth
          ? convertDateFormat(formData.veteranDateOfBirth)
          : '',
        'Place of birth (city and state or foreign country)':
          formData?.placeOfBirth ?? 'None',
        'Burial information': {
          'Date of death': formData.deathDate
            ? convertDateFormat(formData.deathDate)
            : '',
          'Date of burial (includes cremation or interment)': formData.burialDate
            ? convertDateFormat(formData.burialDate)
            : '',
          'Where did the Veteran’s death occur?': formData.locationOfDeath
            ?.other
            ? formData.locationOfDeath.other
            : locationOfDeath[formData.locationOfDeath.location],
        },
      };
    case 'military-history':
      return {
        'Previous names': {
          'Did the Veteran serve under another name?':
            formData.previousNames?.length > 0 ? formData.previousNames : 'No',
        },
      };
    case 'benefits-selection':
      return {
        'General selection': {
          'Burial allowance': formData['view:claimedBenefits'].burialAllowance
            ? 'Selected'
            : 'Not selected',
          'Plot or interment allowance (Check this box if you incurred expensed for the plot to bury the Veteran’s remains.)': formData[
            'view:claimedBenefits'
          ].plotAllowance
            ? 'Selected'
            : 'Not selected',
          'Transportation expenses (Transportation of the Veteran’s remains from the place of death to the final resting place)': formData[
            'view:claimedBenefits'
          ].transportation
            ? formatCurrency(formData['view:claimedBenefits'].amountIncurred)
            : 'None',
        },
        'Burial allowance': {
          'Type of burial allowance':
            burialAllowanceRequest[formData.burialAllowanceRequested],
          'Did you previously receive a VA burial allowance?': formData[
            'view:claimedBenefits'
          ].burialAllowance
            ? 'Yes'
            : 'No',
        },
        'Plot or interment allowance': {
          'Place of burial or location of deceased Veteran’s remains': formData.placeOfRemains
            ? formData.placeOfRemains
            : '',
          'Was the Veteran buried in a state Veterans cemetary?': formData.stateCemetary
            ? 'Yes'
            : 'No',
          'Did a federal/state government or the Veteran’s employer contribute to the burial? (Not including employer life insurance)': formData.govtContributions
            ? formatCurrency(formData.amountGovtContribution)
            : 'No',
        },
      };
    case 'additional-information':
      return {
        'Claimant contact information': {
          Address: formData.claimantAddress
            ? formatAddress(formData.claimantAddress)
            : '',
          'Email address': formData.claimantEmail ? formData.claimantEmail : '',
          'Phone number': formData.claimantPhone
            ? formatPhoneNumber(formData.claimantPhone)
            : '',
        },
        'Document upload': {
          'Veterans death certificate':
            formData.transportationReceipts.length > 0
              ? formData.transportationReceipts.slice(0, 1)
              : '',
          'Documentation for transportation of the Veteran’s remains or other supporting evidence':
            formData.transportationReceipts.length > 0
              ? formData.transportationReceipts.slice(
                  1,
                  formData.transportationReceipts.length,
                )
              : '',
        },
      };
    default:
      return {};
  }
};

const ArrayComponent = ({ value }) => {
  return value[0].size
    ? value.map((name, index) => {
        return (
          <div
            key={index}
            className="vads-u-margin-top--4 vads-u-background-color--gray-lightest vads-u-padding--2"
          >
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
              <u>
                <strong>{name.name}</strong>
              </u>
            </p>
            <p>{bytesToKB(name.size)}</p>
          </div>
        );
      })
    : value.map((name, index) => (
        <div key={index} className="vads-u-margin-top--4">
          <div className="vads-u-background-color--gray-lightest vads-u-padding--1p5">
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
              <strong>First: </strong>
              {name.first}
            </p>
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
              <strong>Middle: </strong>
              {name.middle ? name.middle : 'None'}
            </p>
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
              <strong>Last: </strong>
              {name.last}
            </p>
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
              <strong>Suffix: </strong>
              {name.suffix ? name.suffix : 'None'}
            </p>
          </div>
        </div>
      ));
};

const h3Subsections = [
  'Burial information',
  'Previous names',
  'General selection',
  'Burial allowance',
  'Plot or interment allowance',
  'Claimant contact information',
  'Document upload',
];

const CreateSummarySections = ({
  title = '',
  id = '',
  formData = {},
  bypassData = false,
}) => {
  const data = !bypassData ? generateData(id, formData) : formData;

  return (
    <>
      {!bypassData ? (
        <>
          <h2 id={id}>{title}</h2>
          <hr className="vads-u-border-color--primary-darker" />
        </>
      ) : null}
      <div>
        {Object.entries(data).map(([key, value]) => (
          <React.Fragment key={key}>
            {h3Subsections.includes(key) && typeof value !== 'string' ? (
              <>
                <h3>{key}</h3>
                <CreateSummarySections formData={value} bypassData />
              </>
            ) : (
              <>
                <p className="vads-u-color--gray vads-u-margin-bottom--0p5">
                  {key}
                </p>

                {Array.isArray(value) ? (
                  <ArrayComponent value={value} />
                ) : (
                  <p
                    className="vads-u-margin-top--0"
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {value}
                  </p>
                )}
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export const NoFormPage = () => {
  const [data, setData] = useState({});
  // const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const loggedIn = useSelector(isLoggedIn);

  useEffect(() => {
    const resource = '/in_progress_forms/21P-530';

    apiRequest(resource)
      .then(responseData => {
        setData(responseData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // useEffect(() => {
  //   const resource = '/intent_to_file/pension/active';

  //   apiRequest(resource)
  //     .then(responseData => {
  //       console.log(responseData);
  //       setUser(responseData);
  //       // setLoading(false);
  //     })
  //     .catch(() => {
  //       // setLoading(false);
  //     });
  // }, []);

  if (loading) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading your application..."
      />
    );
  }

  const { formData } = data;

  return loggedIn ? (
    <div className="row vads-u-margin-bottom--4">
      <h1>Review Burial Benefits Application</h1>
      <p>VA Form 21P-530</p>
      {data?.metadata?.inProgressFormId ? (
        <>
          <va-alert
            close-btn-aria-label="Close notification"
            status="info"
            visible
          >
            <h2 id="track-your-status-on-mobile" slot="headline">
              This online form isn’t working right now
            </h2>
            <div>
              <p className="vads-u-margin-y--0">
                You can still refer to the information here to apply by mail.
              </p>
            </div>
            <br />
            <va-link
              href="https://www.va.gov/burials-memorials/veterans-burial-allowance/"
              text="Learn more about how to apply for VA burial benefits"
            />
          </va-alert>
          <h3>Apply by mail</h3>
          <p>
            Fill out an Application for Veterans Burial (VA Form 21P-530EZ).
          </p>
          <div>
            <va-link
              download
              filetype="PDF"
              href="https://www.vba.va.gov/pubs/forms/VBA-21P-530EZ-ARE.pdf"
              pages={8}
              text="Download VA form 21P-530EZ"
            />
            <p>
              We’ve captured your intent to file date of{' '}
              <strong>XX/XX/XXXX</strong>. You have 12 months from that date to
              submit a claim.
            </p>
            <p className="vads-u-margin-bottom--4">
              Mail your burial form to the pension management center:
            </p>
            <p className="va-address-block">
              Department of Veterans Affairs <br />
              Pension Intake Center
              <br />
              PO Box 5365
              <br />
              Janesville, WI 53547-5365
              <br />
            </p>
            <article>
              <va-on-this-page />
              {renderFields.map(props => (
                <CreateSummarySections
                  {...props}
                  formData={formData}
                  key={props.id}
                />
              ))}
            </article>
            <p>
              <strong>Note:</strong> According to federal law, there are
              criminal penalties for withholding information on purpose or
              providing information that you know is false. Penalties may
              include a fine, imprisonment for up to 5 years, or both.
              (Reference: 18 U.S.C. 1001)
            </p>
            <va-alert
              background-only
              class="vads-u-margin-bottom--1"
              close-btn-aria-label="Close notification"
              disable-analytics="false"
              full-width="false"
              status="info"
              visible="true"
            >
              <p className="vads-u-margin-y--0">
                <strong>
                  Veterans Pension (VA Form 21P-527EZ) can not be currently
                  completed online.
                </strong>
                <br />
                We have saved your application so you can use it as a reference.
                You will need to fill out a new form to apply by mail.
              </p>
            </va-alert>
            <h2 className="vads-u-margin-bottom--0p5 vads-u-font-size--lg">
              Need help?
            </h2>
            <hr className="vads-u-border-color--primary vads-u-margin-y--0 vads-u-border-bottom--2px" />
            <p>
              Call us at <va-link href="tel:800-827-1000" text="800-827-1000" />
              . We’re here Monday through Friday, 8:00 a.m to 9:00 p.m ET. If
              you have hearing loss, call TTY:{' '}
              <va-link href="tel:711" text="711" />.
            </p>
          </div>
        </>
      ) : (
        <>
          <va-alert
            close-btn-aria-label="Close notification"
            status="info"
            visible
          >
            <h2 id="track-your-status-on-mobile" slot="headline">
              You don’t have any saved online burial forms.
            </h2>
            <div>
              <p className="vads-u-margin-y--0">
                You can apply for VA burial benefits by mail, in person at a VA
                regional office, or with the help of a VSO or other accredited
                representative.
              </p>
            </div>
            <br />
            <va-link
              href="https://www.va.gov/burials-memorials/veterans-burial-allowance/"
              text="Learn more about how to apply for VA burial benefits"
            />
          </va-alert>
          <h2 className="vads-u-margin-bottom--0p5 vads-u-font-size--lg">
            Need help?
          </h2>
          <hr className="vads-u-border-color--primary vads-u-margin-y--0 vads-u-border-bottom--2px" />
          <p>
            Call us at <va-link href="tel:800-827-1000" text="800-827-1000" />.
            We’re here Monday through Friday, 8:00 a.m to 9:00 p.m ET. If you
            have hearing loss, call TTY: <va-link href="tel:711" text="711" />.
          </p>
        </>
      )}
    </div>
  ) : (
    <div className="row vads-u-margin-bottom--4">
      <va-alert close-btn-aria-label="Close notification" status="info" visible>
        <h2 id="track-your-status-on-mobile" slot="headline">
          You don’t have any saved online burial forms.
        </h2>
        <div>
          <p className="vads-u-margin-y--0">
            You can apply for VA burial benefits by mail, in person at a VA
            regional office, or with the help of a VSO or other accredited
            representative.
          </p>
        </div>
        <br />
        <va-link
          href="https://www.va.gov/burials-memorials/veterans-burial-allowance/"
          text="Learn more about how to apply for VA burial benefits"
        />
      </va-alert>
      <h2 className="vads-u-margin-bottom--0p5 vads-u-font-size--lg">
        Need help?
      </h2>
      <hr className="vads-u-border-color--primary vads-u-margin-y--0 vads-u-border-bottom--2px" />
      <p>
        Call us at <va-link href="tel:800-827-1000" text="800-827-1000" />.
        We’re here Monday through Friday, 8:00 a.m to 9:00 p.m ET. If you have
        hearing loss, call TTY: <va-link href="tel:711" text="711" />.
      </p>
    </div>
  );
};
