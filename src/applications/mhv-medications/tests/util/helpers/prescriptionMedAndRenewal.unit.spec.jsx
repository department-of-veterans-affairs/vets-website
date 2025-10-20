import { expect } from 'chai';
import prescriptionDetails from '../../fixtures/prescriptionDetails.json';
import {
  pdfDefaultPendingMedDefinition,
  pdfDefaultPendingRenewalDefinition,
} from '../../../util/constants';
import { prescriptionMedAndRenewalStatus } from '../../../util/helpers';

describe('Prescription Med and Renewal Status function', () => {
  it('should return null when prescription is falsy', () => {
    const rxDetails = null;
    expect(prescriptionMedAndRenewalStatus(rxDetails, 'print')).to.equal(null);
  });
  it('should return pdfStatusDefinitions[prescription.refillStatus] when prescription Source is not PD', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'Renew';
    rxDetails.prescriptionSource = 'NV';
    expect(prescriptionMedAndRenewalStatus(rxDetails, 'print')).to.equal(
      'We’re processing a fill or refill for this prescription. We’ll update the status here when we ship your prescription.\n',
    );
  });
  it('should return pdfStatusDefinitions[prescription.refillStatus] when dispStatus is not Renew or NewOrder', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'In Progress';
    rxDetails.prescriptionSource = 'PD';
    expect(prescriptionMedAndRenewalStatus(rxDetails, 'print')).to.equal(
      'We’re processing a fill or refill for this prescription. We’ll update the status here when we ship your prescription.\n',
    );
  });
  it('should return pdfDefaultPendingRenewalDefinition when dispStatus is Renew', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'Renew';
    rxDetails.prescriptionSource = 'PD';
    expect(prescriptionMedAndRenewalStatus(rxDetails, 'print')).to.equal(
      pdfDefaultPendingRenewalDefinition,
    );
  });
  it('should return pdfDefaultPendingMedDefinition when dispStatus is NewOrder', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'NewOrder';
    rxDetails.prescriptionSource = 'PD';
    expect(prescriptionMedAndRenewalStatus(rxDetails, 'print')).to.equal(
      pdfDefaultPendingMedDefinition,
    );
  });
});
