import React from 'react';
import { expect } from 'chai';
import { IntroductionPage } from '../containers/IntroductionPage';
import { shallow } from 'enzyme';

const defaultProps = {
  router: [],
  route: { formConfig: {} },
  formData: {},
  setFormData: () => {},
  canUpload1010cgPOA: false,
};

describe('IntroductionPage', () => {
  it('should not render poa note', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);

    expect(wrapper.find('[data-testid="poa-info-note"]')).to.exist;
    wrapper.unmount();
  });

  it('should render poa note', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);

    expect(wrapper.find('[data-testid="poa-info-note"]')).to.not.exist;
    wrapper.unmount();
  });
});
