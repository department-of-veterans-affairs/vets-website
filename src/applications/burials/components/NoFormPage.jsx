import React, { useEffect, useState } from 'react';
import { apiRequest } from 'platform/utilities/api';
import { formatSSN } from 'platform/utilities/ui';

const convertDateFormat = date =>
  date.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$2/$3/$1');

const locationOfDeath = {
  nursingHome: 'Nursing home',
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
        'Claimant’s first name': formData.claimantFullName.first,
        'Claimant’s middle name': formData.claimantFullName?.middle ?? 'None',
        'Claimant’s last name': formData.claimantFullName.last,
        Suffix: formData.claimantFullName?.suffix ?? 'None',
        'Relationship to the deceased Veterans': formData.relationship.type,
      };
    case 'deceased-veteran-information':
      return {
        'Veteran’s first name': formData.veteranFullName.first,
        'Veteran’s middle name': formData.veteranFullName?.middle ?? 'None',
        'Veteran’s last name': formData.veteranFullName.last,
        Suffix: formData.veteranFullName?.suffix ?? 'None',
        'Social Security number': formatSSN(
          formData.veteranSocialSecurityNumber,
        ),
        'VA file number': formData.vaFileNumber,
        'Date of birth': convertDateFormat(formData.veteranDateOfBirth),
        'Place of birth (city and state or foreign country)':
          formData?.placeOfBirth ?? 'None',
        'Burial information': {
          'Date of death': convertDateFormat(formData.deathDate),
          'Date of burial (includes cremation or interment)': convertDateFormat(
            formData.burialDate,
          ),
          'Where did the Veteran’s death occur?':
            locationOfDeath[formData.locationOfDeath.location],
        },
      };
    case 'military-history':
      return {
        'Previous names': {
          'Did the Veteran serve under another name?':
            formData.previousNames.length > 0 ? formData.previousNames : 'No',
        },
      };
    case 'benefits-selection':
      return {
        'General selection': {
          'Burial allowance': 'Selected',
          'Plot or interment allowance (Check this box if you incurred expensed for the plot to bury the Veteran’s remains.)':
            'Selected',
          'Transportation expenses (Transportation of the Veteran’s remains from the place of death to the final resting place)':
            'None',
        },
        'Burial allowance': {
          'Type of burial allowance':
            'Service-connected death (for a Veteran death related to, or resulting from, a service-connected disability)',
          'Did you previously receive a VA burial allowance?': 'Yes',
        },
        'Plot or interment allowance': {
          'Place of burial or location of deceased Veteran’s remains':
            'Arlington Cemetary',
          'Was the Veteran buried in a state Veterans cemetary?': 'Yes',
          'Did a federal/state government or the Veteran’s employer contribute to the burial? (Not including employer life insurance)':
            'No',
        },
      };
    case 'additional-information':
      return {
        'Claimant contact information': {
          Address: 'render address',
          'Email address': 'render email',
          'Phone number': 'render phone',
        },
      };
    default:
      return {};
  }
};

const ArrayComponent = ({ value }) => {
  return value.map((name, index) => (
    <va-card key={index}>
      <p>
        <strong>First: </strong>
        {name.first}
      </p>
      <p>
        <strong>Middle: </strong>
        {name.middle ? name.middle : 'None'}
      </p>
      <p>
        <strong>Last: </strong>
        {name.last}
      </p>
      <p>
        <strong>Suffix: </strong>
        {name.suffix ? name.suffix : 'None'}
      </p>
    </va-card>
  ));
};

const h3Subsections = [
  'Burial Information',
  'Previous names',
  'General selection',
  'Burial allowance',
  'Plot or interment allowance',
  'Claimant contact information',
];

const CreateSummarySections = ({
  title = '',
  id = '',
  formData = {},
  bypassData = false,
}) => {
  const data = !bypassData ? generateData(id, formData) : formData;

  // console.log(data);
  return (
    <>
      {!bypassData ? (
        <>
          <h2 id={id}>{title}</h2>
          <hr />
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
                <p className="vads-u-color--gray">{key}</p>

                {Array.isArray(value) ? (
                  <ArrayComponent value={value} />
                ) : (
                  <p>{value}</p>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Example endpoint; update with the specific resource you want to fetch
    const resource = '/in_progress_forms/21P-530';

    // Making the API request
    apiRequest(resource)
      .then(responseData => {
        setData(responseData);
        setLoading(false);
        // console.log(responseData);
      })
      .catch(err => {
        setError(err);
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

  if (error) {
    return (
      <ul>
        Errors:
        {error.errors.map((e, i) => (
          <li key={i}>{e.title}</li>
        ))}
      </ul>
    );
  }

  const { formData } = data;

  return (
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
                You can still use the information here to fill out a paper form
                for VA burial benefits.
              </p>
            </div>
            <br />
            <va-link
              href="va.gov"
              text="Learn more about how to apply for VA burial benefits"
            />
          </va-alert>
          <h3>Send application by mail</h3>
          <p>Fill out an Application for Burial (VA Form 21P-530EZ).</p>
          <div>
            <va-link
              download
              filetype="PDF"
              href="https://www.vba.va.gov/pubs/forms/VBA-21P-530EZ-ARE.pdf"
              pages={8}
              text="Download VA form 21P-530EZ"
            />
            <p>
              Mail the completed form to the pension management center (PMC)
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
          </div>
        </>
      ) : (
        <div>Has no in progress form</div>
      )}
      {/* Render the fetched data if needed */}
    </div>
  );
};
