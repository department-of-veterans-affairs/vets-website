import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom-v5-compat';

import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

const FormUploadApp = () => {
  const user = useSelector(state => state?.user);
  useEffect(() => {
    document.title = 'Upload VA Form 21-0779 | Veterans Affairs';
  }, []);

  return (
    <RequiredLoginView user={user} serviceRequired={[]}>
      <Outlet />
    </RequiredLoginView>
  );
};

export default FormUploadApp;
