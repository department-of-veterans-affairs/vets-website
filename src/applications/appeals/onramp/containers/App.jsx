import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from '../components/Breadcrumbs';
import { QUESTION_MAP } from '../constants/question-data-map';

const App = ({ children }) => {
  document.title = `${QUESTION_MAP.HOME} | Veterans Affairs`;

  return (
    <div className="onramp-app row vads-u-padding-bottom--8">
      <Breadcrumbs />
      <div className="usa-width-two-thirds medium-8 columns">
        {children}
        <va-need-help>
          <div slot="content">
            <p>
              Call us at <va-telephone contact="8008271000" />. We’re here
              Monday through Friday, 8:00 a.m to 9:00 p.m ET. If you have
              hearing loss, call <va-telephone contact="711" tty />.
            </p>
          </div>
        </va-need-help>
      </div>
    </div>
  );
};

App.propTypes = {
  children: PropTypes.node,
};

export default App;
