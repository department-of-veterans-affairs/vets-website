import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setData } from 'platform/forms-system/src/js/actions';
import { isLoggedIn } from 'platform/user/selectors';

const PrivacyPolicy = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state?.form?.data ?? {});
  const isAuthenticated = useSelector(state => isLoggedIn(state));

  useEffect(
    () => {
      // add authentication field to *formData* before transform
      dispatch(setData({ ...formData, isAuthenticated }));
    },
    [isAuthenticated],
  );

  return null;
};

export default PrivacyPolicy;
