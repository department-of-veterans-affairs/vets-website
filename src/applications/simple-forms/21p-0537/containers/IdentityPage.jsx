import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import { setData } from 'platform/forms-system/src/js/actions';
import { FormFooter } from '@department-of-veterans-affairs/va-forms-system-core';
import IdentityForm from '../components/IdentityPage/IdentityForm';
import IdentityPageDescription from '../components/IdentityPage/IdentityPageDescription';

const IdentityPage = ({ location, route, router }) => {
  const [localData, setLocalData] = useState({});
  const dispatch = useDispatch();

  const formData = useSelector(state => state.form.data);

  const onChange = useCallback(data => setLocalData(data), []);
  const goToNextPage = useCallback(
    () =>
      router.push(getNextPagePath(route.pageList, formData, location.pathname)),
    [formData, location.pathname, route.pageList, router],
  );
  const triggerPrefill = useCallback(() => {
    const dataToSet = {
      ...formData,
      emailAddress: localData.email,
      primaryPhone: localData.phone,
      'view:recipientName': localData.fullName,
    };
    dispatch(setData(dataToSet));
  }, [dispatch, formData, localData]);

  const onSubmit = () => {
    triggerPrefill();
    goToNextPage();
  };

  return (
    <>
      <div className="progress-box progress-box-schemaform vads-u-padding-x--0">
        <IdentityPageDescription />
        <IdentityForm
          data={localData}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      </div>
      <FormFooter />
    </>
  );
};

IdentityPage.propTypes = {
  location: PropTypes.object,
  route: PropTypes.object,
  router: PropTypes.object,
};

export default IdentityPage;
