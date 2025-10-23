import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { Link } from 'react-router-dom-v5-compat';
import SuccessNotification from '../../../components/RefillPrescriptions/SuccessNotification';
import RefillAlert from '../../../components/RefillPrescriptions/RefillAlert';
import { RefillMedicationList } from '../../../components/RefillPrescriptions/RefillMedicationList';
import { MEDICATION_REFILL_CONFIG } from '../../../util/constants';
import refillableList from '../../fixtures/refillablePrescriptionsList.json';
import { dataDogActionNames } from '../../../util/dataDogConstants';

describe('SuccessNotification component', () => {
  const defaultConfig = MEDICATION_REFILL_CONFIG.SUCCESS;
  const defaultSuccessfulMeds = refillableList.slice(0, 3);
  const mockHandleClick = sinon.spy();

  const setup = (
    config = defaultConfig,
    handleClick = mockHandleClick,
    successfulMeds = defaultSuccessfulMeds,
  ) => {
    return shallow(
      <SuccessNotification
        config={config}
        handleClick={handleClick}
        successfulMeds={successfulMeds}
      />,
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
    expect(refillAlert.prop('additionalProps')).to.deep.equal({
      'data-dd-privacy': 'mask',
    });
  });

  it('renders RefillMedicationList with correct props', () => {
    const wrapper = setup();
    const medicationList = wrapper.find(RefillMedicationList);

    expect(medicationList.exists()).to.be.true;
    expect(medicationList.prop('medications')).to.equal(defaultSuccessfulMeds);
    expect(medicationList.prop('testId')).to.equal(
      'successful-medication-list',
    );
  });

  it('displays the list of requested medications', () => {
    const wrapper = setup();
    const medicationList = wrapper.find(RefillMedicationList);

    expect(medicationList.exists()).to.be.true;
    expect(medicationList.prop('medications')).to.have.lengthOf(
      defaultSuccessfulMeds.length,
    );
  });

  it('renders success description with correct content and attributes', () => {
    const wrapper = setup();
    const descriptionContainer = wrapper.find(
      '[data-testid="success-refill-description"]',
    );
    const descriptionParagraph = descriptionContainer.find('p');

    expect(descriptionContainer.exists()).to.be.true;
    expect(descriptionParagraph.exists()).to.be.true;
    expect(descriptionParagraph.text()).to.equal(defaultConfig.description);
  });

  it('renders Link component with correct props', () => {
    const wrapper = setup();
    const link = wrapper.find(Link);

    expect(link.exists()).to.be.true;
    expect(link.prop('to')).to.equal('/');
    expect(link.prop('data-testid')).to.equal('back-to-medications-page-link');
    expect(link.hasClass('hide-visited-link')).to.be.true;
    expect(link.prop('data-dd-action-name')).to.equal(
      dataDogActionNames.refillPage.GO_TO_YOUR_MEDICATIONS_LIST_ACTION_LINK,
    );
    expect(link.text()).to.equal(defaultConfig.linkText);
  });

  it('calls handleClick when link is clicked', () => {
    const wrapper = setup();
    const link = wrapper.find(Link);

    link.simulate('click');
    expect(mockHandleClick.calledOnce).to.be.true;
  });
});
