import React from 'react';
import { withRouter } from 'react-router';
import { focusElement } from '../../common/utils/helpers';
import ProgressButton from '../../common/components/form-elements/ProgressButton';
import OMBInfo from '../../common/components/OMBInfo';
import FormTitle from '../../common/schemaform/FormTitle';

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
        <FormTitle title="Apply online for health care with the 10-10ez"/>
        <p>Once you’ve figured out if you qualify, applying for VA health care benefits is easy. Find out how to apply.</p>
        <div className="process schemaform-process">
          <div className="small-6 medium-5 end columns">
            <ProgressButton
                onButtonClick={this.goForward}
                buttonText="Continue"
                buttonClass="usa-button-primary"
                afterText="»"/>
          </div>
        </div>
        <div className="omb-info--container">
          <OMBInfo resBurden={0} ombNumber="2900-0091" expDate="??/??/????"/>
        </div>
      </div>
    );
  }
}

export default withRouter(IntroductionPage);
