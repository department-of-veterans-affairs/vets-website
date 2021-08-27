import React, { useState } from 'react';

import { goToNextPage, URLS } from '../utils/navigation';

import BackToHome from '../components/BackToHome';

const ValidateVeteran = props => {
  const { router } = props;
  const [isLoading] = useState(false);
  const onClick = async () => {
    goToNextPage(router, URLS.UPDATE_INSURANCE);
  };
  return (
    <div>
      We need more information
      <button
        type="button"
        className="usa-button usa-button-big"
        onClick={onClick}
        data-testid="check-in-button"
        disabled={isLoading}
        aria-label="Check in now for your appointment"
      >
        {isLoading ? <>Loading...</> : <>Check in now</>}
      </button>
      <BackToHome />
    </div>
  );
};

export default ValidateVeteran;
