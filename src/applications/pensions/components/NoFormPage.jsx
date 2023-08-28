import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiRequest } from 'platform/utilities/api';
// import { formatSSN } from 'platform/utilities/ui';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';

// const convertDateFormat = date => {
//   date.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$2/$3/$1');
// };

// const formatPhoneNumber = num =>
//   `(${num.substr(0, 3)}) ${num.substr(3, 3)}-${num.substr(6)}`;

// const locationOfDeath = {
//   nursingHome: 'Nursing home under VA contract',
//   vaMedicalCenter: 'VA medical center',
//   stateVeteransHome: 'State Veterans home',
// };

// const burialAllowanceRequest = {
//   nonService: 'Non-Service connected death',
//   vaMedicalCenter:
//     'Service-connected death (for a Veteran death related to, or resulting from, a service-connected disability)',
// };

// const formatCurrency = num => `$${num.toLocaleString()}`;
const bytesToKB = bytes => `${Math.round(bytes / 1024)} KB`;

// const formatAddress = address => {
//   return `${Object.values(address)
//     .filter(line => line !== undefined)
//     .join('\n')}`;
// };

// const relationshipType = {
//   spouse: 'Spouse',
//   child: 'Child',
//   parent: 'Parent',
//   executor: 'Executor/Administrator of estate',
// };

const renderFields = [
  {
    title: 'Applicant information',
    id: 'applicant-information',
  },
  {
    title: 'Military history',
    id: 'military-history',
  },
  {
    title: 'Work history',
    id: 'work-history',
  },
  {
    title: 'Household information',
    id: 'household-information',
  },
  {
    title: 'Financial disclosure',
    id: 'financial-disclosure',
  },
  {
    title: 'Additional information',
    id: 'additional-information',
  },
];

const generateData = (type, formData) => {
  // add formData back after type
  switch (type) {
    case 'applicant-information':
      return {
        'Your first name': 'First',
        'Your middle name': 'None',
        'Your last name': 'Last',
        Suffix: 'None',
        'Relationship to the deceased Veterans': 'XXX-XX-XXXX',
      };
    case 'military-history':
      return {
        'General history': {
          'Did you serve under another name?': 'No',
          'Place of last or anticipated separation (city and state or foreign country)':
            'None',
        },
        'Reserve and National Guard': {
          'Are you currently on federal active duty in the National Guard?':
            'No',
        },
        'POW status & severance pay': {
          'Have you ever been a POW?': 'No',
          'Have you received any type of severance or separation pay': 'No',
        },
      };
    case 'work-history':
      return {
        'Disability history': {
          'Have you been treated at a VA medical center for the above disability?':
            'No',
          Disability: 'Chronic back pain',
          'Date disability began': '01/01/1966',
        },
        'Employment history': {
          'Have you had a job (including being self-employed) from 1 year before you became disabled?':
            'Yes',
          'Name of employer': 'DreamJob Inc.',
          Address: 'render address',
          'Job title': 'Construction',
          From: '01/01/1980',
          To: '01/01/1989',
          'How many days lost to disability': '300',
          'Total annual earnings': '$30,000.00',
        },
      };
    case 'household-information':
      return {
        'Marriage history': {
          'What’s your marital status?': 'Never married',
        },
        'Dependent children': {
          'Do you have any dependent children?': 'No',
        },
      };
    case 'financial-disclosure':
      return {
        'Helen Garcia’s net worth': {
          'Cash/Non-interest bearing accounts': '$0.00',
          'Interest bearing accounts': '$0.00',
          'IRAs, KEOGH Plans, etc.': '$0.00',
          'Stocks, bonds,mutual funds, etc.': '$0.00',
          'Real property (not your home, vehicle, furniture, or clothing)':
            '$0.00',
        },
        'Helen Garcia’s monthly income': {
          'Social Security': '$0.00',
          'US Civil Service': '$0.00',
          'US Railroad Retirement': '$0.00',
          'Black Lung Benefits': '$0.00',
          'Service Retirement': '$0.00',
          'Supplemental Security Income (SSI) or Public Assistance': '$0.00',
        },
        'Helen Garcia’s expected income': {
          'Gross wages and salary': '$0.00',
          'Total dividends and interest': '$0.00',
        },
      };
    case 'additional-information':
      return {
        'Direct deposit': {
          'You did not select to use direct deposit': '',
        },
        'Contact information': {
          'Mailing Address': 'render mailing address',
          'Primary email': formData.email,
          'Secondary email': 'None',
          'Daytime phone': 'None',
          'Evening phone': 'None',
          'Mobile phone': '(202) 111-1111',
        },
        'Document upload': {
          Test: 'test',
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
  'General history',
  'Reserve and National Guard',
  'POW status & severance pay',
  'Disability history',
  'Employment history',
  'Marriage history',
  'Dependent children',
  'Helen Garcia’s net worth',
  'Helen Garcia’s monthly income',
  'Helen Garcia’s expected income',
  'Helen Garcia’s expenses',
  'Direct deposit',
  'Contact information',
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
    const resource = '/in_progress_forms/21P-527EZ';

    apiRequest(resource)
      .then(responseData => {
        setData(responseData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

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
      <h1>Review Pension Benefits Application</h1>
      <p>VA Form 21P-527EZ</p>
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
              text="Learn more about how to apply for VA pension benefits"
            />
          </va-alert>
          <h3>Apply by mail</h3>
          <p>
            Fill out an Application for Veterans Pension (VA Form 21P-527EZ).
          </p>
          <div>
            <va-link
              download
              filetype="PDF"
              href="https://www.vba.va.gov/pubs/forms/VBA-21P-530EZ-ARE.pdf"
              pages={8}
              text="Download VA form 21P-527EZ"
            />
            <p>
              We’ve captured your intent to file date of
              <strong>XX/XX/XXXX</strong>. You have 12 months from that date to
              submit a claim.
            </p>
            <p className="vads-u-margin-bottom--4">
              Mail your pension form to the pension management center:
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
