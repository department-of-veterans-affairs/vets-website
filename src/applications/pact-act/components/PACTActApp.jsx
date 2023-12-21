import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Breadcrumbs from './Breadcrumbs';

const PACTActApp = ({ children, currentPage }) => {
  return (
    <div className="pact-act-app row vads-u-padding-bottom--8">
      <Breadcrumbs currentPage={currentPage} />
      <div className="usa-width-two-thirds medium-8 columns">{children}</div>
    </div>
  );
};

const mapStateToProps = state => ({
  currentPage: state.pactAct.currentPage,
});

PACTActApp.propTypes = {
  currentPage: PropTypes.string.isRequired,
  children: PropTypes.any,
};

export default connect(mapStateToProps)(PACTActApp);
