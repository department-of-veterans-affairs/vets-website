import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { renderWithRouter, rerenderWithRouter } from '../../utils';
import { Automated5103Notice } from '../../../components/claim-document-request-pages/Automated5103Notice';

const claimId = 1;

const store = createStore(() => ({
  featureToggles: {},
}));

const item5103 = {
  closedDate: null,
  description: 'Automated 5103 Notice Response',
  displayName: 'Automated 5103 Notice Response',
  id: 467558,
  overdue: true,
  receivedDate: null,
  requestedDate: '2024-03-07',
  status: 'NEEDED_FROM_YOU',
  suspenseDate: '2024-04-07',
  uploadsAllowed: true,
  documents: '[]',
  date: '2024-03-07',
};

describe('<Automated5103Notice>', () => {
  it('should render component when item is a 5103 notice', () => {
    const { getByText, getByTestId, container } = renderWithRouter(
      <Provider store={store}>
        <Automated5103Notice item={item5103} params={{ id: claimId }} />,
      </Provider>,
    );
    expect($('#automated-5103-notice-page', container)).to.exist;
    getByText('5103 Evidence Notice');
    expect($('.active-va-link', container)).to.have.text('Go to claim letters');
    getByText('If you have more evidence to submit');
    expect(getByTestId('upload-evidence-link').textContent).to.equal(
      'Upload your evidence here',
    );
    getByText('If you don’t have more evidence to submit');
    expect($('va-checkbox', container)).to.exist;
    expect($('va-button', container)).to.exist;
  });

  it('should render null when item is NOT a 5103 notice', () => {
    const item = {
      closedDate: null,
      description: 'Buddy statement text',
      displayName: 'Submit buddy statement(s)',
      id: 467558,
      overdue: true,
      receivedDate: null,
      requestedDate: '2024-03-07',
      status: 'NEEDED_FROM_YOU',
      suspenseDate: '2024-04-07',
      uploadsAllowed: true,
      documents: '[]',
      date: '2024-03-07',
    };

    const { container } = renderWithRouter(
      <Provider store={store}>
        <Automated5103Notice item={item} params={{ id: claimId }} />,
      </Provider>,
    );
    expect($('#automated-5103-notice-page', container)).to.not.exist;
  });

  context('when useLighthouse5103 false', () => {
    const props = {
      item: item5103,
      params: { id: claimId },
      useLighthouse5103: false,
    };

    context('when checkbox is checked and submit button clicked', () => {
      it('should submitRequest notice and redirect to files tab', () => {
        const submitRequest = sinon.spy();
        const submit5103 = sinon.spy();
        const navigate = sinon.spy();

        const { container, rerender } = renderWithRouter(
          <Provider store={store}>
            <Automated5103Notice
              {...props}
              submit5103={submit5103}
              submitRequest={submitRequest}
              navigate={navigate}
            />
          </Provider>,
        );
        expect($('#automated-5103-notice-page', container)).to.exist;
        expect($('va-checkbox', container)).to.exist;
        expect($('va-button', container)).to.exist;

        // Check the checkbox
        $('va-checkbox', container).__events.vaChange({
          detail: { checked: true },
        });

        rerenderWithRouter(
          rerender,
          <Provider store={store}>
            <Automated5103Notice
              {...props}
              submit5103={submit5103}
              submitRequest={submitRequest}
              navigate={navigate}
            />
          </Provider>,
        );

        // Click submit button
        fireEvent.click($('#submit', container));

        expect(submitRequest.called).to.be.true;
        expect(submit5103.called).to.be.false;
        expect(navigate.calledWith('../files')).to.be.true;
      });
    });
    context('when checkbox is not checked and submit button clicked', () => {
      it('should not submit 5103 notice and error message displayed', () => {
        const submitRequest = sinon.spy();
        const submit5103 = sinon.spy();
        const navigate = sinon.spy();

        const { container } = renderWithRouter(
          <Provider store={store}>
            <Automated5103Notice
              {...props}
              submit5103={submit5103}
              submitRequest={submitRequest}
              navigate={navigate}
            />
          </Provider>,
        );
        expect($('#automated-5103-notice-page', container)).to.exist;
        expect($('va-checkbox', container)).to.exist;
        expect($('va-button', container)).to.exist;
        expect($('va-checkbox', container).getAttribute('error')).to.be.null;

        // Click submit button
        fireEvent.click($('#submit', container));

        expect($('va-checkbox', container).getAttribute('checked')).to.equal(
          'false',
        );
        expect(submitRequest.called).to.be.false;
        expect(submit5103.called).to.be.false;
        expect(navigate.called).to.be.false;
        expect($('va-checkbox', container).getAttribute('error')).to.equal(
          'You must confirm you’re done adding evidence before submitting the evidence waiver',
        );
      });
    });
  });

  context('when useLighthouse5103 false', () => {
    const props = {
      item: item5103,
      params: { id: claimId },
      useLighthouse5103: true,
    };

    context('when checkbox is checked and submit button clicked', () => {
      it('should submit5103 notice and redirect to files tab', () => {
        const submitRequest = sinon.spy();
        const submit5103 = sinon.spy();
        const navigate = sinon.spy();

        const { container, rerender } = renderWithRouter(
          <Provider store={store}>
            <Automated5103Notice
              {...props}
              submit5103={submit5103}
              submitRequest={submitRequest}
              navigate={navigate}
            />
          </Provider>,
        );
        expect($('#automated-5103-notice-page', container)).to.exist;
        expect($('va-checkbox', container)).to.exist;
        expect($('va-button', container)).to.exist;

        // Check the checkbox
        $('va-checkbox', container).__events.vaChange({
          detail: { checked: true },
        });

        rerenderWithRouter(
          rerender,
          <Provider store={store}>
            <Automated5103Notice
              {...props}
              submit5103={submit5103}
              submitRequest={submitRequest}
              navigate={navigate}
            />
          </Provider>,
        );

        // Click submit button
        fireEvent.click($('#submit', container));

        expect(submitRequest.called).to.be.false;
        expect(submit5103.called).to.be.true;
        expect(navigate.calledWith('../files')).to.be.true;
      });
    });
    context('when checkbox is not checked and submit button clicked', () => {
      it('should not submit 5103 notice and error message displayed', () => {
        const submitRequest = sinon.spy();
        const submit5103 = sinon.spy();
        const navigate = sinon.spy();

        const { container } = renderWithRouter(
          <Provider store={store}>
            <Automated5103Notice
              {...props}
              submit5103={submit5103}
              submitRequest={submitRequest}
              navigate={navigate}
            />
          </Provider>,
        );
        expect($('#automated-5103-notice-page', container)).to.exist;
        expect($('va-checkbox', container)).to.exist;
        expect($('va-button', container)).to.exist;
        expect($('va-checkbox', container).getAttribute('error')).to.be.null;

        // Click submit button
        fireEvent.click($('#submit', container));

        expect($('va-checkbox', container).getAttribute('checked')).to.equal(
          'false',
        );
        expect(submitRequest.called).to.be.false;
        expect(submit5103.called).to.be.false;
        expect(navigate.called).to.be.false;
        expect($('va-checkbox', container).getAttribute('error')).to.equal(
          'You must confirm you’re done adding evidence before submitting the evidence waiver',
        );
      });
    });
  });
});
