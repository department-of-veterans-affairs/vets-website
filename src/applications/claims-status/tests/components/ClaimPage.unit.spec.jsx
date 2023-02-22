import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';

import { ClaimPage } from '../../containers/ClaimPage';

const params = { id: 1 };
const router = {
  push: () => sinon.spy(),
};

describe('<ClaimPage>', () => {
  // START lighthouse_migration
  context('cst_use_lighthouse feature toggle', () => {
    const props = {
      params,
      router,
    };

    it('calls getClaimLighthouse when enabled', () => {
      // Reset sinon spies / set up props
      props.getClaimEVSS = sinon.spy();
      props.getClaimLighthouse = sinon.spy();
      props.useLighthouse = true;

      render(
        <ClaimPage {...props}>
          <div />
        </ClaimPage>,
      );

      expect(props.getClaimEVSS.called).to.be.false;
      expect(props.getClaimLighthouse.called).to.be.true;
    });

    it('calls getClaimEVSS when disabled', () => {
      // Reset sinon spies / set up props
      props.getClaimEVSS = sinon.spy();
      props.getClaimLighthouse = sinon.spy();
      props.useLighthouse = false;

      render(
        <ClaimPage {...props}>
          <div />
        </ClaimPage>,
      );

      expect(props.getClaimEVSS.called).to.be.true;
      expect(props.getClaimLighthouse.called).to.be.false;
    });
  });
  // END lighthouse_migration
});
