import React from 'react';
import _ from 'lodash/fp';
import classNames from 'classnames';

import ExpandingGroup from '../../common/components/form-elements/ExpandingGroup';
import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';

const levels = [
  ['benefitStatus'],
  ['serviceBenefitBasedOn', 'transferredEduBenefits'],
  ['nationalCallToService', 'sponsorDeceasedDisabledMIA'],
  ['sponsorTransferredBenefits']
];

export default class EducationWizard extends React.Component {
  constructor(props) {
    super(props);

    // flattens all the fields in levels into object keys
    this.state = [].concat(...levels).reduce((state, field) => {
      return Object.assign(state, { [field]: null });
    }, { open: false });

  }

  answerQuestion = (field, answer) => {
    const newState = Object.assign({}, { [field]: answer });

    const fields = [].concat(..._.dropWhile(level => !level.includes(field), levels));
    fields.forEach(laterField => {
      if (laterField !== field) {
        newState[laterField] = null;
      }
    });

    this.setState(newState);
  }

  render() {
    const eduForm = '/education/apply-for-education-benefits/application';
    const {
      benefitStatus,
      serviceBenefitBasedOn,
      nationalCallToService,
      transferredEduBenefits,
      sponsorDeceasedDisabledMIA,
      sponsorTransferredBenefits
    } = this.state;

    const classes = classNames('usa-button-primary', 'wizard-button', { 'va-button-primary': !this.state.open });

    return (
      <div className="wizard-container">
        <ExpandingGroup open={this.state.open}>
          <button
            className={classes}
            onClick={() => this.setState({ open: !this.state.open })}>
            Select Correct Form
          </button>
          <div className="wizard-content-inner">
            <ErrorableRadioButtons
              name="benefitStatus"
              options={[
                { label: 'Applying for a new benefit', value: 'new' },
                { label: 'Updating my current education benefits', value: 'existing' }
              ]}
              onValueChange={({ value }) => this.answerQuestion('benefitStatus', value)}
              value={{ value: benefitStatus }}
              label="Are you applying for a new benefit or updating your current education benefits?"/>
            {benefitStatus === 'new' && <ErrorableRadioButtons
              name="serviceBenefitBasedOn"
              options={[
                { label: 'Yes', value: 'own' },
                { label: 'No', value: 'other' }
              ]}
              onValueChange={({ value }) => this.answerQuestion('serviceBenefitBasedOn', value)}
              value={{ value: serviceBenefitBasedOn }}
              label="Are you a Veteran or Servicemember claiming a benefit based on your own service?"/>}
            {benefitStatus === 'existing' && <ErrorableRadioButtons
              name="transferredEduBenefits"
              options={[
                { label: 'No, I’m using my own benefit.', value: 'own' },
                { label: 'Yes, I’m using a transferred benefit.', value: 'transferred' },
                { label: 'No, I’m using the Fry Scholarship or DEA (Chapter 35)', value: 'fry' }
              ]}
              onValueChange={({ value }) => this.answerQuestion('transferredEduBenefits', value)}
              value={{ value: transferredEduBenefits }}
              label="Are you receiving education benefits transferred to you by a sponsor Veteran?"/>}
            {serviceBenefitBasedOn === 'own' && <ErrorableRadioButtons
              name="nationalCallToService"
              options={[
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' }
              ]}
              onValueChange={({ value }) => this.answerQuestion('nationalCallToService', value)}
              value={{ value: nationalCallToService }}
              label={<span>Are you claiming a <strong>National Call to Service</strong> education benefit? (This is uncommon)</span>}/>}
            {serviceBenefitBasedOn === 'other' && <ErrorableRadioButtons
              name="sponsorDeceasedDisabledMIA"
              options={[
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' }
              ]}
              onValueChange={({ value }) => this.answerQuestion('sponsorDeceasedDisabledMIA', value)}
              value={{ value: sponsorDeceasedDisabledMIA }}
              label="Is your sponsor deceased, 100% permanently disabled, MIA, or a POW?"/>}
            {sponsorDeceasedDisabledMIA === 'no' && <ErrorableRadioButtons
              name="sponsorTransferredBenefits"
              options={[
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' }
              ]}
              onValueChange={({ value }) => this.answerQuestion('sponsorTransferredBenefits', value)}
              value={{ value: sponsorTransferredBenefits }}
              label="Has your sponsor transferred their benefits to you?"/>}
            {benefitStatus === 'new' && serviceBenefitBasedOn === 'other' && sponsorDeceasedDisabledMIA === 'no' &&
              sponsorTransferredBenefits === 'no' &&
                <div className="usa-alert usa-alert-warning">
                  <div className="usa-alert-body">
                    <h4>Your application cannot be approved until your sponsor transfers their benefits.</h4>
                    <a target="_blank" href="https://www.dmdc.osd.mil/milconnect/public/faq/Education_Benefits-How_to_Transfer_Benefits">Instructions for your sponsor to transfer education benefits.</a>
                  </div>
                </div>}
            {benefitStatus === 'new' && nationalCallToService === 'yes' &&
              <a href={`${eduForm}/1990N`} className="usa-button va-button-primary">Apply Now</a>}
            {benefitStatus === 'new' && nationalCallToService === 'no' &&
              <a href={`${eduForm}/1990`} className="usa-button va-button-primary">Apply Now</a>}
            {benefitStatus === 'existing' && (transferredEduBenefits === 'transferred' || transferredEduBenefits === 'own') &&
              <a href={`${eduForm}/1995`} className="usa-button va-button-primary">Apply Now</a>}
            {benefitStatus === 'existing' && transferredEduBenefits === 'fry' &&
              <a href={`${eduForm}/5495`} className="usa-button va-button-primary">Apply Now</a>}
            {benefitStatus === 'existing' && serviceBenefitBasedOn === 'own' && sponsorDeceasedDisabledMIA === 'yes' &&
              <a href={`${eduForm}/5490`} className="usa-button va-button-primary">Apply Now</a>}
            {benefitStatus === 'new' && serviceBenefitBasedOn === 'other' && sponsorDeceasedDisabledMIA === 'no' &&
              sponsorTransferredBenefits !== null &&
              <a href={`${eduForm}/1990E`} className="usa-button va-button-primary">Apply Now</a>}
          </div>
        </ExpandingGroup>
      </div>
    );
  }
}
