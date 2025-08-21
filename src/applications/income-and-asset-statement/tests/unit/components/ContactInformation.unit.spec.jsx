import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import getData from '../../fixtures/mocks/mockStore';
import ContactInformation from '../../../components/ContactInformationPage';

describe('Contact Information component', () => {
  const mockStore = configureStore([]);
  const defaultProps = {
    router: { push: sinon.spy() },
    setFormData: sinon.spy(),
  };

  const renderWithStore = formData => {
    const { data } = getData({ loggedIn: true, formData });
    const store = mockStore(data);
    return render(
      <Provider store={store}>
        <ContactInformation {...defaultProps} />
      </Provider>,
    );
  };

  it('renders email and phone cards', () => {
    const { container } = renderWithStore({
      email: 'test@example.com',
      phone: '5551234567',
    });

    const cards = $$('va-card', container);
    expect(cards.length).to.equal(2);

    expect(container.textContent).to.include('test@example.com');
    const vaTelephone = container.querySelector(
      'va-telephone[contact="5551234567"]',
    );
    expect(vaTelephone).to.exist;
  });
});
