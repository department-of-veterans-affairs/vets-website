import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import recordEvent from 'platform/monitoring/record-event';
import { useSelector } from 'react-redux';
import formConfig from './config/form';
import { isVeteran } from './utils/helpers';
import { wrapWithBreadcrumb } from './components/Breadcrumbs';

const veteranLabels = [
  [
    'root_application_claimant_relationshipToVet',
    'Relationship to service member',
  ],
  ['root_application_veteran_gender', 'Sex'],
  ['root_application_veteran_maritalStatus', 'Marital status'],
  [
    'root_application_veteran_view:hasServiceName',
    'Did you serve under another name?',
  ],
  [
    'root_application_hasCurrentlyBuried',
    'Is there anyone currently buried in a VA national cemetery under your eligibility?',
  ],
  [
    'root_application_applicant_applicantRelationshipToClaimant',
    'Who is filling out this application?',
  ],
  ['root_application_veteran_isDeceased', 'Has the sponsor died?'],
];

const nonVeteranLabels = [
  [
    'root_application_claimant_relationshipToVet',
    'Relationship to service member',
  ],
  ['root_application_veteran_gender', 'Sponsor’s sex'],
  ['root_application_veteran_maritalStatus', 'Sponsor’s marital status'],
  [
    'root_application_veteran_view:hasServiceName',
    'Did the sponsor serve under another name?',
  ],
  [
    'root_application_hasCurrentlyBuried',
    'Is there anyone currently buried in a VA national cemetery under the sponsor’s eligibility?',
  ],
  [
    'root_application_applicant_applicantRelationshipToClaimant',
    'Who is filling out this application?',
  ],
  ['root_application_veteran_isDeceased', 'Has the sponsor died?'],
];

const veteranLabelMap = new Map(veteranLabels);
const nonVeteranMap = new Map(nonVeteranLabels);

export default function PreNeedApp({ location, children }) {
  const { pathname } = location || {};
  const selectorData = useSelector(state => state.form || {});
  // find all yes/no check boxes and attach analytics events
  useEffect(() => {
    const hasVeteran = isVeteran(selectorData.data);
    const radios = document.querySelectorAll('input[type="radio"]');
    for (const radio of radios) {
      radio.onclick = e => {
        let title = e.target.attributes.name.value;
        if (hasVeteran && veteranLabelMap.has(title))
          title = veteranLabelMap.get(title);
        else if (nonVeteranMap.has(title)) title = nonVeteranMap.get(title);
        let optionLabel = e.target.nextElementSibling.innerHTML;
        // conditional to remove PII on page 5/6 of 6/7
        if (
          e.target.attributes.name.value ===
          'root_application_applicant_applicantRelationshipToClaimant'
        ) {
          if (optionLabel === 'Someone else, such as a preparer')
            optionLabel = 'Authorized Agent/Rep';
          else optionLabel = 'Self';
        }
        const currentEvent = {
          event: 'int-radio-option-click',
          'radio-button-label': title,
          'radio-button-optionLabel': optionLabel,
          'radio-button-required': true,
        };
        const priorEvent = window.dataLayer[window.dataLayer.length - 1];
        // if prior event is identical to current event it must be a duplicate.
        if (
          !priorEvent ||
          JSON.stringify(currentEvent) !== JSON.stringify(priorEvent)
        )
          recordEvent(currentEvent);
      };
    }
  }, [location, selectorData]);

  return wrapWithBreadcrumb(
    <article id="form-4010007" data-location={`${pathname?.slice(1)}`}>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </article>,
    selectorData,
  );
}

PreNeedApp.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};
