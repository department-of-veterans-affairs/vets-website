import React, { useCallback, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { VaSelect } from 'web-components/react-bindings';

import { useFormRouting } from '../../../hooks/useFormRouting';
import { makeSelectEditContext } from '../../../selectors';
import {
  createClearEditContext,
  createSetPendingEditedData,
} from '../../../actions/edit';
import CancelButton from './shared/CancelButton';
import UpdateButton from './shared/UpdateButton';
import Footer from '../../Footer';
import BackToHome from '../../BackToHome';

export default function Relationship(props) {
  const { router } = props;
  const { jumpToPage } = useFormRouting(router);
  const selectEditContext = useMemo(makeSelectEditContext, []);
  const { editing } = useSelector(selectEditContext);
  const { editingPage, key, originatingUrl, value } = editing;
  const [relationshipValue, setRelationshipValue] = useState(value);

  const dispatch = useDispatch();
  const clearEditContext = useCallback(
    () => {
      dispatch(createClearEditContext());
    },
    [dispatch],
  );

  const handleUpdate = useCallback(
    () => {
      dispatch(
        createSetPendingEditedData(
          { relationship: relationshipValue },
          editingPage,
        ),
      );
    },
    [dispatch, editingPage, relationshipValue],
  );

  useEffect(() => {
    focusElement('h1');
    scrollToTop('topScrollElement');
  }, []);

  const onChange = useCallback(
    event => {
      setRelationshipValue(event.detail.value);
    },
    [setRelationshipValue],
  );

  const relationshipOptions = useMemo(
    () => ({
      SPOUSE: 'Spouse',
      CHILD: 'Child',
      BROTHER: 'Brother',
      SISTER: 'Sister',
      MOTHER: 'Mother',
      FATHER: 'Father',
    }),
    [],
  );

  let title = '';
  switch (editingPage) {
    case 'nextOfKin':
      title = "Edit next of kin's relationship to you";
      break;
    case 'emergencyContact':
      title = "Edit emergency contact's relationship to you";
      break;
    default:
      title = 'Edit relationship value';
  }
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--6 vads-u-padding-top--2 edit-relationship-page">
      <h1 data-testid="header">{title}</h1>
      <VaSelect
        error={null}
        label="Relationship"
        name={key}
        required
        onVaSelect={onChange}
        value={relationshipValue}
        className="vads-u-margin-bottom--3"
      >
        {Object.keys(relationshipOptions).map(optionValue => (
          <option key={optionValue} value={optionValue}>
            {relationshipOptions[optionValue]}
          </option>
        ))}
      </VaSelect>
      <UpdateButton
        jumpToPage={jumpToPage}
        backPage={originatingUrl}
        clearData={clearEditContext}
        handleUpdate={handleUpdate}
      />
      <CancelButton
        jumpToPage={jumpToPage}
        backPage={originatingUrl}
        clearData={clearEditContext}
      />
      <Footer />
      <BackToHome />
    </div>
  );
}

Relationship.propTypes = {
  router: PropTypes.object,
};
