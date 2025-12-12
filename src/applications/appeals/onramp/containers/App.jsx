import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Breadcrumbs from '../components/Breadcrumbs';
import { QUESTION_CONTENT } from '../constants/question-data-map';

const App = ({ children, location, resultPage }) => {
  const getTitlecasedH1 = content => {
    return content
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const titlecasedH1 = getTitlecasedH1(QUESTION_CONTENT.INTRODUCTION.h1);

  document.title = `${titlecasedH1} | Veterans Affairs`;
  const route = location?.pathname.replace('/', '');

  return (
    <div className="onramp-app row vads-u-padding-bottom--8">
      <Breadcrumbs resultPage={resultPage} route={route} />
      <div className="usa-width-two-thirds medium-8 columns">
        {children}
        <va-need-help class="vads-u-margin-top--8">
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

const mapStateToProps = state => ({
  resultPage: state?.decisionReviewsGuide?.resultPage,
});

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  children: PropTypes.node,
  resultPage: PropTypes.string,
};

export default connect(mapStateToProps)(App);
