import React from 'react';
import PropTypes from 'prop-types';
import {
  housingRiskTitle,
  livingSituationTitle,
  livingSituationList,
  otherHousingRisksLabel,
  pointOfContactNameLabel,
  pointOfContactPhoneLabel,
} from '../content/livingSituation';
import { convertBoolResponseToYesNo } from '../../shared/utils/form-data-display';

export const LivingSituation = ({ data } = {}) => (
  <>
    <li>
      <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
        {housingRiskTitle}
      </div>
      <div
        className="vads-u-margin-bottom--2 dd-privacy-hidden"
        data-dd-action-name="has housing risk"
      >
        {convertBoolResponseToYesNo(data?.housingRisk)}
      </div>
    </li>
    {data.housingRisk && (
      <>
        <li>
          <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
            {livingSituationTitle}
          </div>
          <div
            className="vads-u-margin-bottom--2 dd-privacy-hidden"
            data-dd-action-name="living situation"
          >
            {livingSituationList(data?.livingSituation) || 'None selected'}
          </div>
        </li>
        {data.livingSituation?.other && (
          <li>
            <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
              {otherHousingRisksLabel}
            </div>
            <div
              className="vads-u-margin-bottom--2 dd-privacy-hidden"
              data-dd-action-name="other housing risks"
            >
              {data.otherHousingRisks || 'Nothing entered'}
            </div>
          </li>
        )}
        <li>
          <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
            {pointOfContactNameLabel}
          </div>
          <div
            className="vads-u-margin-bottom--2 dd-privacy-hidden"
            data-dd-action-name="point of contact full name"
          >
            {data.pointOfContactName || 'Nothing entered'}
          </div>
        </li>
        <li>
          <div className="vads-u-margin-bottom--0p5 vads-u-color--gray vads-u-font-size--sm">
            {pointOfContactPhoneLabel}
          </div>
          <div
            className="vads-u-margin-bottom--2 dd-privacy-hidden"
            data-dd-action-name="point of contact phone number"
          >
            {data.pointOfContactPhone ? (
              <va-telephone
                contact={data.pointOfContactPhone}
                international={data.pointOfContactHasInternationalPhone}
                not-clickable
              />
            ) : (
              'Nothing entered'
            )}
          </div>
        </li>
      </>
    )}
  </>
);

LivingSituation.propTypes = {
  data: PropTypes.shape({
    housingRisk: PropTypes.bool,
    livingSituation: PropTypes.shape({
      facility30Days: PropTypes.bool,
      friendOrFamily: PropTypes.bool,
      home30Days: PropTypes.bool,
      none: PropTypes.bool,
      notRegular: PropTypes.bool,
      other: PropTypes.bool,
      shelter: PropTypes.bool,
    }),
    otherHousingRisks: PropTypes.string,
    pointOfContactName: PropTypes.string,
    pointOfContactPhone: PropTypes.string,
    pointOfContactHasInternationalPhone: PropTypes.bool,
  }),
};
