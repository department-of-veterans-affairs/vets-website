import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const EditLink = ({ href, router, label }) => {
  function onClick(e) {
    e.preventDefault();
    router.push(href);
  }

  return (
    <p>
      <VaLink href={href} onClick={onClick} text="Edit" label={label} />
    </p>
  );
};

export default withRouter(EditLink);

EditLink.propTypes = {
  href: PropTypes.string,
  label: PropTypes.string,
  router: PropTypes.object,
};
