import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import PrivacyPolicy from '../../containers/PrivacyPolicy';

describe('22-1919 <PrivacyPolicy>', () => {
  const fakeStore = (formData = {}) => ({
    getState: () => ({
      form: {
        data: formData,
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  });

  // it('should render privacy policy link/button', () => {
  //   const store = fakeStore();
  //   const { getByText } = render(
  //     <Provider store={store}>
  //       <PrivacyPolicy />,
  //     </Provider>,
  //   );
  //   const link = getByText('privacy policy');
  //   expect(link).to.exist;
  // });

  // it('should render modal', () => {
  //   const store = fakeStore();
  //   const { container } = render(
  //     <Provider store={store}>
  //       <PrivacyPolicy />
  //     </Provider>,
  //   );
  //   const modal = container.querySelector('va-modal');
  //   expect(modal).to.have.attribute('large', 'true');
  //   expect(modal).to.have.attribute('modal-title', 'Privacy Act Statement');
  // });

  // it('should handle onClick event to open modal', () => {
  //   const store = fakeStore();
  //   const { getByText, container } = render(
  //     <Provider store={store}>
  //       <PrivacyPolicy />
  //     </Provider>,
  //   );
  //   const button = getByText('privacy policy.');
  //   const modal = container.querySelector('va-modal');

  //   expect(modal).to.have.attribute('visible', 'false');

  //   button.click();

  //   expect(modal).to.have.attribute('visible', 'true');
  // });

  it('should display title from form data when certifyingOfficial role is present', () => {
    const formData = {
      certifyingOfficial: {
        role: { level: 'certifyingOfficial' },
      },
    };
    const store = fakeStore(formData);
    const { getByText } = render(
      <Provider store={store}>
        <PrivacyPolicy />
      </Provider>,
    );

    expect(getByText('Certifying official')).to.exist;
  });

  it('should display "Owner" title when role level is owner', () => {
    const formData = {
      certifyingOfficial: {
        role: { level: 'owner' },
      },
    };
    const store = fakeStore(formData);
    const { getByText } = render(
      <Provider store={store}>
        <PrivacyPolicy />
      </Provider>,
    );

    expect(getByText('Owner')).to.exist;
  });

  it('should display "Officer" title when role level is officer', () => {
    const formData = {
      certifyingOfficial: {
        role: { level: 'officer' },
      },
    };
    const store = fakeStore(formData);
    const { getByText } = render(
      <Provider store={store}>
        <PrivacyPolicy />
      </Provider>,
    );

    expect(getByText('Officer')).to.exist;
  });

  it('should display custom title when role has other property', () => {
    const formData = {
      certifyingOfficial: {
        role: { other: 'Custom Title' },
      },
    };
    const store = fakeStore(formData);
    const { getByText } = render(
      <Provider store={store}>
        <PrivacyPolicy />
      </Provider>,
    );

    expect(getByText('Custom Title')).to.exist;
  });
});
