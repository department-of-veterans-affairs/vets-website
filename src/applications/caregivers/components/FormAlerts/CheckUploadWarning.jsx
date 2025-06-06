import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';

const CheckUploadWarning = () => {
  useEffect(() => {
    focusElement('va-alert[status="warning"]');
  }, []);

  return (
    <va-alert status="warning">
      <h3 slot="headline">Check your upload before you continue</h3>
      <p>
        It’s easy to upload the wrong file by mistake. We want to make sure that
        we will review the right document (such as a valid Power of Attorney,
        legal guardianship order, or other legal document). This will help speed
        up your application process.
      </p>
      <p>
        Check the file name. If it’s not the right file, you can delete it and
        upload another one before you continue.
      </p>
    </va-alert>
  );
};

export default React.memo(CheckUploadWarning);
