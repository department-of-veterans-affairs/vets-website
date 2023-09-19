import React from 'react';

const CallPharmacyPhone = phone => {
  return (
    <>
      {phone ? (
        <>
          <span> at </span>
          <va-telephone contact={phone} />
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
