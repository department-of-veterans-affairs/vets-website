import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { Toggler } from 'platform/utilities/feature-toggles';

import GetFormHelp from '../../shared/content/GetFormHelp';

import {
  HEALTH_BENEFITS_URL,
  MST_COORD_URL,
  FACILITY_LOCATOR_URL,
} from '../constants';

export default function NeedHelp() {
  const isIntro = window.location.pathname.endsWith('/introduction');
  return isIntro ? (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.hlrUpdatedContent}>
      <Toggler.Enabled>
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
          To learn more about VA health care services, visit{' '}
          <a href={HEALTH_BENEFITS_URL}>
            www.va.gov/health-care/about-va-health-benefits
          </a>
          .
        </p>
        <p>
          To learn about VA benefits and services related to military sexual
          trauma (MST), contact a Veterans Health Administration MST
          coordinator.
        </p>
        <p>
          <a href={MST_COORD_URL}>
            Find a Veterans Health Administration MST coordinator
          </a>
        </p>
        <p>
          Or contact your local VA medical facility and ask to speak to a MST
          coordinator.
        </p>
        <p>
          <a href={FACILITY_LOCATOR_URL}>Find a VA medical facility near you</a>
        </p>
      </Toggler.Enabled>
      <Toggler.Disabled>
        <GetFormHelp />
      </Toggler.Disabled>
    </Toggler>
  ) : (
    <GetFormHelp />
  );
}
