import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import TravelAgreement from './index'; // adjust the path as needed
import * as useFormRoutingModule from '../../../hooks/useFormRouting';

describe('TravelAgreement page ', () => {
  const store = {
    formPages: ['travel-agreement', 'travel-mileage'],
    app: 'travelClaim',
  };
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('renders without crashing', () => {
    const component = render(
      <CheckInProvider
        store={store}
        router={{
          currentPage: '/travel-agreement',
        }}
      >
        <TravelAgreement />
      </CheckInProvider>,
    );

    expect(component).to.exist;
  });

  it('renders agreement list text', () => {
    const push = sinon.spy();
    const component = render(
      <CheckInProvider
        store={store}
        router={{
          push,
          currentPage: '/travel-agreement',
        }}
      >
        <TravelAgreement />
      </CheckInProvider>,
    );

    expect(component.getByTestId('agreement-list-items')).to.exist;
  });

  it('calls goToPreviousPage when file-claim-link is clicked', () => {
    const goToPreviousPageSpy = sinon.spy();
    sandbox.stub(useFormRoutingModule, 'useFormRouting').returns({
      goToPreviousPage: goToPreviousPageSpy,
      getCurrentPageFromRouter: () => {},
      getPreviousPageFromRouter: () => {},
    });

    const component = render(
      <CheckInProvider store={store}>
        <TravelAgreement
          router={{
            currentPage: '/travel-agreement',
          }}
        />
      </CheckInProvider>,
    );

    expect(component.getByTestId('file-claim-link')).to.exist;
    fireEvent.click(component.getByTestId('file-claim-link'));
    expect(goToPreviousPageSpy.calledOnce).to.be.true;
    sandbox.restore();
  });
});
