// Dependencies
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import AlertMessage from '../../components/resultsComponents/AlertMessage';
import CarefulConsiderationStatement from '../../components/resultsComponents/CarefulConsiderationStatement';
import { SHORT_NAME_MAP, RESPONSES } from '../../constants/question-data-map';

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

  it('should show the correct text for HONORABLE discharge when REASON is Sexual Orientation', () => {
    const wrapper = mount(
      <CarefulConsiderationStatement
        formResponses={{
          [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_SEXUAL_ORIENTATION,
          [SHORT_NAME_MAP.DISCHARGE_TYPE]: RESPONSES.DISCHARGE_HONORABLE,
        }}
      />,
    );
    expect(wrapper.html()).to.include(
      'Many Veterans have received general or honorable discharges due to their sexual orientation',
    );
    wrapper.unmount();
  });

  it('should show the correct text when REASON is PTSD', () => {
    const wrapper = mount(
      <CarefulConsiderationStatement
        formResponses={{
          [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_PTSD,
          [SHORT_NAME_MAP.DISCHARGE_TYPE]: RESPONSES.DISCHARGE_HONORABLE,
        }}
      />,
    );
    expect(wrapper.html()).to.include(
      'Because you answered that your discharge was related to posttraumatic stress disorder (PTSD)',
    );
    wrapper.unmount();
  });

  it('should show the correct text when REASON is TBI', () => {
    const wrapper = mount(
      <CarefulConsiderationStatement
        formResponses={{
          [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_TBI,
          [SHORT_NAME_MAP.DISCHARGE_TYPE]: RESPONSES.DISCHARGE_HONORABLE,
        }}
      />,
    );
    expect(wrapper.html()).to.include(
      'Because you answered that your discharge was related to a traumatic brain injury (TBI)',
    );
    wrapper.unmount();
  });

  it('should show the correct text for DISCHARGE_TYPE as Dishonorable', () => {
    const wrapper = mount(
      <CarefulConsiderationStatement
        formResponses={{
          [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_SEXUAL_ORIENTATION,
          [SHORT_NAME_MAP.DISCHARGE_TYPE]: RESPONSES.DISCHARGE_DISHONORABLE,
        }}
      />,
    );
    expect(wrapper.html()).to.include(
      'Because you answered that your discharge was due to your sexual orientation',
    );
    wrapper.unmount();
  });

  it('should show the correct text for Reason is Transgender', () => {
    const wrapper = mount(
      <CarefulConsiderationStatement
        formResponses={{
          [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_TRANSGENDER,
        }}
      />,
    );
    expect(wrapper.html()).to.include(
      `This is a common request for transgender Veterans whose DD214 name does not match the name they currently use.`,
    );
    wrapper.unmount();
  });

  it('should show the correct text for REASON is Sexual Assault', () => {
    const wrapper = mount(
      <CarefulConsiderationStatement
        formResponses={{
          [SHORT_NAME_MAP.REASON]: RESPONSES.REASON_SEXUAL_ASSAULT,
        }}
      />,
    );
    expect(wrapper.html()).to.include(
      'Because you answered that your discharge was related to sexual assault or harassment',
    );
    wrapper.unmount();
  });

  it('should show the correct text for PRIOR_SERVICE', () => {
    const wrapper = mount(
      <CarefulConsiderationStatement
        formResponses={{
          [SHORT_NAME_MAP.PRIOR_SERVICE]: RESPONSES.PRIOR_SERVICE_PAPERWORK_NO,
        }}
      />,
    );
    expect(wrapper.html()).to.include(
      'Because you served honorably in one period of service, you can apply for VA benefits using that honorable characterization.',
    );
    wrapper.unmount();
  });
});
