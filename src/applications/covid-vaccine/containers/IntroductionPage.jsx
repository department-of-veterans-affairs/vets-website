import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import ProgressButton from '@department-of-veterans-affairs/component-library/ProgressButton';

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
  }

  setSelected(selected) {
    this.setState({
      currentSelection: selected,
      nextUrl:
        selected.value === 'Yes' ? alreadyReceivingCarePath : newlyEligiblePath,
    });
  }
  loadNextPage() {
    recordEvent({
      event: 'cta-button-click',
      'button-type': 'default',
      'button-click-label': 'I have used VA health care before',
      'button-background-color': '#0071bb',
    });
    window.location.href = this.state.nextUrl;
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Sign up to get a COVID-19 vaccine at VA" />
        <fieldset className="fieldset-input u-vads-margin-top--10">
          <RadioButtons
            id="introductionRadios"
            errorMessage=""
            onKeyDown={function noRefCheck() {}}
            onMouseDown={function noRefCheck() {}}
            onValueChange={val => this.setSelected(val)}
            options={['Yes', 'No', "I'm not sure"]}
            value={this.state.currentSelection}
            label="Are you a Veteran who is enrolled in VA health care or receiving
            care at VA?"
            required
          />
          <ProgressButton
            id="continueButton"
            afterText="»"
            buttonText="Continue"
            onButtonClick={() => this.loadNextPage()}
            disabled={this.state.currentSelection === ''}
          />
        </fieldset>
      </div>
    );
  }
}

export default IntroductionPage;
