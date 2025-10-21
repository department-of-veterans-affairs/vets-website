import React from 'react';
import { useSelector } from 'react-redux';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import { selectUser } from 'platform/user/selectors';
import MyEligibilityAndBenefits from './MyEligibilityAndBenefits';

const ProtectedEligibilityRoute = () => {
  const user = useSelector(selectUser);

  return (
    <RequiredLoginView user={user}>
      <MyEligibilityAndBenefits />
    </RequiredLoginView>
  );
};

export default ProtectedEligibilityRoute;
