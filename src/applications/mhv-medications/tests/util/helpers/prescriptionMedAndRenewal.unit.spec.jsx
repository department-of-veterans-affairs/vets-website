import { expect } from 'chai';
import prescriptionDetails from '../../fixtures/prescriptionDetails.json';
import {
  pdfDefaultPendingMedDefinition,
  pdfDefaultPendingRenewalDefinition,
  medStatusDisplayTypes,
} from '../../../util/constants';
import { prescriptionMedAndRenewalStatus } from '../../../util/helpers';

describe('Prescription Med and Renewal Status function', () => {
  it('should return null when prescription is falsy', () => {
    const rxDetails = null;
    expect(
      prescriptionMedAndRenewalStatus(rxDetails, medStatusDisplayTypes.PRINT),
    ).to.equal(null);
  });
  it('should return null when displayType is not recognized', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'Renew';
    rxDetails.prescriptionSource = 'PD';
    expect(prescriptionMedAndRenewalStatus(rxDetails, 'PDF')).to.equal(null);
  });
  it('should return pdfDefaultStatusDefinition when pdfStatusDefinitions[prescription.refillStatus] is unknown', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'Renew';
    rxDetails.prescriptionSource = 'NV';
    rxDetails.refillStatus = 'UnknownStatus';
    expect(
      prescriptionMedAndRenewalStatus(rxDetails, medStatusDisplayTypes.PRINT),
    ).to.equal(
      'Renew - We can’t access information about this prescription right now.',
    );
  });
  it('should return pdfStatusDefinitions[prescription.refillStatus] when prescription Source is not PD', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'Renew';
    rxDetails.prescriptionSource = 'NV';
    expect(
      prescriptionMedAndRenewalStatus(rxDetails, medStatusDisplayTypes.PRINT),
    ).to.equal(
      'Renew - We’re processing a fill or refill for this prescription. We’ll update the status here when we ship your prescription.',
    );
  });
  it('should return pdfStatusDefinitions[prescription.refillStatus] when dispStatus is not Renew or NewOrder', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'In Progress';
    rxDetails.prescriptionSource = 'PD';
    expect(
      prescriptionMedAndRenewalStatus(rxDetails, medStatusDisplayTypes.PRINT),
    ).to.equal(
      'In Progress - We’re processing a fill or refill for this prescription. We’ll update the status here when we ship your prescription.',
    );
  });
  it('should return pdfDefaultPendingRenewalDefinition when dispStatus is Renew', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'Renew';
    rxDetails.prescriptionSource = 'PD';
    expect(
      prescriptionMedAndRenewalStatus(rxDetails, medStatusDisplayTypes.PRINT),
    ).to.equal(pdfDefaultPendingRenewalDefinition);
  });
  it('should return pdfDefaultPendingMedDefinition when dispStatus is NewOrder', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'NewOrder';
    rxDetails.prescriptionSource = 'PD';
    expect(
      prescriptionMedAndRenewalStatus(rxDetails, medStatusDisplayTypes.PRINT),
    ).to.equal(pdfDefaultPendingMedDefinition);
  });
  it('should return pdfDefaultPendingMedDefinition when dispStatus is NewOrder and displayType is VA_PRESCRIPTION', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'NewOrder';
    rxDetails.prescriptionSource = 'PD';
    const component = prescriptionMedAndRenewalStatus(
      rxDetails,
      medStatusDisplayTypes.VA_PRESCRIPTION,
    );
    expect(component.props.children).to.equal(pdfDefaultPendingMedDefinition);
  });
  it('should return pdfDefaultPendingRenewDefinition when dispStatus is Renew and displayType is VA_PRESCRIPTION', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'Renew';
    rxDetails.prescriptionSource = 'PD';
    const component = prescriptionMedAndRenewalStatus(
      rxDetails,
      medStatusDisplayTypes.VA_PRESCRIPTION,
    );
    expect(component.props.children).to.equal(
      pdfDefaultPendingRenewalDefinition,
    );
  });
  it('should return pdfDefaultPendingMedDefinition when dispStatus is NewOrder and displayType is TXT', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'NewOrder';
    rxDetails.prescriptionSource = 'PD';
    expect(
      prescriptionMedAndRenewalStatus(rxDetails, medStatusDisplayTypes.TXT),
    ).to.equal(pdfDefaultPendingMedDefinition);
  });
  it('should return pdfDefaultPendingRenewDefinition when dispStatus is Renew and displayType is TXT', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'Renew';
    rxDetails.prescriptionSource = 'PD';
    expect(
      prescriptionMedAndRenewalStatus(rxDetails, medStatusDisplayTypes.TXT),
    ).to.equal(pdfDefaultPendingRenewalDefinition);
  });
});
