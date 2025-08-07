import React from 'react';
import { cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import { renderWithStoreAndRouter as render } from '~/platform/testing/unit/react-testing-library-helpers';
import * as useNotificationSettingsUtils from '@@profile/hooks/useNotificationSettingsUtils';
import * as MockDocument from '../../../components/paperless-delivery/Document';
import { Documents } from '../../../components/paperless-delivery/Documents';

describe('Documents', () => {
  afterEach(() => {
    cleanup();
    sinon.restore();
  });

  it('should render alert', () => {
    sinon
      .stub(useNotificationSettingsUtils, 'useNotificationSettingsUtils')
      .returns({
        usePaperlessDeliveryGroup: () => [],
      });
    const { getByText } = render(<Documents />, {
      initialState: {},
    });
    expect(getByText(/Paperless delivery not available yet/)).to.exist;
  });

  it('should render', () => {
    sinon.stub(MockDocument, 'Document').callsFake(() => <div />);
    sinon
      .stub(useNotificationSettingsUtils, 'useNotificationSettingsUtils')
      .returns({
        usePaperlessDeliveryGroup: () => [
          {
            name: 'Digital Delivery - Health Care',
            description:
              'Digital Delivery settings for health care related items',
            items: ['item15'],
            id: 'group6',
          },
        ],
      });
    const { getByRole } = render(<Documents />, {
      initialState: {},
    });
    const heading = getByRole('heading', { level: 2 });
    expect(heading).to.exist;
    expect(heading).to.have.text('Documents available for paperless delivery');
  });
});
