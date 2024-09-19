import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import CustomIconAlert from '../../components/CustomIconAlert';

describe('Custom Alert component', () => {
  const headline = 'some headline';

  describe('renders', () => {
    it('renders info alert with defaults', () => {
      const contentText = 'Some text for content';
      const { getByRole, getByText, getByTestId } = render(
        <CustomIconAlert headline={headline}>
          <p>{contentText}</p>
        </CustomIconAlert>,
      );
      expect(getByRole('heading', { name: headline })).to.exist;
      expect(getByText(contentText)).to.exist;
      const alertEl = getByTestId('mhv-custom-alert');
      expect(alertEl.className).to.include('mhv-u-reg-alert-info');
    });

    it('renders warning alert', () => {
      const { getByTestId } = render(
        <CustomIconAlert headline={headline} status="warning" />,
      );
      const alertEl = getByTestId('mhv-custom-alert');
      expect(alertEl.className).to.include('mhv-u-reg-alert-warning');
    });

    it('renders success alert', () => {
      const { getByTestId } = render(
        <CustomIconAlert headline={headline} status="success" />,
      );
      const alertEl = getByTestId('mhv-custom-alert');
      expect(alertEl.className).to.include('mhv-u-reg-alert-success');
    });

    it('renders continue alert', () => {
      const { getByTestId } = render(
        <CustomIconAlert headline={headline} status="continue" />,
      );
      const alertEl = getByTestId('mhv-custom-alert');
      // Continue uses the same styling as success.
      expect(alertEl.className).to.include('mhv-u-reg-alert-success');
    });

    it('renders info alert', () => {
      const { getByTestId } = render(
        <CustomIconAlert headline={headline} status="info" />,
      );
      const alertEl = getByTestId('mhv-custom-alert');
      expect(alertEl.className).to.include('mhv-u-reg-alert-info');
    });

    it('renders custom icon', () => {
      const iconName = 'lock';
      const { getByTestId } = render(
        <CustomIconAlert headline={headline} icon={iconName} />,
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
      <CustomIconAlert
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
