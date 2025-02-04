import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import AboutPage from '../../components/AboutPage';

describe('<AboutPage>', () => {
  it('should render AboutPage with correct content', () => {
    it('should render without crashing', () => {
      const { container } = render(<AboutPage />);
      expect(container).to.exist;
    });
  });

  it('should navigate to introduction on goToIntroduction call', () => {
    const mockPush = sinon.spy();
    const wrapper = shallow(
      <AboutPage aboutProps={{ router: { push: mockPush } }} />,
    );
    const event = { preventDefault: sinon.spy() };
    wrapper.find('va-link-action').simulate('click', event);
    sinon.assert.calledWith(mockPush, '/introduction');
    wrapper.unmount();
  });
});
