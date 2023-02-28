import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FormFooter from 'platform/forms/components/FormFooter';
import SubTask from 'platform/forms/sub-task';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import pages from './pages';
import formConfig from '../config/form';
import { WIP } from '../components/WIP';

export const SubTaskContainer = ({ show995, isLoadingFeatures }) => {
  if (isLoadingFeatures) {
    return (
      <h1 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal vads-u-margin-bottom--4">
        <va-loading-indicator message="Loading application..." />
      </h1>
    );
  }

  return show995 ? (
    <article data-page="start" className="row">
      <div className="usa-width-two-thirds medium-8 columns vads-u-margin-bottom--2">
        <SubTask pages={pages} />
      </div>
      <FormFooter formConfig={formConfig} />
    </article>
  ) : (
    <WIP />
  );
};

SubTaskContainer.propTypes = {
  isLoadingFeatures: PropTypes.bool,
  show995: PropTypes.bool,
};

const mapStateToProps = state => ({
  isLoadingFeatures: toggleValues(state).loading,
  show995: toggleValues(state)[FEATURE_FLAG_NAMES.supplementalClaim] || false,
});

export default connect(mapStateToProps)(SubTaskContainer);
