import React from 'react';
import recordEvent from 'platform/monitoring/record-event';

import { focusElement } from 'platform/utilities/ui';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

const alreadyReceivingCarePath =
  '/health-care/covid-19-vaccine/stay-informed/form';
const newlyEligiblePath = '/covid-vaccine/verify-eligibility';

class IntroductionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentSelection: '', nextUrl: '' };
  }
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');

    // These do NOT reset the checked status, not sure why
    document.getElementById('yes').checked = false;
    document.getElementById('no').checked = false;
    document.getElementById('imnotsure').checked = false;
  }

  setSelected(selected) {
    this.setState({
      currentSelection: selected,
      nextUrl:
        selected === 'yes' ? alreadyReceivingCarePath : newlyEligiblePath,
    });
  }
  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Sign up to get a COVID-19 vaccine at VA" />
        <fieldset className="fieldset-input">
          <legend className="legend-label vads-u-font-size--h3">
            Are you a Veteran who is enrolled in VA health care or receiving
            care at VA?
          </legend>
          <div className="form-radio-buttons">
            <div className="radio-button">
              <input
                type="radio"
                id="yes"
                name="enrolledInVaCheck"
                value="Yes"
                onChange={() => this.setSelected('yes')}
                checked={this.state.currentSelection === 'yes'}
              />
              <label name="yes-label" htmlFor="yes">
                Yes
              </label>
            </div>
            <div className="radio-button">
              <input
                type="radio"
                id="no"
                name="enrolledInVaCheck"
                value="No"
                onChange={() => this.setSelected('no')}
                checked={this.state.currentSelection === 'no'}
              />
              <label name="no-label" htmlFor="no">
                No
              </label>
            </div>
            <div className="radio-button">
              <input
                type="radio"
                id="imnotsure"
                name="enrolledInVaCheck"
                value="I'm not sure"
                onChange={() => this.setSelected('imnotsure')}
                checked={this.state.currentSelection === 'imnotsure'}
              />
              <label name="imnotsure-label" htmlFor="imnotsure">
                I'm not sure
              </label>
            </div>
          </div>
          <button
            type="button"
            className="usa-button"
            onClick={() => {
              recordEvent({
                event: 'cta-button-click',
                'button-type': 'default',
                'button-click-label': 'I have used VA health care before',
                'button-background-color': '#0071bb',
              });
              window.location.href = this.state.nextUrl;
            }}
          >
            Continue
          </button>
        </fieldset>
      </div>
    );
  }
}

export default IntroductionPage;
