import React from 'react';
import { connect } from 'react-redux';

import FormTitle from '../../common/schemaform/FormTitle';
import { getCurrentFormStep } from '../../common/utils/helpers';
import SegmentedProgressBar from '../../common/components/SegmentedProgressBar';
import NavHeader from '../../common/components/NavHeader';

import { chapters } from '../routes';

class VALettersApp extends React.Component {
  render() {
    const { children, location } = this.props;

    return (
      <div className="usa-grid">
        <div className="usa-width-two-thirds">
          <FormTitle title="Download VA Letters"/>
          <SegmentedProgressBar total={chapters.length} current={getCurrentFormStep(chapters, location.pathname)}/>
          <div className="schemaform-chapter-progress">
            <NavHeader path={location.pathname} chapters={chapters} className="nav-header-schemaform"/>
          </div>
          <div className="form-panel">
            {children}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const userState = state.user;
  return {
    profile: userState.profile
  };
}

export default connect(mapStateToProps)(VALettersApp);
