import React from 'react';

const Logo: string =
  'https://www.va.gov/img/design/logo/logo-black-and-white.png';

const FooterComponent: React.FC = () => {
  return (
    <footer className="medium-screen:vads-u-display--flex vads-u-align-items--center vads-u-margin-y--3">
      <img src={Logo} alt="VA logo" width="300" />
      <p className="medium-screen:vads-u-margin-left--3">
        For more info on Veterans Affairs, please visit{' '}
        <a href="https://va.gov">Va.gov</a>
      </p>
    </footer>
  );
};

export default FooterComponent;
