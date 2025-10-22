import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  pdfStatusDefinitions,
  pdfDefaultStatusDefinition,
  FIELD_NONE_NOTED,
} from '../../util/constants';
import {
  validateField,
  dateFormat,
  determineRefillLabel,
  getShowRefillHistory,
  displayProviderName,
  getRxStatus,
  rxSourceIsNonVA,
} from '../../util/helpers';
import MedicationDescription from '../shared/MedicationDescription';
import { selectPendingMedsFlag } from '../../util/selectors';

const PrescriptionPrintOnly = props => {
  const { rx, refillHistory, isDetailsRx } = props;
  const showRefillHistory = getShowRefillHistory(refillHistory);
  const pharmacyPhone = rx.pharmacyPhoneNumber;
  const latestTrackingStatus = rx?.trackingList?.[0];
  const showPendingMedsContent = useSelector(selectPendingMedsFlag);
  const pendingMed =
    rx?.prescriptionSource === 'PD' && rx?.dispStatus === 'NewOrder';
  const pendingRenewal =
    rx?.prescriptionSource === 'PD' && rx?.dispStatus === 'Renew';
  const isNonVaPrescription = rxSourceIsNonVA(rx);
  const rxStatus = getRxStatus(rx);

  const activeNonVaContent = pres => (
    <div className="print-only-rx-details-container vads-u-margin-top--1p5">
      <p>
        <strong>Instructions:</strong>
        {pres.sig || 'Instructions not available'}
      </p>
      <p>
        <strong>Reason for use:</strong>
        {pres.indicationForUse || 'Reason for use not available'}
      </p>
      <p className="no-break">
        <strong>Status:</strong> {rxStatus}
      </p>
      <p>
        A VA provider added this medication record in your VA medical records.
        But this isn’t a prescription you filled through a VA pharmacy. You
        can’t request refills or manage this medication through this online
        tool.
      </p>
      <p className="vads-u-margin-bottom--neg2">
        <strong>Non-VA medications include these types:</strong>
      </p>
      <ul className="no-break">
        <li className="vads-u-margin--0">
          Prescriptions you filled through a non-VA pharmacy
        </li>
        <li className="vads-u-margin--0">
          Over-the-counter medications, supplements, and herbal remedies
        </li>
        <li className="vads-u-margin--0">
          Sample medications a provider gave you
        </li>
        <li className="vads-u-margin--0">
          Other drugs you’re taking that you don’t have a prescription for,
          including recreational drugs
        </li>
      </ul>
      <p className="vads-u-margin-top--neg1p5">
        <strong>When you started taking this medication:</strong>{' '}
        {dateFormat(pres.dispensedDate, 'MMMM D, YYYY', 'Date not available')}
      </p>
      <p>
        <strong>Documented by: </strong>
        {displayProviderName(pres?.providerFirstName, pres?.providerLastName)}
      </p>
      <p>
        <strong>Documented at this facility: </strong>
        {pres.facilityName || 'VA facility name not available'}
      </p>
      <p>
        <strong>Provider Notes: </strong>
        {validateField(
          (pres.remarks ?? '') + (pres.disclaimer ? ` ${pres.disclaimer}` : ''),
        )}
      </p>
    </div>
  );
  const NameElement = isDetailsRx ? 'h2' : 'h3';
  const DetailsHeaderElement = isDetailsRx ? 'h3' : 'h4';
  return (
    <div className="print-only-rx-container">
      <NameElement>{rx?.prescriptionName || rx?.orderableItem}</NameElement>
      {!isNonVaPrescription ? (
        <div className={isDetailsRx ? '' : 'vads-u-margin-left--2'}>
          <DetailsHeaderElement>
            {isDetailsRx
              ? 'Most recent prescription'
              : 'About your prescription'}
          </DetailsHeaderElement>
          <div className="print-only-rx-details-container">
            {!pendingMed && !pendingRenewal ? (
              <p>
                <strong>Last filled on:</strong>{' '}
                {rx?.sortedDispensedDate
                  ? dateFormat(rx.sortedDispensedDate, 'MMMM D, YYYY')
                  : 'Not filled yet'}
              </p>
            ) : null}
            {!pendingMed &&
              !pendingRenewal && (
                <>
                  <p>
                    <strong>Prescription number:</strong>{' '}
                    {rx.prescriptionNumber}
                  </p>
                </>
              )}
            <p>
              <strong>Status:</strong> {rxStatus}
            </p>
            <div className="vads-u-margin-y--0p5 no-break vads-u-margin-right--5">
              {pdfStatusDefinitions[rx.refillStatus]
                ? pdfStatusDefinitions[rx.refillStatus].map((def, i) => {
                    if (Array.isArray(def.value)) {
                      return (
                        <ul key={i} className="vads-u-margin--0">
                          {def.value.map((val, idx) => (
                            <li key={idx} className="vads-u-margin--0">
                              {val}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    if (def.weight === 'bold') {
                      return <strong key={i}>{def.value}</strong>;
                    }
                    return (
                      <div key={i} className="vads-u-margin-y--0p5">
                        {def.value}
                      </div>
                    );
                  })
                : pdfDefaultStatusDefinition.map(({ value }, i) => (
                    <div key={i} className="vads-u-margin-y--0p5">
                      {value}
                    </div>
                  ))}
            </div>
            <p>
              <strong>Refills left:</strong> {validateField(rx.refillRemaining)}
            </p>
            {!showPendingMedsContent && (
              <p>
                <strong>
                  Request refills by this prescription expiration date:
                </strong>{' '}
                {dateFormat(rx.expirationDate, 'MMMM D, YYYY')}
              </p>
            )}

            <p>
              <strong>Facility:</strong>{' '}
              {rx.facilityName || 'VA facility name not available'}
            </p>
            <p>
              <strong>Pharmacy phone number:</strong>{' '}
              {pharmacyPhone ? (
                <>
                  <va-telephone contact={pharmacyPhone} not-clickable /> (
                  <va-telephone tty contact="711" not-clickable />)
                </>
              ) : (
                FIELD_NONE_NOTED
              )}
            </p>
            <p>
              <strong>Instructions:</strong> {validateField(rx.sig)}
            </p>
            <p>
              <strong>Reason for use:</strong>{' '}
              {validateField(rx.indicationForUse)}
            </p>
            <p>
              <strong>Quantity:</strong> {validateField(rx.quantity)}
            </p>
            <p>
              <strong>Prescribed on:</strong>{' '}
              {dateFormat(rx.orderedDate, 'MMMM D, YYYY')}
            </p>
            <p>
              <strong>Prescribed by:</strong>{' '}
              {displayProviderName(rx?.providerFirstName, rx?.providerLastName)}
            </p>
            {!isDetailsRx &&
              rx.groupedMedications?.length > 0 && (
                <p>
                  <strong>
                    Previous prescriptions associated with this medication:
                  </strong>{' '}
                  {rx.groupedMedications
                    .map(previousRx => {
                      return previousRx.prescriptionNumber;
                    })
                    .join(', ')}
                </p>
              )}
          </div>
          {showRefillHistory && (
            <div className="print-only-refill-container vads-u-margin-left--2">
              <h4>Refill history</h4>
              <p className="vads-u-margin-y--1p5">
                {`Showing ${refillHistory.length} fill${
                  refillHistory.length > 1 ? 's, from newest to oldest' : ''
                }`}
              </p>
              <div className="print-only-rx-details-container">
                {refillHistory.map((entry, i) => {
                  const index = refillHistory.length - i - 1;
                  const { shape, color, backImprint, frontImprint } = entry;
                  const isPartialFill = entry.prescriptionSource === 'PF';
                  const refillLabel = determineRefillLabel(
                    isPartialFill,
                    refillHistory,
                    i,
                  );
                  return (
                    <div key={index} className="vads-u-margin-bottom--2">
                      <h5 className="vads-u-margin-top--1">
                        {`${refillLabel}: ${dateFormat(entry.dispensedDate)}`}
                      </h5>
                      {isPartialFill && (
                        <>
                          <p>This fill has a smaller quantity on purpose.</p>
                          <p>
                            <strong>Quantity:</strong> {entry.quantity}
                          </p>
                        </>
                      )}
                      {i === 0 &&
                        !isPartialFill && (
                          <p>
                            <strong>Shipped on:</strong>{' '}
                            {dateFormat(latestTrackingStatus?.completeDateTime)}
                          </p>
                        )}
                      {!isPartialFill && (
                        <>
                          <p className="vads-u-margin--0">
                            <strong>Medication description: </strong>
                          </p>
                          <MedicationDescription
                            shape={shape}
                            color={color}
                            frontImprint={frontImprint}
                            backImprint={backImprint}
                            pharmacyPhone={pharmacyPhone}
                          />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {isDetailsRx &&
            rx.groupedMedications?.length > 0 && (
              <>
                <h3>Previous prescriptions</h3>
                <div className="vads-u-margin-left--2">
                  <p className="vads-u-margin-y--1p5">
                    {`Showing ${rx.groupedMedications.length} prescription${
                      rx.groupedMedications.length > 1
                        ? 's, from newest to oldest'
                        : ''
                    }`}
                  </p>
                  <div className="print-only-rx-details-container">
                    {rx.groupedMedications.map(entry => {
                      return (
                        <div
                          key={entry.prescriptionNumber}
                          className="vads-u-margin-bottom--2"
                        >
                          <h4>
                            {`Prescription number: ${entry.prescriptionNumber}`}
                          </h4>
                          <p>
                            <strong>Last filled:</strong>{' '}
                            {entry.sortedDispensedDate
                              ? dateFormat(
                                  entry.sortedDispensedDate,
                                  'MMMM D, YYYY',
                                )
                              : 'Not filled yet'}
                          </p>
                          <p>
                            <strong>Quantity:</strong>{' '}
                            {validateField(entry.quantity)}
                          </p>
                          <p>
                            <strong>Prescribed on:</strong>{' '}
                            {dateFormat(entry.orderedDate, 'MMMM D, YYYY')}
                          </p>
                          <p>
                            <strong>Prescribed by:</strong>{' '}
                            {displayProviderName(
                              entry?.providerFirstName,
                              entry?.providerLastName,
                            )}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
        </div>
      ) : (
        activeNonVaContent(rx)
      )}
    </div>
  );
};

export default PrescriptionPrintOnly;

PrescriptionPrintOnly.propTypes = {
  rx: PropTypes.object.isRequired,
  isDetailsRx: PropTypes.bool,
  refillHistory: PropTypes.array,
};
