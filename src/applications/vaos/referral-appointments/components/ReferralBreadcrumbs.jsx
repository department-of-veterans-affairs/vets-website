import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { selectCurrentPage } from '../redux/selectors';
import { getReferralUrlLabel, routeToPreviousReferralPage } from '../flow';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function ReferralBreadcrumbs({ categoryOfCare = '' }) {
  const location = useLocation();
  const history = useHistory();
  const currentPage = useSelector(selectCurrentPage);

  const [breadcrumb, setBreadcrumb] = useState(
    getReferralUrlLabel(currentPage, categoryOfCare),
  );

  useEffect(
    () => {
      setBreadcrumb(() => getReferralUrlLabel(currentPage, categoryOfCare));
    },
    [location, categoryOfCare, currentPage],
  );

  const isBackLink = breadcrumb?.startsWith('Back');

  return isBackLink ? (
    <div className="vaos-hide-for-print mobile:vads-u-margin-bottom--0 mobile-lg:vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--2">
      <nav aria-label="backlink" className="vads-u-padding-y--2 ">
        <va-link
          back
          aria-label="Back link"
          data-testid="back-link"
          text={breadcrumb}
          href="#"
          onClick={e => {
            e.preventDefault();
            const params = new URLSearchParams(history.location.search);
            const id = params.get('id');
            routeToPreviousReferralPage(history, currentPage, id);
          }}
        />
      </nav>
    </div>
  ) : (
    <Breadcrumbs labelOverride={breadcrumb} />
  );
}

ReferralBreadcrumbs.propTypes = {
  categoryOfCare: PropTypes.string,
};
