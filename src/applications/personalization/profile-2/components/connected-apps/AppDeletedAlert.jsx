import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export class AppDeletedAlert extends Component {
  componentDidMount() {
    focusElement('[data-focus-target]');
  }

  const { id, title, dismissAlert } = props;
  const alertMessage = `${title} won’t be able to see any new information
  about you from VA, but may still have access to information that was previously
  shared. To remove any stored data, contact ${title} and request permanent deletion`;

    return (
      <div tabIndex="-1" data-focus-target>
        <AlertBox
          status="success"
          headline="This app has been disconnected"
          content={alertMessage}
          onCloseAlert={() => dismissAlert(id)}
        />
      </div>
    );
  }
}

AppDeletedAlert.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  dismissAlert: PropTypes.func.isRequired,
};
