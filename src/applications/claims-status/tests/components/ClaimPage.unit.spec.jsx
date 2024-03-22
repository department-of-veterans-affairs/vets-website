import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';

import { ClaimPage } from '../../containers/ClaimPage';

const params = { id: 1 };
const router = {
  push: () => sinon.spy(),
};

const props = {
  params,
  router,
};

describe('<ClaimPage>', () => {
  it('calls getClaim when it is rendered', () => {
    // Reset sinon spies / set up props
    props.getClaim = sinon.spy();

    render(
      <ClaimPage {...props}>
        <div />
      </ClaimPage>,
    );

    expect(props.getClaim.called).to.be.true;
  });
});
