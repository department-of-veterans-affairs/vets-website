import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import environment from 'platform/utilities/environment';
import { fetchAndUpdateSessionExpiration as fetch } from 'platform/utilities/api';

const data = {
  states: [
    'AL',
    'AK',
    'AS',
    'AZ',
    'AR',
    'AA',
    'AE',
    'AP',
    'CA',
    'CO',
    'CT',
    'DE',
    'DC',
    'FM',
    'FL',
    'GA',
    'GU',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MH',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'MP',
    'OH',
    'OK',
    'OR',
    'PW',
    'PA',
    'PR',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VI',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
  ],
};

const api = {
  url: `${environment.API_URL}/v1/facilities/va`,
  settings: {
    credentials: 'include',
    headers: {
      'X-Key-Inflection': 'camel',

      // Pull app name directly from manifest since this config is defined
      // before startApp, and using window.appName here would result in
      // undefined for all requests that use this config.
      'Source-App-Name': 'rippa-legend',
    },
  },
};

const facilityTypes = {
  vetCenter: 'vet_center',
  vaHealthFacility: 'va_health_facility',
  vaBenefitsFacility: 'va_benefits_facility',
  cemetery: 'va_cemetery',
};

const facilityTypeStrings = {
  [facilityTypes.vetCenter]: 'Vet Center',
  [facilityTypes.vaHealthFacility]: 'Healthcare Facility',
  [facilityTypes.vaBenefitsFacility]: 'Benefits Facility',
  [facilityTypes.cemetery]: 'Cemetery',
};

const Loaded = {
  NOTHING_TO_DO: 'nothing_to_do',
  SEND_REQUEST: 'send_request',
  WAITING: 'waiting',
};

export default function FacilityFinderWidget({ value, onChange }) {
  const defaultState = {
    state: undefined,
    facilityType: undefined,
    loading: Loaded.NOTHING_TO_DO,
    response: undefined,
    error: undefined,
    page: 1,
  };
  const [options, setOptions] = useState(defaultState);
  const { states } = data;

  useEffect(() => {
    const { state, loading, page } = options;

    const handleFacilitiesSuccess = response => {
      return setOptions(
        _.merge({}, options, {
          loading: Loaded.NOTHING_TO_DO,
          response,
        }),
      );
    };

    const handleFacilitiesError = () => {
      return setOptions(defaultState);
    };

    if (loading === Loaded.SEND_REQUEST) {
      fetch(`${api.url}?state=${state}&page=${page}&per_page=6`, api.settings)
        .then(res => res.json())
        .then(handleFacilitiesSuccess)
        .catch(handleFacilitiesError);
      return setOptions(_.merge({}, options, { loading: Loaded.WAITING }));
    }
    return 0;
  });

  const reset = () => onChange();

  const loadPage = page => {
    return setOptions(
      _.merge({}, options, {
        loading: Loaded.SEND_REQUEST,
        page,
        response: null,
      }),
    );
  };

  const paginationLink = page => props => {
    return (
      <a
        onClick={() => loadPage(page)}
        className={_.get(props, 'className') || ``}
        aria-label={`Load page ${page}`}
      >
        {_.get(props, 'children') || page}
      </a>
    );
  };

  if (typeof value !== 'undefined') {
    return (
      <div className="vads-l-row">
        <span>
          You have selected facility {value}. Click{' '}
          <a onClick={() => reset()}>here</a> to select a different facility.
        </span>
      </div>
    );
  }

  return (
    <div className="vads-l-grid-container">
      <div className="vads-l-row">
        <select
          onChange={event => {
            setOptions(
              _.merge({}, defaultState, {
                loading: Loaded.SEND_REQUEST,
                state: event.target.value,
              }),
            );
          }}
        >
          {_.concat([`Select State`], states).map((option, i) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {options.loading !== Loaded.NOTHING_TO_DO && (
        <div className="loading-indicator-container">
          <div
            className="loading-indicator"
            role="progressbar"
            aria-valuetext="Loading facilities."
            tabIndex="0"
          />
        </div>
      )}
      {typeof options.response !== 'undefined' && (
        <div className="vads-l-row">
          <div className="va-pagination">
            <span className="va-pagination-prev">
              {!_.isNull(_.get(options.response, 'meta.pagination.prevPage')) &&
                paginationLink(
                  _.get(options.response, 'meta.pagination.prevPage'),
                )({ children: <abbr title="Previous">Prev</abbr> })}
            </span>
            <div className="va-pagination-inner">
              {!_.isNull(_.get(options.response, 'meta.pagination.prevPage')) &&
                paginationLink(
                  _.get(options.response, 'meta.pagination.prevPage'),
                )()}
              {!_.isNull(
                _.get(options.response, 'meta.pagination.currentPage'),
              ) &&
                paginationLink(
                  _.get(options.response, 'meta.pagination.currentPage'),
                )({ className: 'va-pagination-active' })}
              {!_.isNull(_.get(options.response, 'meta.pagination.nextPage')) &&
                paginationLink(
                  _.get(options.response, 'meta.pagination.nextPage'),
                )()}
            </div>
            <span className="va-pagination-next">
              {!_.isNull(_.get(options.response, 'meta.pagination.nextPage')) &&
                paginationLink(
                  _.get(options.response, 'meta.pagination.nextPage'),
                )({ children: <abbr title="Next">Next</abbr> })}
            </span>
          </div>
        </div>
      )}
      {typeof options.response !== 'undefined' && (
        <div className="vads-l-row">
          {(_.get(options, 'response.data') || []).map((facility, i) => {
            const { id } = facility;
            const { name, facilityType, address } = _.get(
              facility,
              'attributes',
            );
            return (
              <div
                key={i}
                className="vads-l-col--12 medium-screen:vads-l-col--6 small-desktop-screen:vads-l-col--4 large-screen:vads-l-col--4 vads-card--container"
              >
                <div className="vads-card--header">
                  <h2 className="vads-card--heading vads-u-font-size--h4">
                    {name}
                  </h2>
                  <h3 className="vads-card--subheading vads-u-font-size--h5">
                    {_.get(facilityTypeStrings, facilityType) || ``}
                  </h3>
                </div>
                <div className="vads-card--body">
                  <span>{_.get(address, 'physical.address1')}</span>
                  <span>{_.get(address, 'physical.address2')}</span>
                  <span>{_.get(address, 'physical.address3')}</span>
                  <span>
                    {_.get(address, 'physical.city')},{' '}
                    {_.get(address, 'physical.state')}.{' '}
                    {_.get(address, 'physical.zip')}.
                  </span>
                </div>
                <div className="vads-card--footer">
                  <button onClick={() => onChange(id)}>Select Facility</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
