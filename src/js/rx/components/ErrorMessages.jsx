import React from 'react';

const ErrorMessages = ({ errors }) => {
  if (errors && errors.length > 0) {
    return (<p>
      {
        errors.map(e => {
          return (
            <span key={e.code}>
              Error {e.code}: {e.detail}
              <br/>
            </span>
          );
        })
      }
    </p>);
  }
  return null;
};

ErrorMessages.propTypes = {
  errors: React.PropTypes.array,
};

ErrorMessages.defaultProps = {
  errors: [],
};

export default ErrorMessages;
