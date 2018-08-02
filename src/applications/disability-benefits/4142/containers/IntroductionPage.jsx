import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { focusElement } from '../../../../platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/formation/OMBInfo';
import FormTitle from 'us-forms-system/lib/js/components/FormTitle';
import SaveInProgressIntro, { introActions, introSelector } from '../../../../platform/forms/save-in-progress/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for increased disability compensation"/>
        <h4>About private medical records</h4>
        <p>You said you were treated for [contidion] by a private doctor. If you have those records, you can upload them here, or we can get them for you. If you want us to get yoru recotds, you'll need to authorize their release.</p>
        <p>Do you want to upload your private medical records?</p>
        
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
