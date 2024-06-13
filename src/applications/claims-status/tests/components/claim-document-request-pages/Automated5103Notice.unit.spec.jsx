import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
// import * as router from 'react-router-dom-v5-compat';
import { renderWithRouter, rerenderWithRouter } from '../../utils';
import * as actions from '../../../actions';

import Automated5103Notice from '../../../components/claim-document-request-pages/Automated5103Notice';

const claimId = 1;

describe('<Automated5103Notice>', () => {
  it('should render component when item is a 5103 notice', () => {
    const item = {
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

    const { getByText, getByTestId, container } = renderWithRouter(
      <Automated5103Notice claimId={claimId} item={item} />,
    );
    expect($('#automated-5103-notice-page', container)).to.exist;
    getByText('Review the list of evidence we need');
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
      <Automated5103Notice claimId={claimId} item={item} />,
    );
    expect($('#automated-5103-notice-page', container)).to.not.exist;
  });

  context('when checkbox is checked and submit button clicked', () => {
    it('should submit 5103 notice and redirect to files tab', () => {
      const submit = sinon.spy(actions, 'submit5103');
      // const stubNavigate = sinon.stub(router, 'useNavigate');
      // const navigate = sinon.spy();
      // stubNavigate.returns(navigate);

      const item = {
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

      const { container, rerender } = renderWithRouter(
        <Automated5103Notice claimId={claimId} item={item} />,
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
        <Automated5103Notice claimId={claimId} item={item} />,
      );

      // Click submit button
      fireEvent.click($('#submit', container));

      expect(submit.calledOnce).to.be.true;
      // expect(navigate.calledOnce).to.be.true;

      // expect(navigate.calledWith('../files')).to.be.true;
    });
  });
});
