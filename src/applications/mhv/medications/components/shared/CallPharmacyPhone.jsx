import React from 'react';

const CallPharmacyPhone = cmopDivisionPhone => {
  return (
    <>
      {cmopDivisionPhone ? (
        <>
          <span> at </span>
          <va-telephone contact={cmopDivisionPhone} />
          <span>
            (<va-telephone tty contact="711" />)
          </span>
        </>
      ) : (
        <>.</>
      )}
    </>
  );
};

export default CallPharmacyPhone;
