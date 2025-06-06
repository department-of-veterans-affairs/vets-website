import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import GetFormHelp from './GetFormHelp';

import {
  HEALTH_BENEFITS_URL,
  MST_COORD_URL,
  FACILITY_LOCATOR_URL,
} from '../constants';

export default function NeedHelp() {
  const isIntro = window.location.pathname.endsWith('/introduction');
  return isIntro ? (
    <>
      <p>
        If you have questions or need help filling out this form, call us at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} />. We’re here Monday
        through Friday, 8:00 a.m. to 9:00 p.m.{' '}
        <dfn>
          <abbr title="Eastern Time">ET</abbr>
        </dfn>
        .
      </p>
      <p>
        If you have hearing loss, call{' '}
        <va-telephone contact={CONTACTS['711']} tty />.
      </p>
      <p>
        <va-link
          disable-analytics
          href={HEALTH_BENEFITS_URL}
          text="Learn more about Veterans Health Administration (VHA) health care
          services"
        />
        .
      </p>
      <p>
        To learn about VHA health care services available related to military
        sexual trauma (MST), contact a VHA MST Coordinator.
      </p>
      <p>
        <va-link
          disable-analytics
          href={MST_COORD_URL}
          text="Find a VHA MST coordinator"
        />
      </p>
      <p>
        Or contact your local VA medical facility and ask to speak to a MST
        coordinator.
      </p>
      <p>
        <va-link
          disable-analytics
          href={FACILITY_LOCATOR_URL}
          text="Find a VA medical facility near you"
        />
      </p>
    </>
  ) : (
    <GetFormHelp />
  );
}
