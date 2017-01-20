import React from 'react';

const ErrorMessages = ({ errors }) => {
  if (errors && errors.length > 0) {
    return (<div className="rx-error-messages">
      <ul>
      {
        errors.map(e => {
          return (
            <li key={e.code}>
              Error {e.code}: {e.detail}
            </li>
          );
        })
      }
      </ul>
    </div>);
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
