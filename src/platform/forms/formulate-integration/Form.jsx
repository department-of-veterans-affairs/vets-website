import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { useFormikContext, Form as FormikForm } from 'formik';
import { isEqual } from 'lodash';

import { setData as setDataAction } from 'platform/forms-system/src/js/actions';

export const Form = ({ setData, ...rest }) => {
  const { values } = useFormikContext();

  // Form rerenders potentially a bunch of times each time the values change.
  // This ensures we only fire the SET_DATA action once each time the data is
  // updated.
  const previousValues = useRef(values);
  if (!isEqual(previousValues.current, values)) {
    setData(values);
    previousValues.current = values;
  }

  return <FormikForm {...rest} />;
};

const mapDispatchToProps = { setData: setDataAction };

export default connect(null, mapDispatchToProps)(Form);
