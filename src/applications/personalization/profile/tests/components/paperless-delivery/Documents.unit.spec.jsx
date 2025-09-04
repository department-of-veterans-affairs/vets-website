import React from 'react';
import * as redux from 'react-redux';
import { cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import { renderWithStoreAndRouter as render } from '~/platform/testing/unit/react-testing-library-helpers';
import { selectPatientFacilities } from '~/platform/user/cerner-dsot/selectors';
import * as recordEventModule from '~/platform/monitoring/record-event';
import * as useNotificationSettingsUtils from '@@profile/hooks/useNotificationSettingsUtils';
import * as Document from '../../../components/paperless-delivery/Document';
import { Documents } from '../../../components/paperless-delivery/Documents';

describe('Documents', () => {
  let sandbox;
  let facilities;
  let recordEventStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(redux, 'useSelector').callsFake(selector => {
      if (selector === selectPatientFacilities) {
        return facilities;
      }
      return undefined;
    });
    sandbox.stub(Document, 'Document').callsFake(() => <div />);
    recordEventStub = sandbox.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    cleanup();
    sandbox.restore();
  });

  it('should render alert when missing facilities', () => {
    facilities = [];
    sandbox
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
    const { getByText } = render(<Documents />, {});
    expect(getByText(/Paperless delivery not available yet/)).to.exist;
    const notEnrolledEvent = {
      event: 'visible-alert-box',
      'alert-box-type': 'info',
      'alert-box-heading': 'Paperless delivery not available yet',
      'error-key': 'not_enrolled',
      'alert-box-full-width': false,
      'alert-box-background-only': false,
      'alert-box-closeable': false,
      'reason-for-alert': 'Not enrolled in VA benefits',
    };
    sinon.assert.calledWithExactly(recordEventStub, notEnrolledEvent);
  });

  it('should render documents', () => {
    facilities = ['a-facility'];
    sandbox
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
    const { getByRole } = render(<Documents />, {});
    const heading = getByRole('heading', { level: 2 });
    expect(heading).to.exist;
    expect(heading).to.have.text('Documents available for paperless delivery');
  });

  it('should render data error alert', () => {
    facilities = ['a-facility'];
    sandbox
      .stub(useNotificationSettingsUtils, 'useNotificationSettingsUtils')
      .returns({
        usePaperlessDeliveryGroup: () => [],
      });
    const { container } = render(<Documents />, {});
    const alert = container.querySelector('va-alert[status="warning"]');
    expect(alert).to.exist;
    expect(alert).to.have.text(
      `We’re sorry. Something went wrong on our end and we can’t load your documents available for paperless delivery. Try again later.`,
    );
    const apiErrorEvent = {
      event: 'visible-alert-box',
      'alert-box-type': 'warning',
      'alert-box-heading':
        'We’re sorry. Something went wrong on our end and we can’t load your documents available for paperless delivery. Try again later.',
      'error-key': 'api_error',
      'alert-box-full-width': false,
      'alert-box-background-only': false,
      'alert-box-closeable': false,
      'reason-for-alert': 'API error',
    };
    sinon.assert.calledWithExactly(recordEventStub, apiErrorEvent);
  });
});
