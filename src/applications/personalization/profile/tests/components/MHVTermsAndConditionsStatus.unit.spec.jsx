import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import MHVTermsAndConditionsStatus from '../../components/MHVTermsAndConditionsStatus';
import Verified from '../../components/Verified';

describe('MHVTermsAndConditionsStatus', () => {
  describe('render output', () => {
    let wrapper;
    let mhvAccount;
    describe('when user has accepted terms and conditions', () => {
      beforeEach(() => {
        mhvAccount = {
          termsAndConditionsAccepted: true,
        };
        wrapper = shallow(
          <MHVTermsAndConditionsStatus mhvAccount={mhvAccount} />,
        );
      });
      afterEach(() => {
        wrapper.unmount();
      });

      it('should render a <Verified> component as its first child', () => {
        const firstChild = wrapper.childAt(0);
        expect(firstChild.type()).to.equal(Verified);
        expect(
          firstChild
            .dive()
            .text()
            .includes(
              'You’ve accepted the terms and conditions for using VA.gov health tools.',
            ),
        ).to.be.true;
      });

      it('should render a link to view the terms and conditions', () => {
        const link = wrapper.find('a');
        expect(link.prop('href')).to.equal(
          '/health-care/medical-information-terms-conditions',
        );
        expect(
          link
            .text()
            .includes('View terms and conditions for medical information'),
        ).to.be.true;
      });
    });
    describe('when user still needs to accept terms and conditions', () => {
      beforeEach(() => {
        mhvAccount = {
          termsAndConditionsAccepted: false,
          accountState: 'needs_terms_acceptance',
        };
        wrapper = shallow(
          <MHVTermsAndConditionsStatus mhvAccount={mhvAccount} />,
        );
      });
      afterEach(() => {
        wrapper.unmount();
      });

      it('should render info about needing to accept terms and conditions', () => {
        const p = wrapper.find('p').at(0);
        expect(
          p
            .text()
            .includes(
              'Before using our health tools, you’ll need to read and agree to the terms and conditions for medical information. This will give us permission to share your VA medical information with you. Once you do this, you can use the tools to refill your VA prescriptions or download your VA health records.',
            ),
        ).to.be.true;
      });

      it('should render a link to verify your identity', () => {
        const link = wrapper.find('a');
        expect(link.prop('href')).to.equal(
          '/health-care/medical-information-terms-conditions',
        );
        expect(
          link
            .text()
            .includes('Go to the terms and conditions for medical information'),
        ).to.be.true;
      });
    });
    describe('in all other cases', () => {
      it('should render nothing', () => {
        mhvAccount = {
          accountState: 'some_other_state',
          termsAndConditionsAccepted: false,
        };
        wrapper = shallow(
          <MHVTermsAndConditionsStatus mhvAccount={mhvAccount} />,
        );
        expect(wrapper.isEmptyRender()).to.be.true;
        wrapper.unmount();
      });
    });
  });

  describe('willRenderContent static method', () => {
    describe('when user has accepted terms and conditions', () => {
      it('should return `true`', () => {
        const mhvAccount = {
          termsAndConditionsAccepted: true,
        };
        expect(MHVTermsAndConditionsStatus.willRenderContent(mhvAccount)).to.be
          .true;
      });
    });
    describe('when user still needs to accept terms and conditions', () => {
      it('should return `true`', () => {
        const mhvAccount = {
          termsAndConditionsAccepted: false,
          accountState: 'needs_terms_acceptance',
        };
        expect(MHVTermsAndConditionsStatus.willRenderContent(mhvAccount)).to.be
          .true;
      });
    });
    describe('in all other cases', () => {
      it('should return `false`', () => {
        const mhvAccount = {
          termsAndConditionsAccepted: false,
          accountState: 'some_other_state',
        };
        expect(MHVTermsAndConditionsStatus.willRenderContent(mhvAccount)).to.be
          .false;
      });
    });
  });
});
