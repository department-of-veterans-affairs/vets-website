import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import CustomAlert from '../../../components/messages/CustomAlert';

describe('Custom Alert component', () => {
  const headline = 'some headline';

  describe('renders', () => {
    it('renders info alert with defaults', async () => {
      const contentText = 'Some text for content';
      const { getByRole, getByText, getByTestId } = render(
        <CustomAlert headline={headline}>
          <p>{contentText}</p>
        </CustomAlert>,
      );
      expect(getByRole('heading', { name: headline })).to.exist;
      expect(getByText(contentText)).to.exist;
      const alertEl = getByTestId('mhv-custom-alert');
      expect(alertEl.className).to.include('mhv-u-reg-alert-info');
    });

    it('renders warning alert', async () => {
      const { getByTestId } = render(
        <CustomAlert headline={headline} status="warning" />,
      );
      const alertEl = getByTestId('mhv-custom-alert');
      expect(alertEl.className).to.include('mhv-u-reg-alert-warning');
    });

    it('renders success alert', async () => {
      const { getByTestId } = render(
        <CustomAlert headline={headline} status="success" />,
      );
      const alertEl = getByTestId('mhv-custom-alert');
      expect(alertEl.className).to.include('mhv-u-reg-alert-success');
    });

    it('renders continue alert', async () => {
      const { getByTestId } = render(
        <CustomAlert headline={headline} status="continue" />,
      );
      const alertEl = getByTestId('mhv-custom-alert');
      // Continue uses the same styling as success.
      expect(alertEl.className).to.include('mhv-u-reg-alert-success');
    });

    it('renders info alert', async () => {
      const { getByTestId } = render(
        <CustomAlert headline={headline} status="info" />,
      );
      const alertEl = getByTestId('mhv-custom-alert');
      expect(alertEl.className).to.include('mhv-u-reg-alert-info');
    });

    it('renders custom icon', async () => {
      const iconName = 'lock';
      const { getByTestId } = render(
        <CustomAlert headline={headline} icon={iconName} />,
      );
      const iconEl = getByTestId('mhv-custom-alert-icon');
      expect(iconEl.getAttribute('icon')).to.eql(iconName);
    });
  });

  it('reports analytics', async () => {
    const status = 'info';
    const event = {
      event: 'nav-alert-box-load',
      action: 'load',
      'alert-box-headline': headline,
      'alert-box-status': status,
    };
    const recordEventSpy = sinon.spy();
    render(
      <CustomAlert
        headline={headline}
        status={status}
        recordEvent={recordEventSpy}
      />,
    );
    await waitFor(() => {
      expect(recordEventSpy.calledOnce).to.be.true;
      expect(recordEventSpy.calledWith(event)).to.be.true;
    });
  });
});
