// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import VAMCWelcomeModal, {
  VAMC_PATHS,
} from '../../components/VAMCWelcomeModal';

describe('Announcements <VAMCWelcomeModal>', () => {
  describe('VAMC_PATHS - Pittsburgh', () => {
    for (const pagePath of [
      '/pittsburgh-health-care/',
      '/pittsburgh-health-care/locations/',
      '/pittsburgh-health-care/locations/pittsburgh-va-medical-center-university-drive/',
    ]) {
      it('matches the path', () => {
        expect(VAMC_PATHS.PITTSBURGH.test(pagePath)).to.be.true;
      });
    }

    for (const pagePath of [
      '/',
      '/health-care/',
      '/health-care/eligibility/',
    ]) {
      it('does not match the path', () => {
        expect(VAMC_PATHS.PITTSBURGH.test(pagePath)).to.be.false;
      });
    }
  });

  it('renders with the region name', () => {
    const props = {
      dismiss: () => {},
      announcement: {
        region: 'Pittsburgh',
      },
    };

    const wrapper = shallow(<VAMCWelcomeModal {...props} />);

    expect(wrapper.html()).to.include('Pittsburgh');
    wrapper.unmount();
  });
});
