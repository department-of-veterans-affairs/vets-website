import React from 'react';

import MobileFooter from './MobileFooter/MobileFooter';
import WiderThanMobileFooter from './WiderThanMobileFooter/WiderThanMobileFooter';

import './Footer.scss';

const Footer = () => {
  return (
    <footer data-testid="arp-footer" className="footer arp-footer">
      <MobileFooter />
      <WiderThanMobileFooter />
    </footer>
  );
};

export default Footer;
