import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { Link } from 'react-router';
import environment from 'platform/utilities/environment';

import { focusElement } from 'platform/utilities/ui';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Sign up to get a COVID-19 vaccine at VA" />
        <h2>
          Are you a Veteran who is enrolled in VA health care or receiving care
          at VA?
        </h2>
        <p>
          <a
            className="usa-button"
            href={encodeURI(
              `${
                environment.BASE_URL
              }/health-care/covid-19-vaccine/stay-informed/form`,
            )}
            onClick={() => {
              recordEvent({
                event: 'cta-button-click',
                'button-type': 'default',
                'button-click-label': 'I have used VA health care before',
                'button-background-color': '#0071bb',
              });
            }}
          >
            I have used VA health care before
          </a>
          <Link
            className="usa-button"
            to="/verify-eligibility"
            onClick={() => {
              recordEvent({
                event: 'cta-button-click',
                'button-type': 'default',
                'button-click-label': 'I am new to VA health care',
                'button-background-color': 'transparent',
              });
            }}
          >
            I am new to VA health care
          </Link>
          <Link
            className="usa-button"
            to="/verify-eligibility"
            onClick={() => {
              recordEvent({
                event: 'cta-button-click',
                'button-type': 'default',
                'button-click-label': "I'm not sure",
                'button-background-color': 'transparent',
              });
            }}
          >
            I'm not sure
          </Link>
        </p>
      </div>
    );
  }
}

export default IntroductionPage;
