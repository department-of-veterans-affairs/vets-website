import React from 'react';
import { withRouter } from 'react-router';
import recordEvent from 'platform/monitoring/record-event';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { focusElement } from 'platform/utilities/ui';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

const alreadyReceivingCarePath =
  '/health-care/covid-19-vaccine/stay-informed/form';
const newlyEligiblePath = `/eligibility`;

class LocationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSelection: '',
      errorMessage: null,
    };
  }

  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  setSelected(selected) {
    this.setState({
      currentSelection: selected,
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

    const isEnrolledInVaHealthCare =
      this.state.currentSelection.value === 'Yes';

    if (isEnrolledInVaHealthCare) {
      document.location.assign(alreadyReceivingCarePath);
    } else {
      this.props.router.push(newlyEligiblePath);
    }
  }

  render() {
    return (
      <div className="schemaform-intro">
        <br />
        <FormTitle title="Sign up to get a COVID-19 vaccine at VA" />

        <fieldset
          className="fieldset-input"
          style={{
            marginTop: '-2em',
          }}
        >
          <p>
            <VaRadio
              className="vads-u-margin-y--5"
              id="introductionRadios"
              error={this.state.errorMessage}
              onVaValueChange={val => this.setSelected(val)}
              label="Are you a Veteran who is enrolled in VA health care or receiving care at VA?"
              value={this.state.currentSelection}
              required
            >
              <va-radio-option name="yes1" value="Yes" label="Yes" />
              <va-radio-option name="no1" value="No" label="No" />
              <va-radio-option
                name="unsure1"
                value="I'm not sure"
                label="I'm not sure"
              />
            </VaRadio>
          </p>
        </fieldset>
      </div>
    );
  }
}

export default withRouter(LocationPage);
