import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { getNextPagePath } from '~/platform/forms-system/src/js/routing';
import { setData } from '~/platform/forms-system/src/js/actions';
import { toggleLoginModal as toggleLoginModalAction } from '~/platform/site-wide/user-nav/actions';
import ClaimantTypeForm from './ClaimantTypeForm';

const ClaimantType = props => {
  const { router, setFormData } = props;

  const { data: formData } = useSelector(state => state.form);
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
      const nextPagePath = getNextPagePath(pageList, formData, pathname);
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
  route: PropTypes.object,
  setFormData: PropTypes.func,
};

const mapDispatchToProps = {
  setFormData: setData,
  toggleLoginModal: toggleLoginModalAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(ClaimantType);
