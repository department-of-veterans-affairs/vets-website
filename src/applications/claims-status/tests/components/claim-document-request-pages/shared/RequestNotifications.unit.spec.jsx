import React from 'react';
import { expect } from 'chai';
import { within } from '@testing-library/react';

import { renderWithRouter } from '../../../utils';
import RequestNotifications from '../../../../components/claim-document-request-pages/shared/RequestNotifications';

describe('<RequestNotifications>', () => {
  it('should render nothing when no message and no errors', () => {
    const { queryByTestId } = renderWithRouter(
      <RequestNotifications message={null} type1UnknownErrors={null} />,
    );
    expect(queryByTestId('notification')).to.not.exist;
  });

  it('should render nothing when type1UnknownErrors is an empty array', () => {
    const { queryByTestId } = renderWithRouter(
      <RequestNotifications message={null} type1UnknownErrors={[]} />,
    );
    expect(queryByTestId('notification')).to.not.exist;
  });

  it('should render the known error alert when message exists', () => {
    const message = {
      title: 'Known Error',
      body: 'Some known error message',
      type: 'error',
    };
    const { getByTestId } = renderWithRouter(
      <RequestNotifications message={message} type1UnknownErrors={null} />,
    );
    const notification = getByTestId('notification');
    within(notification).getByText('Known Error');
    within(notification).getByText('Some known error message');
  });

  it('should render the type 1 unknown error alert when type1UnknownErrors exists', () => {
    const { getByTestId } = renderWithRouter(
      <RequestNotifications
        message={null}
        type1UnknownErrors={[
          { fileName: 'a.pdf', docType: 'Medical' },
          { fileName: 'b.pdf', docType: 'Medical' },
        ]}
      />,
    );
    const notification = getByTestId('notification');
    within(notification).getByText(
      'We need you to submit files by mail or in person',
    );
  });

  it('should render both alerts when both message and type1UnknownErrors exist', () => {
    const message = {
      title: 'Known Error',
      body: 'Some known error message',
      type: 'error',
    };
    const { getAllByTestId } = renderWithRouter(
      <RequestNotifications
        message={message}
        type1UnknownErrors={[{ fileName: 'a.pdf', docType: 'Medical' }]}
      />,
    );
    const notifications = getAllByTestId('notification');
    expect(notifications).to.have.lengthOf(2);
    within(notifications[0]).getByText('Known Error');
    within(notifications[0]).getByText('Some known error message');
    within(notifications[1]).getByText(
      'We need you to submit files by mail or in person',
    );
  });
});
