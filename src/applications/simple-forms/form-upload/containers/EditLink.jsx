import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const EditLink = ({ href, router }) => {
  const [link, setLink] = useState(null);

  useEffect(
    () => {
      setLink(href);
    },
    [href],
  );

  function onClick(e) {
    e.preventDefault();
    router.push(link);
  }

  return <VaLink href={href} onClick={onClick} text="Edit" />;
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default withRouter(connect(mapStateToProps)(EditLink));

EditLink.propTypes = {
  href: PropTypes.string,
  router: PropTypes.object,
};
