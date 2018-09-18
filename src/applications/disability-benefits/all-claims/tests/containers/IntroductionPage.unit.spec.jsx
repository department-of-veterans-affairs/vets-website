import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { IntroductionPage } from '../../components/IntroductionPage';
import formConfig from '../../config/form';

describe('<IntroductionPage/>', () => {
  const { formId, prefillEnabled } = formConfig;
  const defaultProps = {
    formId,
    route: {
      formConfig: {
        prefillEnabled
      },
      pageList: []
    }
  };

  test('should render', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps}/>);
    expect(wrapper.length).to.equal(1);
    expect(wrapper.type()).to.equal('div');
  });

  test('should render a form title', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps}/>);
    expect(wrapper.find('FormTitle').length).to.equal(1);
  });

  test('should render 2 SiP intros', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps}/>);
    expect(wrapper.find('Connect(SaveInProgressIntro)').length).to.equal(2);
  });
});
