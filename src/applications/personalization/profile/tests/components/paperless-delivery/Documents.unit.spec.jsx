import React from 'react';
import * as redux from 'react-redux';
import { cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import { renderWithStoreAndRouter as render } from '~/platform/testing/unit/react-testing-library-helpers';
import { selectPatientFacilities } from '~/platform/user/cerner-dsot/selectors';
import * as useNotificationSettingsUtils from '@@profile/hooks/useNotificationSettingsUtils';
import * as Document from '../../../components/paperless-delivery/Document';
import { Documents } from '../../../components/paperless-delivery/Documents';

describe('Documents', () => {
  let sandbox;
  let facilities;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(redux, 'useSelector').callsFake(selector => {
      if (selector === selectPatientFacilities) {
        return facilities;
      }
      return undefined;
    });
    sandbox.stub(Document, 'Document').callsFake(() => <div />);
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
  });
});
