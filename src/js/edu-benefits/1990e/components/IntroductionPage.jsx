import React from 'react';
import { withRouter } from 'react-router';
import { focusElement } from '../../../common/utils/helpers';
import ProgressButton from '../../../common/components/form-elements/ProgressButton';
import OMBInfo from '../../../common/components/OMBInfo';
import FormTitle from '../../../common/schemaform/FormTitle';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }
  goForward = () => {
    this.props.router.push(this.props.route.pageList[1].path);
  }
  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Manage Your Education Benefits"/>
        <p>This application is equivalent to Form 22-1990e (Application for Family Member to use transferred Benefits).</p>
        <div className="process schemaform-process">
          <ol>
            <li className="step one">
              <div><h5>Prepare</h5></div>
              <div><h6>What you need to fill out this application</h6></div>
            </li>
            <li className="step two">
              <div><h5>Apply to manage your Benefit</h5></div>
              <p>Complete this form.</p>
            </li>
            <li className="step three">
              <div><h5>VA Review</h5></div>
            </li>
            <li className="step four last">
              <div><h5>Decision</h5></div>
            </li>
          </ol>
        </div>
        <div className="row progress-box progress-box-schemaform form-progress-buttons schemaform-buttons">
          <div className="small-6 medium-5 columns">
            <a href="/education/apply-for-education-benefits/">
              <button className="usa-button-outline">« Back</button>
            </a>
          </div>
          <div className="small-6 medium-5 end columns">
            <ProgressButton
                onButtonClick={this.goForward}
                buttonText="Continue"
                buttonClass="usa-button-primary"
                afterText="»"/>
          </div>
        </div>
        <div className="omb-info--container">
          <OMBInfo resBurden={15} ombNumber="2900-0154" expDate="12/31/2019"/>
        </div>
      </div>
    );
  }
}

export default withRouter(IntroductionPage);
