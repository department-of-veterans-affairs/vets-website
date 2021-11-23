import React, { useState } from 'react';
import { DISMISSED_ANNOUNCEMENTS } from '../constants';

const FullwidthBannerAlert = ({ banners }) => {
  const [isHidden, setIsHidden] = useState(
    (sessionStorage.getItem(DISMISSED_ANNOUNCEMENTS) || '') !== '',
  );
  const { id, body, title, dismissible, alert_type: alertType } = banners;
  const bodyContent = () => {
    return { __html: body };
  };
  return (
    <>
      {isHidden ? null : (
        <va-alert
          key={id}
          visible
          full-width
          closeable={dismissible === 'dismiss' ? `true` : `false`}
          onClose={() => {
            setIsHidden(true);
            sessionStorage.setItem(DISMISSED_ANNOUNCEMENTS, 'hidden');
          }}
          status={alertType}
        >
          <h3 slot="headline">{title}</h3>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={bodyContent()} />
        </va-alert>
      )}
    </>
  );
};

export default FullwidthBannerAlert;
