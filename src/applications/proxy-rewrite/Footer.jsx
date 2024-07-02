import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import DesktopFooter from './partials/desktop/footer';
import MobileFooter from './partials/mobile/footer';

const MOBILE_BREAKPOINT_PX = 768;

const Footer = ({ footerData, lastUpdated }) => {
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= MOBILE_BREAKPOINT_PX,
  );

  useEffect(() => {
    const deriveIsDesktop = () => setIsDesktop(window.innerWidth >= MOBILE_BREAKPOINT_PX);
    const onResize = debounce(deriveIsDesktop, 100);

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  const footer = isDesktop ?
    <DesktopFooter footerData={footerData} /> :
    <MobileFooter footerData={footerData} />;

  if (lastUpdated) {
    const lastUpdatedDate = lastUpdated.replace('Last updated ', '');

    return (
      <>
        <div>
          <div className="footer-lastupdated">
            <div className="usa-grid">
              <div className="col-md-3"></div>
              <div className="col-md-9">
                <p className="vads-u-margin--0 vads-u-padding--0 vads-u-font-size--lg">Last updated: {lastUpdatedDate}</p>
              </div>
            </div>
          </div>
        </div>
        {footer}
      </>
    );
  } 

  return footer;
};

export default Footer;