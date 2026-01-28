import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import * as datadogBrowserRum from '@datadog/browser-rum';
import ClaimFormSideNavErrorBoundary from '../../components/ClaimFormSideNavErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

const WorkingComponent = () => <div>Working</div>;

describe('ClaimFormSideNavErrorBoundary', () => {
  let addErrorStub;

  beforeEach(() => {
    addErrorStub = sinon.stub(datadogBrowserRum.datadogRum, 'addError');
  });

  afterEach(() => {
    addErrorStub.restore();
  });

  it('should render children when there is no error', () => {
    const { getByText } = render(
      <ClaimFormSideNavErrorBoundary>
        <WorkingComponent />
      </ClaimFormSideNavErrorBoundary>,
    );

    expect(getByText('Working')).to.exist;
    expect(addErrorStub.called).to.be.false;
  });

  it('should render nothing when child component throws error', () => {
    const { container } = render(
      <ClaimFormSideNavErrorBoundary>
        <ThrowError />
      </ClaimFormSideNavErrorBoundary>,
    );

    // Error boundary should render null, resulting in empty container
    expect(container.textContent).to.equal('');
  });

  it('should log error to Datadog RUM when child component fails', () => {
    render(
      <ClaimFormSideNavErrorBoundary
        pathname="/veteran-information"
        formData={{ test: 'data' }}
      >
        <ThrowError />
      </ClaimFormSideNavErrorBoundary>,
    );

    expect(addErrorStub.calledOnce).to.be.true;

    const [error, context] = addErrorStub.firstCall.args;
    expect(error).to.be.an.instanceof(Error);
    expect(error.message).to.include('error');

    expect(context).to.have.property('component', 'ClaimFormSideNav');
    expect(context).to.have.property(
      'errorType',
      '526ez-sidenav-render-failure',
    );
    expect(context).to.have.property('pathname', '/veteran-information');
    expect(context).to.have.property('componentStack');
    expect(context).to.have.property('formDataKeys');
    expect(context).to.have.property('timestamp');
  });

  it('should include formDataKeys in error context', () => {
    const formData = {
      veteranFullName: { first: 'Test', last: 'User' },
      newDisabilities: [],
    };

    render(
      <ClaimFormSideNavErrorBoundary pathname="/test" formData={formData}>
        <ThrowError />
      </ClaimFormSideNavErrorBoundary>,
    );

    const context = addErrorStub.firstCall.args[1];
    expect(context.formDataKeys).to.deep.equal([
      'veteranFullName',
      'newDisabilities',
    ]);
  });

  it('should handle missing formData gracefully', () => {
    render(
      <ClaimFormSideNavErrorBoundary pathname="/test">
        <ThrowError />
      </ClaimFormSideNavErrorBoundary>,
    );

    const context = addErrorStub.firstCall.args[1];
    expect(context.formDataKeys).to.deep.equal([]);
  });

  it('should include pathname in error context', () => {
    render(
      <ClaimFormSideNavErrorBoundary pathname="/disabilities/add">
        <ThrowError />
      </ClaimFormSideNavErrorBoundary>,
    );

    const context = addErrorStub.firstCall.args[1];
    expect(context.pathname).to.equal('/disabilities/add');
  });
});
