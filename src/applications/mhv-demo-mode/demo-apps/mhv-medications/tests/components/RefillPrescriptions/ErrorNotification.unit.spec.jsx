import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ErrorNotification from '../../../components/RefillPrescriptions/ErrorNotification';
import { RefillAlert } from '../../../components/RefillPrescriptions/RefillAlert';
import { MEDICATION_REFILL_CONFIG } from '../../../util/constants';

describe('ErrorNotification component', () => {
  const defaultConfig = MEDICATION_REFILL_CONFIG.ERROR;

  const setup = (config = defaultConfig) => {
    return shallow(<ErrorNotification config={config} />);
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

  it('displays the correct error description', () => {
    const wrapper = setup();
    const errorDescription = wrapper.find(
      '[data-testid="error-refill-description"]',
    );

    expect(errorDescription.exists()).to.be.true;
    expect(errorDescription.text()).to.equal(defaultConfig.description);
  });

  it('displays the correct suggestion message', () => {
    const wrapper = setup();
    const suggestionMessage = wrapper.find(
      '[data-testid="error-refill-suggestion"]',
    );

    expect(suggestionMessage.exists()).to.be.true;
    expect(suggestionMessage.text()).to.equal(defaultConfig.suggestion);
  });
});
