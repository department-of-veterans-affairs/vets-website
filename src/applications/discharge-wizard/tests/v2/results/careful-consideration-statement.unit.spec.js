// Dependencies
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import AlertMessage from '../../../components/v2/resultsComponents/AlertMessage';
import CarefulConsiderationStatement from '../../../components/v2/resultsComponents/CarefulConsiderationStatement';
import {
  SHORT_NAME_MAP,
  RESPONSES,
} from '../../../constants/question-data-map';

describe('Discharge Wizard CarefulConsiderationStatement', () => {
  it('should show nothing of the component if no reason && dischargeType is populated on props', () => {
    const wrapper = mount(
      <CarefulConsiderationStatement
        formResponses={{
          [SHORT_NAME_MAP.REASON]: null,
          [SHORT_NAME_MAP.DISCHARGE_TYPE]: null,
        }}
      />,
    );
    expect(wrapper.find(AlertMessage)).to.have.lengthOf(0); // component renders null
    wrapper.unmount();
  });

  it('should show alert box if 12_priorService is populated on props', () => {
    const wrapper = mount(
      <CarefulConsiderationStatement
        formResponses={{
          [SHORT_NAME_MAP.REASON]: null,
          [SHORT_NAME_MAP.DISCHARGE_TYPE]: null,
          [SHORT_NAME_MAP.PRIOR_SERVICE]: RESPONSES.PRIOR_SERVICE_PAPERWORK_YES,
        }}
      />,
    );
    expect(wrapper.find(AlertMessage)).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('should show the text if 4_reason and 5_dischargeType is populated on props', () => {
    const wrapper = mount(
      <CarefulConsiderationStatement
        formResponses={{
          [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_SEXUAL_ORIENTATION,
          [SHORT_NAME_MAP.DISCHARGE_TYPE]: RESPONSES.DISCHARGE_DISHONORABLE,
        }}
      />,
    );
    expect(wrapper.html()).to.include(
      'Because you answered that your discharge was due to your',
    );
    wrapper.unmount();
  });
});
