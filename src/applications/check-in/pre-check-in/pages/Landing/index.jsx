import React, { useEffect, useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { createForm, getTokenFromLocation } from '../../utils/navigation';
import { createInitFormAction } from '../../actions';
import { createAnalyticsSlug } from '../../../utils/analytics';
import { isUUID } from '../../../utils/token-format-validator';

import recordEvent from 'platform/monitoring/record-event';
import { useFormRouting } from '../../hooks/useFormRouting';

export default function Index(props) {
  const dispatch = useDispatch();
  const initForm = useCallback(
    (pages, firstPage) => {
      dispatch(createInitFormAction({ pages, firstPage }));
    },
    [dispatch],
  );
  const { router } = props;
  const { goToErrorPage } = useFormRouting(router);
  useEffect(
    () => {
      const token = getTokenFromLocation(router.location);
      if (!token) {
        recordEvent({
          event: createAnalyticsSlug('landing-page-launched-no-token'),
        });
        goToErrorPage();
      }

      if (!isUUID(token)) {
        recordEvent({
          event: createAnalyticsSlug('malformed-token'),
        });
        goToErrorPage();
      }
      if (token && isUUID(token)) {
        const pages = createForm({ hasConfirmedDemographics: false });
        const firstPage = pages[0];
        initForm(pages, firstPage);
        router.push(firstPage);
      }
    },
    [initForm, router, goToErrorPage],
  );
  return <>loaded</>;
}
