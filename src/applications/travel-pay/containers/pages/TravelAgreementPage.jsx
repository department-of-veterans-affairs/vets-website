import React, { useEffect } from 'react';
import { Element } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import { scrollTo } from 'platform/utilities/ui/scroll';

import TravelAgreementContent from '../../components/TravelAgreementContent';
import BreadCrumbs from '../../components/Breadcrumbs';

const TravelAgreementPage = () => {
  useEffect(() => {
    focusElement('h1');
    scrollTo('topScrollElement');
  });

  return (
    <Element>
      <article className="usa-grid-full vads-u-padding-bottom--0">
        <BreadCrumbs />
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--10 vads-u-padding-x--2p5 ">
            <h1 tabIndex="-1">Beneficiary travel agreement</h1>
            <div>
              <TravelAgreementContent />
            </div>
          </div>
        </div>
      </article>
    </Element>
  );
};

export default TravelAgreementPage;
