import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';

import { useFormRouting } from '../../../hooks/useFormRouting';
import { makeSelectEditContext } from '../../../selectors';
import CancelButton from './shared/CancelButton';

export default function Email(props) {
  const { router } = props;
  const { jumpToPage } = useFormRouting(router);
  const selectEditContext = useMemo(makeSelectEditContext, []);
  const { editing } = useSelector(selectEditContext);
  const { editingPage, key, originatingUrl, value } = editing;
  return (
    <div>
      <h1>Update your email</h1>
      <p>editing Page {editingPage}</p>
      <p>key {key}</p>
      <p>originatingUrl {originatingUrl}</p>
      <p>value {value}</p>
      <CancelButton jumpToPage={jumpToPage} backPage={originatingUrl} />
    </div>
  );
}

Email.propTypes = {
  router: PropTypes.object,
};
