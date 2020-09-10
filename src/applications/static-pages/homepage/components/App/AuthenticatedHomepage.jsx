// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export const AuthenticatedHomepage = () => {
  return <div>This is the new authenticated homepage.</div>;
};

AuthenticatedHomepage.propTypes = {};

const mapStateToProps = state => {};

export default connect(
  mapStateToProps,
  null,
)(AuthenticatedHomepage);
