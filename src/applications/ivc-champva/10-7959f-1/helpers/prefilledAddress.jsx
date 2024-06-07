import React from 'react';

const PrefilledAddress = props => {
  const { isLoggedIn } = props;
  return isLoggedIn ? (
    <div>
      <p>
        Any updates you make here to the contact information will only apply to
        this form. If you want to update your contact information for all your
        VA accounts, please go to your profile page.
      </p>
    </div>
  ) : (
    <div />
  );
};

export default PrefilledAddress;
