import React, { Fragment } from 'react';
import { RESPONSES, SHORT_NAME_MAP } from './question-data-map';
import { locationList as BurnPit21Locations } from '../containers/questions/burn-pit/BurnPit-2-1';
import { locationList as BurnPit211Locations } from '../containers/questions/burn-pit/BurnPit-2-1-1';
import { locationList as BurnPit212Locations } from '../containers/questions/burn-pit/BurnPit-2-1-2';

const {
  BURN_PIT_2_1,
  BURN_PIT_2_1_1,
  BURN_PIT_2_1_2,
  LEJEUNE_2_4,
  ORANGE_2_2_B,
  ORANGE_2_2_1_B,
  ORANGE_2_2_2,
  ORANGE_2_2_3,
  RADIATION_2_3_B,
} = SHORT_NAME_MAP;
const {
  AMERICAN_SAMOA,
  CAMBODIA,
  ENEWETAK_ATOLL,
  GREENLAND_THULE,
  GUAM,
  JOHNSTON_ATOLL,
  KOREA_DMZ,
  LAOS,
  SPAIN_PALOMARES,
  THAILAND,
  VIETNAM_REP,
  VIETNAM_WATERS,
  YES,
} = RESPONSES;

/**
 * Any of this content could display on Results set 1, page 1. Each key (e.g. BURN_PIT_2_1) represents
 * an individual question (by short name). Each short name has an array of possible dynamic content, but only
 * checkbox questions (ending in '_B', e.g. ORANGE_2_2_B) can have multiple items in their array displaying on the page.
 */
