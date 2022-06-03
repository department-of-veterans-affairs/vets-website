import React, { useCallback, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { useFormRouting } from '../../../hooks/useFormRouting';
import { makeSelectEditContext } from '../../../selectors';
import {
  createClearEditContext,
  createSetPendingEditedData,
} from '../../../actions/edit';
import CancelButton from './shared/CancelButton';
import UpdateButton from './shared/UpdateButton';
import Header from './shared/Header';
import Footer from '../../layout/Footer';
import BackToHome from '../../BackToHome';

export default function Relationship(props) {
  const { router } = props;
  const { t } = useTranslation();
  const { jumpToPage } = useFormRouting(router);
  const selectEditContext = useMemo(makeSelectEditContext, []);
  const { editing } = useSelector(selectEditContext);
  const { editingPage, key, originatingUrl, value } = editing;
  const [relationshipValue, setRelationshipValue] = useState(value);
  const [relationshipErrorMessage, setRelationshipErrorMessage] = useState();

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
      if (!event.detail.value) {
        setRelationshipErrorMessage(t('relationship-is-required'));
      } else {
        setRelationshipErrorMessage();
      }
      setRelationshipValue(event.detail.value);
    },
    [setRelationshipValue, t],
  );

  const relationshipOptions = useMemo(
    () => ({
      WIFE: t('wife'),
      HUSBAND: t('husband'),
      DAUGHTER: t('daughter'),
      SON: t('son'),
      STEPCHILD: t('stepchild'),
      MOTHER: t('mother'),
      FATHER: t('father'),
      BROTHER: t('brother'),
      SISTER: t('sister'),
      GRANDCHILD: t('grandchild'),
      'NIECE/NEPHEW': t('niece-nephew'),
      'CHILD-IN-LAW': t('child-in-law'),
      EXTENDED_FAMILY_MEMBER: t('extended-family-member'),
      'UNRELATED-FRIEND': t('unrelated-friend'),
      WARD: t('ward'),
    }),
    [t],
  );

  const isUpdatable = useMemo(
    () => {
      return !relationshipErrorMessage && relationshipValue;
    },
    [relationshipErrorMessage, relationshipValue],
  );

  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--3 vads-u-padding-top--4 edit-relationship-page">
      <Header
        what={t('relationship-to-you')}
        editingPage={editingPage}
        value={value}
      />
      <VaSelect
        error={relationshipErrorMessage}
        label={t('relationship')}
        name={key}
        required
        onVaSelect={onChange}
        value={relationshipValue}
        className="vads-u-margin-bottom--2"
      >
        <option value=""> </option>
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
        isUpdatable={isUpdatable}
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
