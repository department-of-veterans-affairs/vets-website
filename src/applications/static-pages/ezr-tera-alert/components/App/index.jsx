import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export const App = ({ isEzrEnabled }) => {
  return isEzrEnabled ? (
    <>
      <va-alert status="info" uswds data-testid="ezr-tera-alert-auth">
        <h2 slot="headline">
          Veterans enrolled in VA health care and expansion of benefits
        </h2>
        <div>
          <p className="vads-u-margin-top--0">
            On <strong>March 5, 2024</strong>, we expanded health care to
            millions more Veterans.
          </p>
          <p className="vads-u-margin-top--0">
            Learn more about the PACT Act and VA health care and benefits
            <a
              className="vads-c-action-link--green"
              href="https://www.va.gov/resources/the-pact-act-and-your-va-benefits/"
            >
              https://www.va.gov/resources/the-pact-act-and-your-va-benefits/
            </a>
          </p>
          <p className="vads-u-margin-top--0">
            Veterans who are enrolled in VA health care can now answer more
            questions about their military service history. We’ll use this
            information to determine if you may have had exposure to any toxins
            or other hazards. And we’ll determine if we’ll place you in a higher
            priority group. This may affect how much (if anything) you’ll have
            to pay towards the cost of your care
          </p>
          <p className="vads-u-margin-top--0">
            These questions are only available on our PDF form at this time. If
            you want to answer these questions, you’ll need to submit your form
            by mail or in person.
          </p>
        </div>
      </va-alert>
    </>
  ) : (
    <>
      <va-alert status="info" uswds data-testid="ezr-tera-alert-noauth">
        <h2 slot="headline">
          Veterans enrolled in VA health care and expansion of benefits
        </h2>
        <div>
          <p className="vads-u-margin-top--0">
            On <strong>March 5, 2024</strong>, we expanded health care to
            millions more Veterans.
          </p>
          <p className="vads-u-margin-top--0">
            Learn more about the PACT Act and VA health care and benefits
            <a
              className="vads-c-action-link--green"
              href="https://www.va.gov/resources/the-pact-act-and-your-va-benefits/"
            >
              https://www.va.gov/resources/the-pact-act-and-your-va-benefits/
            </a>
          </p>
          <p className="vads-u-margin-top--0">
            Veterans who are enrolled in VA health care can now provide more
            information about their military service history.
          </p>
          <p className="vads-u-margin-top--0">
            We’ll use this information to determine if you may have had exposure
            to any toxins or other hazards. And we’ll also determine if we’ll
            place you in a higher priority group. This may affect how much (if
            anything) you’ll have to pay towards the cost of your care.
          </p>
        </div>
      </va-alert>
    </>
  );
};

App.propTypes = {
  isEzrEnabled: PropTypes.bool,
};

const mapStateToProps = state => ({
  isEzrEnabled: state.featureToggles.ezrProdEnabled,
});

export default connect(mapStateToProps)(App);