export const dynamicContent = {
  [BURN_PIT_2_1]: [
    {
      response: YES,
      content: (
        <Fragment key={BURN_PIT_2_1}>
          <li>
            Burn pit or other toxic exposures from service in any of these
            locations, on or after <strong>August 2, 1990</strong>:
            {BurnPit21Locations}
            <p>We’ve added these new locations under the PACT Act.</p>
          </li>
        </Fragment>
      ),
    },
  ],
  [BURN_PIT_2_1_1]: [
    {
      response: YES,
      content: (
        <Fragment key={BURN_PIT_2_1_1}>
          <li>
            Burn pit or other toxic exposures from service in any of these
            locations, on or after <strong>August 2, 1990</strong>:
            {BurnPit211Locations}
            <p>
              We’ve added new presumptive conditions for these locations under
              the PACT Act.
            </p>
          </li>
        </Fragment>
      ),
    },
  ],
  [BURN_PIT_2_1_2]: [
    {
      response: YES,
      content: (
        <Fragment key={BURN_PIT_2_1_2}>
          <li>
            Burn pit or other toxic exposures from service in any of these
            locations, on or after <strong>September 11, 2001</strong>:
            {BurnPit212Locations}
            <p>We’ve added these new locations under the PACT Act.</p>
          </li>
        </Fragment>
      ),
    },
  ],
  [ORANGE_2_2_B]: [
    {
      response: VIETNAM_REP,
      content: (
        <li key={`${ORANGE_2_2_B}-1`}>
          Agent Orange exposure from service in the Republic of Vietnam, between{' '}
          <strong>January 9, 1962</strong>, and <strong>May 7, 1975</strong>.
          We’ve added new presumptive conditions for this location under the
          PACT Act.
        </li>
      ),
    },
    {
      response: VIETNAM_WATERS,
      content: (
        <Fragment key={`${ORANGE_2_2_B}-2`}>
          <li>
            Agent Orange exposure from service on a U.S. military vessel that
            operated in either of these waters between{' '}
            <strong>January 9, 1962</strong>, and <strong>May 7, 1975</strong>:
            <ul>
              <li>
                The inland waterways of Vietnam, <strong>or</strong>
              </li>
              <li>
                Not more than 12 nautical miles seaward from the demarcation
                line of the waters of Vietnam and Cambodia
              </li>
            </ul>
            <p>
              We’ve added new presumptive conditions for this location under the
              PACT Act.
            </p>
          </li>
        </Fragment>
      ),
    },
    {
      response: KOREA_DMZ,
      content: (
        <li key={`${ORANGE_2_2_B}-3`}>
          Agent Orange exposure from service at or near the Korean Demilitarized
          Zone (DMZ) between <strong>September 1, 1967</strong>, and{' '}
          <strong>August 31, 1971</strong>. We’ve added new presumptive
          conditions for this location under the PACT Act.
        </li>
      ),
    },
  ],
  [ORANGE_2_2_1_B]: [
    {
      response: AMERICAN_SAMOA,
      content: (
        <li key={`${ORANGE_2_2_1_B}-1`}>
          Agent Orange exposure from service in American Samoa or its
          territorial waters from <strong>January 9, 1962</strong>, through{' '}
          <strong>July 31, 1980</strong>. We’ve added this new location under
          the PACT Act.
        </li>
      ),
    },
    {
      response: CAMBODIA,
      content: (
        <li key={`${ORANGE_2_2_1_B}-2`}>
          Agent Orange exposure from service in Cambodia at Mimot or Krek,
          Kampong Cham Province from <strong>April 16, 1969</strong>, through{' '}
          <strong>April 30, 1969</strong>. We’ve added new presumptive
          conditions for this location under the PACT Act.
        </li>
      ),
    },
    {
      response: GUAM,
      content: (
        <li key={`${ORANGE_2_2_1_B}-3`}>
          Agent Orange exposure from service in Guam or its territorial waters
          from <strong>January 9, 1962</strong>, through{' '}
          <strong>July 31, 1980</strong>. We’ve added this new location under
          the PACT Act.
        </li>
      ),
    },
    {
      response: JOHNSTON_ATOLL,
      content: (
        <li key={`${ORANGE_2_2_1_B}-4`}>
          Agent Orange exposure from service on Johnston Atoll or on a ship that
          called at Johnston Atoll from <strong>January 1, 1972</strong>,
          through <strong>September 30, 1977</strong>. We’ve added this new
          location under the PACT Act.
        </li>
      ),
    },
    {
      response: LAOS,
      content: (
        <li key={`${ORANGE_2_2_1_B}-5`}>
          Agent Orange or other herbicide exposure from service in Laos from{' '}
          <strong>December 1, 1965</strong>, through{' '}
          <strong>September 30, 1969</strong>. We’ve added this new location
          under the PACT Act.
        </li>
      ),
    },
    {
      response: THAILAND,
      content: (
        <li key={`${ORANGE_2_2_1_B}-6`}>
          Agent Orange or other herbicide exposure from service on any U.S. or
          Royal Thai military base in Thailand from{' '}
          <strong>January 9, 1962</strong>, through{' '}
          <strong>June 30, 1976</strong>. We’ve added this new location under
          the PACT Act.
        </li>
      ),
    },
  ],
  [ORANGE_2_2_2]: [
    {
      response: YES,
      content: (
        <Fragment key={ORANGE_2_2_2}>
          <li>
            Agent Orange or other herbicide exposure from repeated contact with
            affected C-123 aircraft due to your flight, ground, or medical
            duties at certain locations. We’ve added new presumptive conditions
            for this location under the PACT Act.
            <a
              className="vads-u-margin-top--1 vads-u-display--block"
              href="https://www.benefits.va.gov/compensation/docs/AO_C123_AFSpecialityCodesUnits.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Review Agent Orange C-123 aircraft codes and service dates (opens
              in a new tab)
            </a>
          </li>
        </Fragment>
      ),
    },
  ],
  [ORANGE_2_2_3]: [
    {
      response: YES,
      content: (
        <li key={ORANGE_2_2_3}>
          Agent Orange or other herbicide exposure from involvement in
          transporting, testing, storing, or other uses of Agent Orange. We’ve
          added new presumptive conditions for this location under the PACT Act.
        </li>
      ),
    },
  ],
  [RADIATION_2_3_B]: [
    {
      response: ENEWETAK_ATOLL,
      content: (
        <li key={`${RADIATION_2_3_B}-1`}>
          Radiation exposure from the cleanup of Enewetak Atoll, from{' '}
          <strong>January 1, 1977</strong>, through{' '}
          <strong>December 31, 1980</strong>. We’ve added this new location
          under the PACT Act.
        </li>
      ),
    },
    {
      response: SPAIN_PALOMARES,
      content: (
        <li key={`${RADIATION_2_3_B}-2`}>
          Radiation exposure from the cleanup of the Air Force B-52 bomber
          carrying nuclear weapons off the coast of Palomares, Spain, from{' '}
          <strong>January 17, 1966</strong>, through{' '}
          <strong>March 31, 1967</strong>. We’ve added this new location under
          the PACT Act.
        </li>
      ),
    },
    {
      response: GREENLAND_THULE,
      content: (
        <li key={`${RADIATION_2_3_B}-3`}>
          Radiation exposure from the response to the fire onboard an Air Force
          B-52 bomber carrying nuclear weapons near Thule Air Force Base in
          Greenland from <strong>January 21, 1968</strong>, to{' '}
          <strong>September 25, 1968</strong>. We’ve added this new location
          under the PACT Act.
        </li>
      ),
    },
  ],
  [LEJEUNE_2_4]: [
    {
      response: YES,
      content: (
        <Fragment key={LEJEUNE_2_4}>
          <li>
            Exposure to contaminated water from service for at least 30 days at
            either of these North Carolina bases between{' '}
            <strong>August 1, 1953</strong>, and{' '}
            <strong>December 31, 1987</strong>:
            <ul>
              <li>
                Marine Corps Base Camp Lejeune, <strong>or</strong>
              </li>
              <li>Marine Corps Air Station (MCAS) New River</li>
            </ul>
            <p>
              <strong>Note</strong>: The PACT Act doesn’t add or change benefits
              related to this exposure.
            </p>
          </li>
        </Fragment>
      ),
    },
  ],
};
