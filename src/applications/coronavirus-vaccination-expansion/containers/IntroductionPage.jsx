import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import ProgressButton from '@department-of-veterans-affairs/component-library/ProgressButton';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

import { focusElement } from 'platform/utilities/ui';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { modalContents } from './privacyDataHelper';

import manifest from '../manifest.json';

const alreadyReceivingCarePath =
  '/health-care/covid-19-vaccine/stay-informed/form';
const newlyEligiblePath = `${manifest.rootUrl}/verify-eligibility`;

class IntroductionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSelection: '',
      errorMessage: null,
      nextUrl: '',
      showPrivacyModal: false,
    };
  }
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  setSelected(selected) {
    this.setState({
      currentSelection: selected,
      nextUrl:
        selected.value === 'Yes' ? alreadyReceivingCarePath : newlyEligiblePath,
      errorMessage: null,
    });
  }
  loadNextPage() {
    if (this.state.currentSelection === '') {
      this.setState({ errorMessage: 'Please select an option' });
      return;
    }

    recordEvent({
      event: 'cta-button-click',
      'button-type': 'default',
      'button-click-label': 'I have used VA health care before',
      'button-background-color': '#0071bb',
    });
    window.location.href = this.state.nextUrl;
  }
  togglePrivacyModal() {
    this.setState({ showPrivacyModal: !this.state.showPrivacyModal });
  }
  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Sign up to get a COVID-19 vaccine at VA" />
        <fieldset
          className="fieldset-input"
          style={{
            marginTop: '-2em',
          }}
        >
          <RadioButtons
            id="introductionRadios"
            errorMessage={this.state.errorMessage}
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
          />
        </fieldset>
        <button
          className="va-button-link"
          onClick={() => this.togglePrivacyModal()}
        >
          Privacy Act Statement
        </button>
        <Modal
          visible={this.state.showPrivacyModal}
          onClose={() => this.togglePrivacyModal()}
          status="info"
          // title="Privacy Act Statement"
          contents={modalContents(30)}
        />
      </div>
    );
  }
}

export default IntroductionPage;
