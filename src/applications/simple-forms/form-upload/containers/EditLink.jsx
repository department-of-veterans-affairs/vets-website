import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const EditLink = ({ href, router }) => {
  function onClick(e) {
    e.preventDefault();
    router.push(href);
  }

  return <VaLink href={href} onClick={onClick} text="Edit" />;
};

function mapStateToProps() {
  return {};
}

export default withRouter(connect(mapStateToProps)(EditLink));

EditLink.propTypes = {
  href: PropTypes.string,
  router: PropTypes.object,
};
