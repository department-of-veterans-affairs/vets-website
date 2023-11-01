import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const App = ({ show }) => {
  return show ? (
    <va-alert status="warning" uswds>
      <h3 slot="headline">This application may not be working right now</h3>
      <div>
        <p className="vads-u-margin-top--0">
          You may have trouble using this application at this time. We’re
          working to fix the problem. If you have trouble, you can try again or
          check back later.
        </p>
        <p>
          <strong>
            If you’re trying to apply by the September 30th special enrollment
            deadline for certain combat Veterans
          </strong>
          , you can also apply in other ways. Call us at{' '}
          <va-telephone contact={CONTACTS['222_VETS']} />. We’re here Friday,
          September 29, 7:00 a.m. to 9:00 p.m.{' '}
          <dfn>
            <abbr title="Central Time">CT</abbr>
          </dfn>
          , and Saturday, September 30, 7:00 a.m. to 11:59 p.m.{' '}
          <dfn>
            <abbr title="Central Time">CT</abbr>
          </dfn>
          . Mail us an application postmarked by September 30, 2023. Or bring
          your application in person to your nearest VA health facility.
        </p>
      </div>
    </va-alert>
  ) : null;
};

App.propTypes = {
  show: PropTypes.bool,
};

const mapStateToProps = state => ({
  show: state?.featureToggles?.hcaPerformanceAlertEnabled,
});

export default connect(
  mapStateToProps,
  null,
)(App);
