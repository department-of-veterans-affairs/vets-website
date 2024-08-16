import React from 'react';
import PropTypes from 'prop-types';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

const NotInGoodStanding = ({ goToPath }) => {
  return (
    <>
      <va-alert status="error" visible>
        <h2 slot="headline">
          You must be in good standing with the bar to become accredited.
        </h2>
        <p>
          In order to be accredited by VA as an attorney, an individual must be
          a member in good standing of the bar of the highest court of a state
          or territory of the United States. You may continue with the
          application, but it may be rejected. If you still desire to become
          accredited by VA, you should consider applying for accreditation as a
          claims agent or through a VA recognized Veterans Service Organization
          (VSO) as a service organization representative, using{' '}
          <va-link
            href="https://www.va.gov/vaforms/va/pdf/va21.pdf"
            text="VA Form 21"
          />
          .
        </p>
      </va-alert>
      <FormNavButtons
        goBack={() => goToPath('/standing-with-bar')}
        goForward={() => goToPath('/name-date-of-birth')}
        submitToContinue={false}
      />
    </>
  );
};

NotInGoodStanding.propTypes = {
  goToPath: PropTypes.func,
};

export default NotInGoodStanding;
