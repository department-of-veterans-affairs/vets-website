import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PreMulesoftContent from '../components/ConfirmationPage/Content/PreMulesoftContent';
import PostMulesoftContent from '../components/ConfirmationPage/Content/PostMulesoftContent';

const ConfirmationPage = ({ form, usingAsync }) => {
  return usingAsync ? (
    <PostMulesoftContent form={form} />
  ) : (
    <PreMulesoftContent form={form} />
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.object,
  usingAsync: PropTypes.bool,
};

const mapStateToProps = state => ({
  form: state.form,
  usingAsync: state.featureToggles.caregiverAsync,
});

export default connect(mapStateToProps)(ConfirmationPage);
