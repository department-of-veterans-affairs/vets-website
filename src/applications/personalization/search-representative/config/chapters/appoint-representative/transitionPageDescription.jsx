import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  createPageList,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import formConfig from '../../form';
import RepCard from '../../../components/RepCard';

const TransitionPageDescription = props => {
  const formPages = createFormPageList(formConfig);
  const pageList = createPageList(formConfig, formPages);

  return (
    <>
      <RepCard preferredRepresentative={props.preferredRepresentative} />
      <SaveInProgressIntro
        buttonOnly
        unauthStartText="Sign in and search for a representative"
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        formConfig={formConfig}
        pageList={pageList}
        downtime={formConfig.downtime}
      />
      <va-alert status="warning">
        <h3 slot="headline">Before you continue</h3>
        <div>
          <p>
            Keep in mind, appointing this representative will replace your
            current representative.
          </p>
        </div>
      </va-alert>
      <p className="vads-u-padding-top--4 vads-u-padding-bottom--4">
        Continue to the next step to pre-fill the Appointment Form 21-22a for
        this selected representative
      </p>
    </>
  );
};

const mapStateToProps = state => ({
  preferredRepresentative: state.form.data.preferredRepresentative,
});

TransitionPageDescription.propTypes = {
  preferredRepresentative: PropTypes.object,
};

export default connect(mapStateToProps, {})(TransitionPageDescription);
