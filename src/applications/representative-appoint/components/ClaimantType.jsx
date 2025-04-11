import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getNextPagePath } from '~/platform/forms-system/src/js/routing';
import { setData } from '~/platform/forms-system/src/js/actions';
import { toggleLoginModal as toggleLoginModalAction } from '~/platform/site-wide/user-nav/actions';
import { isLoggedIn } from 'platform/user/selectors';

import ClaimantTypeForm from './ClaimantTypeForm';

import prefillTransformer from '../config/prefillTransformer';

const ClaimantType = props => {
  const { formData, router, setFormData, loggedIn } = props;

  const [localData, setLocalData] = useState({});

  const handlers = {
    onChange: data => {
      setLocalData(data);
      setFormData({ ...formData, ...data });
    },
    onGoBack: () => {
      router.push('/introduction');
    },
    goForward: () => {
      const {
        location: { pathname },
        route: { pageList },
      } = props;

      // We perform prefill here instead of using the built in forms library
      //   because the formData attributes to populate change for Veteran
      //   and claimant applicants. That means we need to know the answer
      //   to the claimant type question before we can properly prefill.
      let nextPagePath;
      if (loggedIn) {
        const newFormData = prefillTransformer(formData);
        setFormData({ ...newFormData });
        nextPagePath = getNextPagePath(pageList, newFormData, pathname);
      } else {
        nextPagePath = getNextPagePath(pageList, formData, pathname);
      }

      router.push(nextPagePath);
    },
  };

  return (
    <div className="schemaform-intro">
      <ClaimantTypeForm
        data={localData}
        onChange={handlers.onChange}
        onGoBack={handlers.onGoBack}
        onSubmit={handlers.goForward}
      />
    </div>
  );
};

ClaimantType.propTypes = {
  formData: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  loggedIn: PropTypes.bool,
  route: PropTypes.object,
  router: PropTypes.object,
  setFormData: PropTypes.func,
};

const mapDispatchToProps = {
  setFormData: setData,
  toggleLoginModal: toggleLoginModalAction,
};

const mapStateToProps = state => ({
  formData: state.form?.data,
  loggedIn: isLoggedIn(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClaimantType);
