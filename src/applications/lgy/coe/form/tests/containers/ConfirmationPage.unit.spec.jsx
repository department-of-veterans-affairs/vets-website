import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import moment from 'moment';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import ConfirmationPage from '../../containers/ConfirmationPage';
import formConfig from '../../config/form';

const today = Date.now();
const fullName = {
  first: 'Foo',
  middle: 'Man',
  last: 'Choo',
};
const referenceNumber = 'x12345x';

const mockStore = {
  getState: () => ({
    form: {
      formId: formConfig.formId,
      data: { fullName },
      submission: {
        response: { attributes: { referenceNumber } },
        timestamp: today,
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

describe('ConfirmationPage', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage />
      </Provider>,
    );

    const h2 = $$('h2', container);
    expect(h2.length).to.eq(4);
    expect(h2[0].textContent).to.contain('successfully submitted your request');
    expect(h2[1].textContent).to.contain('for a Certificate of Eligibility');
    expect(h2[2].textContent).to.contain('When will I hear back');
    expect(h2[3].textContent).to.contain('What if I have more questions?');

    const h3 = $$('h3', container);
    expect(h3.length).to.eq(3);
    expect(h3[0].textContent).to.contain('Date submitted');
    expect(h3[1].textContent).to.contain('Reference number');
    expect(h3[2].textContent).to.contain('Within 5 business days');

    const inset = $('.inset', container).textContent;
    expect(inset).to.contain(Object.values(fullName).join(' '));
    expect(inset).to.contain(referenceNumber);
    expect(inset).to.contain(moment(today).format('LL'));
  });
});
