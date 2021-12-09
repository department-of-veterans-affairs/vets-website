import React from 'react';

const LoggedInPage = ({
  _data,
  _goBack,
  _goForward,
  _onReviewPage,
  _updatePage,
}) => {
  return (
    <div className="schemaform-intro">
      <h1>Hello, logged in user!</h1>
    </div>
  );
};

export default LoggedInPage;
