import React from 'react';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import TravelPage from '../TravelPage';

export default function ArrivedPage({
  header = '',
  eyebrow = '',
  subtitle = '',
  bodyText,
  yesAction,
  noAction,
  router,
  pageType,
}) {
  const { t } = useTranslation();

  return (
    <>
      <TravelPage
        header={header || t('is-this-your-current-contact-information')}
        eyebrow={eyebrow}
        subtitle={subtitle}
        bodyText={bodyText}
        yesFunction={yesAction}
        noFunction={noAction}
        pageType={pageType}
        router={router}
      />
    </>
  );
}

ArrivedPage.propTypes = {
  noAction: PropTypes.func.isRequired,
  yesAction: PropTypes.func.isRequired,
  bodyText: PropTypes.object,
  demographics: PropTypes.object,
  eyebrow: PropTypes.string,
  header: PropTypes.string,
  pageType: PropTypes.string,
  router: PropTypes.object,
  subtitle: PropTypes.string,
};
