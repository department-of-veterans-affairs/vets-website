import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { VaModal } from '@department-of-veterans-affairs/web-components/react-bindings';

import ExternalLink from './ExternalLink';

const AppointmentListInfoBlock = () => {
  const { t } = useTranslation();
  const [privacyActModalOpen, setPrivacyActModalOpen] = useState(false);

  const getModalUrl = modalState => {
    const url = new URL(window.location.href);
    url.searchParams.set('modal', modalState);
    return `${url.pathname}${url.search}`;
  };

  const handleModalEvent = useCallback(
    (e, modalState) => {
      e.preventDefault();
      window.history.replaceState(null, null, getModalUrl(modalState));
      setPrivacyActModalOpen(modalState === 'open');
    },
    [setPrivacyActModalOpen],
  );

  const accordionContent = [
    {
      header: t('what-if-cant-find-appointments-in-list'),
      body: (
        <>
          <p>
            {t('our-online-check-in-tool-doesnt-include-all--accordion-item')}
          </p>
          <p>
            <ExternalLink
              href="https://www.va.gov/my-health/appointments/"
              hrefLang="en"
            >
              {t('go-to-all-your-va-appointments')}
            </ExternalLink>
          </p>
        </>
      ),
      open: false,
    },
    {
      header: t('will-va-protect-my-personal-health-information'),
      body: (
        <>
          <p>
            {t(
              'we-make-every-effort-to-keep-your-personal-information-private-and-secure',
            )}
          </p>
          <p>
            <ExternalLink href="/privacy-policy/" hrefLang="en">
              {t('read-more-about-privacy-and-security-on-va-gov')}
            </ExternalLink>
          </p>
          <p>
            {t(
              'youre-also-responsible-for-protecting-your-personal-health-information',
            )}
          </p>
          <p>
            <ExternalLink
              href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/protecting-your-personal-health-information"
              hrefLang="en"
            >
              {t('get-tips-for-protecting-your-personal-health-information')}
            </ExternalLink>
          </p>
        </>
      ),
    },
  ];

  return (
    <>
      <va-accordion uswds bordered data-testid="appointments-accordions">
        {accordionContent.map((accordion, index) => (
          <va-accordion-item
            data-testid="appointments-accordion-item"
            key={index}
            header={accordion.header}
            open={accordion.open}
            uswds
            bordered
          >
            {accordion.body}
          </va-accordion-item>
        ))}
      </va-accordion>
      <div className="vads-u-margin-top--4">
        <a
          data-testid="privacy-act-statement-link"
          href="/health-care/appointment-pre-check-in/introduction?modal=open"
          onClick={e => handleModalEvent(e, 'open')}
        >
          {t('privacy-act-statement')}
        </a>
      </div>
      <VaModal
        modalTitle={t('privacy-act-statement')}
        onCloseEvent={e => handleModalEvent(e, 'closed')}
        visible={privacyActModalOpen}
        initialFocusSelector="button"
      >
        <p data-testid="privacy-act-statement-text">
          {t('privacy-act-statement-text')}
        </p>
      </VaModal>
    </>
  );
};

export default AppointmentListInfoBlock;
