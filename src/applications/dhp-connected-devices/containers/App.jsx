import React from 'react';
import { connect } from 'react-redux';
import SignIn from '../../static-pages/cta-widget/components/messages/SignIn';

const mapStateToProps = state => ({
  isLoggedIn: state?.user?.login?.currentlyLoggedIn,
});

function App(isLoggedIn) {
  function buttonHandler() {
    return isLoggedIn;
  }
  return (
    <div className="usa-grid-full margin">
      <div className="usa-width-three-fourths">
        <div className="schemaform-title">
          <h1>Connect your health devices</h1>
        </div>
        <div className="va-introtext">
          <p>
            Connecting a device will share your health data with VA. Connected
            devices can share data including activity, blood glucose, blood
            pressure, weight, and more. By connecting a device, this data is
            automatically shared with your care team.
          </p>
        </div>
        <p>
          <strong>Note:</strong> Your shared data will not be monitored by your
          VA care team. If you have concerns about any specific shared data, you
          must contact your care team directly.
        </p>
        <div className="schemaform-title">
          <h2>Connected devices</h2>
        </div>
        <SignIn
          primaryButtonHandler={buttonHandler}
          serviceDescription="connect a device"
          testId="sign-in"
        />
        <div className="schemaform-title">
          <h2>Frequently asked questions</h2>
        </div>
        <va-accordion
          disable-analytics={{
            value: 'false',
          }}
          section-heading={{
            value: 'null',
          }}
        >
          <va-accordion-item id="first">
            <h6 slot="headline">Question 1</h6>
          </va-accordion-item>
          <va-accordion-item header="Question 2" id="second" />
          <va-accordion-item header="Question 3" id="third" />
        </va-accordion>
      </div>
    </div>
  );
}

export default connect(mapStateToProps)(App);
