import React from 'react';
import PropTypes from 'prop-types';

export function DownMessaging({ appTitle }) {
  return `We’re making some updates to the ${appTitle}. We’re sorry it’s not working
  right now. Please check back soon.`;
}

DownMessaging.propTypes = {
  appTitle: PropTypes.string,
};

export default function Down({ appType, headerLevel = 3 }) {
  const Header = `h${headerLevel}`;
  return (
    <va-alert class="vads-u-margin-bottom--4" visible status="warning">
      <Header slot="headline">
        {`This ${appType} is down for maintenance`}
      </Header>
      <p>
        {`We’re making some updates to this ${appType} to help make it even
        better for Veterans, service members, and family members like you. We’re
        sorry it’s not working right now. Please check back soon.`}
      </p>
    </va-alert>
  );
}

Down.propTypes = {
  appType: PropTypes.string,
  headerLevel: PropTypes.number,
};
