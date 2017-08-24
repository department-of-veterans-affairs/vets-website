import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { focusElement } from '../../common/utils/helpers';
import OMBInfo from '../../common/components/OMBInfo';
import FormTitle from '../../common/schemaform/FormTitle';
import SaveInProgressIntro, { introActions, introSelector } from '../../common/schemaform/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  // TODO: Add shouldComponentUpdate(); it renders like 14 times upon page refresh

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply online for health care with the 10-10EZ"/>
        <p>
          Fill out this application with the most accurate information you have. The more accurate it is, the more likely you are to get a rapid response.
        </p>
        <p>
          VA uses the information you submit to determine your eligibility and to provide you with the best service.
        </p>
        <p>
          Federal law provides criminal penalties, including a fine and/or imprisonment for up to 5 years, for concealing a material fact or making a materially false statement. (See <a href="https://www.justice.gov/usam/criminal-resource-manual-903-false-statements-concealment-18-usc-1001" target="_blank">18 U.S.C. 1001</a>)
        </p>
        <SaveInProgressIntro
          pageList={this.props.route.pageList}
          messages={this.props.route.formConfig.savedFormMessages}
          {...this.props.saveInProgressActions}
          {...this.props.saveInProgress}>
          Please complete the 10-10EZ form to apply for health care benefits.
        </SaveInProgressIntro>
        {/* TODO: Remove inline style after I figure out why .omb-info--container has a left padding */}
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={30} ombNumber="2900-0091" expDate="05/31/2018"/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    saveInProgress: introSelector(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveInProgressActions: bindActionCreators(introActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IntroductionPage);

export { IntroductionPage };
