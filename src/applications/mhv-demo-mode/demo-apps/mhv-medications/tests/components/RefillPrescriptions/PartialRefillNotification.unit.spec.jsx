import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import PartialRefillNotification from '../../../components/RefillPrescriptions/PartialRefillNotification';
import { RefillMedicationList } from '../../../components/RefillPrescriptions/RefillMedicationList';
import { RefillAlert } from '../../../components/RefillPrescriptions/RefillAlert';
import { MEDICATION_REFILL_CONFIG } from '../../../util/constants';
import refillableList from '../../fixtures/refillablePrescriptionsList.json';

describe('PartialRefillNotification component', () => {
  const defaultConfig = MEDICATION_REFILL_CONFIG.PARTIAL;
  const defaultFailedMeds = refillableList.slice(3, 6);

  const setup = (config = defaultConfig, failedMeds = defaultFailedMeds) => {
    return shallow(
      <PartialRefillNotification config={config} failedMeds={failedMeds} />,
    );
  };

  it('renders without errors', () => {
    const wrapper = setup();
    expect(wrapper.exists()).to.be.true;
  });

  it('renders RefillAlert component with correct config', () => {
    const wrapper = setup();
    const refillAlert = wrapper.find(RefillAlert);

    expect(refillAlert.exists()).to.be.true;
    expect(refillAlert.prop('config')).to.equal(defaultConfig);
  });

  it('displays the correct description', () => {
    const wrapper = setup();
    const description = wrapper.find(
      '[data-testid="partial-refill-description"]',
    );

    expect(description.exists()).to.be.true;
    expect(description.text()).to.equal(defaultConfig.description);
  });

  it('renders RefillMedicationList with correct props', () => {
    const wrapper = setup();
    const medicationList = wrapper.find(RefillMedicationList);

    expect(medicationList.exists()).to.be.true;
    expect(medicationList.prop('medications')).to.equal(defaultFailedMeds);
    expect(medicationList.prop('testId')).to.equal('failed-medication-list');
    expect(medicationList.prop('showBold')).to.be.true;
  });

  it('displays the list of failed medications', () => {
    const wrapper = setup();
    const medicationList = wrapper.find(RefillMedicationList);

    expect(medicationList.exists()).to.be.true;
    expect(medicationList.prop('medications')).to.have.lengthOf(
      defaultFailedMeds.length,
    );
  });

  it('displays the correct suggestion message', () => {
    const wrapper = setup();
    const suggestionMessage = wrapper.find(
      '[data-testid="partial-refill-suggestion"]',
    );

    expect(suggestionMessage.exists()).to.be.true;
    expect(suggestionMessage.text()).to.equal(defaultConfig.suggestion);
  });
});
