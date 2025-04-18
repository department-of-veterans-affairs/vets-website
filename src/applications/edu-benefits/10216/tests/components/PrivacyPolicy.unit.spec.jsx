import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import PrivacyPolicy from '../../components/PrivacyPolicy';

const defaultStore = createCommonStore();

describe('Privacy Policy modal', () => {
  it('Renders correct privacy policy text to open modal', () => {
    const { container, getByTestId, getByText } = render(<PrivacyPolicy />);
    expect(container.querySelector('p.short-line')).to.not.exist;
    expect(getByText('I have read and accept the')).length.to.be(1);
    expect(getByTestId('privacy-policy-text')).to.exist;
  });
  it('Opens and closes the modal when clicked', async () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <PrivacyPolicy />
      </Provider>,
    );
    fireEvent.click(container.querySelector('va-link'));
    expect($('va-modal[visible="true"]', container)).to.be.visible;
    const event = new CustomEvent('closeEvent');
    await $('va-modal', container).__events.closeEvent(event);
    waitFor(() => {
      expect($('va-modal[visible="false"]', container)).to.exist;
    });
  });
});
