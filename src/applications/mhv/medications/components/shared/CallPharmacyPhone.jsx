import React from 'react';

const CallPharmacyPhone = phone => {
  const number = phone.cmopDivisionPhone
    ? phone.cmopDivisionPhone.replace(/[^0-9]/g, '')
    : null;
  return (
    <>
      {number ? (
        <>
          <span> at </span>
          <va-telephone contact={number} />
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
