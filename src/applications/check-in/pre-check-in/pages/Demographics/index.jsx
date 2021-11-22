import React from 'react';
import BackToHome from '../../components/BackToHome';
import { useFormRouting } from '../../hooks/useFormRouting';
import DemographicItem from '../../../components/DemographicItem';
import PropTypes from 'prop-types';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';

const Demographics = props => {
  const { router } = props;
  const { goToNextPage, goToPreviousPage, currentPage } = useFormRouting(
    router,
  );
  const demographicFields = [
    { title: 'Mailing address', key: 'mailingAddress' },
    { title: 'Home address', key: 'homeAddress' },
    { title: 'Home phone', key: 'homePhone' },
    { title: 'Mobile phone', key: 'mobilePhone' },
    { title: 'Work phone', key: 'workPhone' },
    { title: 'Email address', key: 'emailAddress' },
  ];
  // Temp data
  const demographics = {
    nextOfKin1: {
      name: 'VETERAN,JONAH',
      relationship: 'BROTHER',
      phone: '1112223333',
      workPhone: '4445556666',
      address: {
        street1: '123 Main St',
        street2: 'Ste 234',
        street3: '',
        city: 'Los Angeles',
        county: 'Los Angeles',
        state: 'CA',
        zip: '90089',
        zip4: '',
        country: 'USA',
      },
    },
    mailingAddress: {
      street1: '123 Turtle Trail',
      street2: '',
      street3: '',
      city: 'Treetopper',
      state: 'Tennessee',
      zip: '101010',
    },
    homeAddress: {
      street1: '445 Fine Finch Fairway',
      street2: 'Apt 201',
      city: 'Fairfence',
      state: 'Florida',
      zip: '445545',
    },
    homePhone: '5552223333',
    mobilePhone: '5553334444',
    workPhone: '5554445555',
    emailAddress: 'kermit.frog@sesameenterprises.us',
  };
  //
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--6 vads-u-padding-top--2 check-in-demographics">
      <BackButton action={goToPreviousPage} path={currentPage} />
      <h1>Is this your current contact information?</h1>
      <p className="vads-u-font-family--serif">
        If you need to make changes, please talk to a staff member when you
        check in.
      </p>
      <div className="vads-u-border-color--primary vads-u-border-left--5px vads-u-margin-left--0p5 vads-u-padding-left--2">
        <dl>
          {demographicFields.map(demographicField => (
            <React.Fragment key={demographicField.key}>
              <dt className="vads-u-font-size--h3 vads-u-font-family--serif">
                {demographicField.title}
              </dt>
              <dd>
                {demographicField.key in demographics &&
                demographics[demographicField.key] ? (
                  <DemographicItem
                    demographic={demographics[demographicField.key]}
                  />
                ) : (
                  'Not available'
                )}
              </dd>
            </React.Fragment>
          ))}
        </dl>
      </div>
      <button
        onClick={() => goToNextPage()}
        className={'usa-button-secondary'}
        data-testid="yes-button"
      >
        Yes
      </button>
      <button
        onClick={() => goToNextPage()}
        className="usa-button-secondary vads-u-margin-top--2"
        data-testid="no-button"
      >
        No
      </button>
      <Footer />
      <BackToHome />
    </div>
  );
};

Demographics.propTypes = {
  router: PropTypes.object,
};

export default Demographics;
