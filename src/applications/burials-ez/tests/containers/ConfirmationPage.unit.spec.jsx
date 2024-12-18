import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';

import formConfig from '../../config/form';
import ConfirmationPage from '../../containers/ConfirmationPage';

const formPages = Object.values(formConfig.chapters).reduce(
  (pages, chapter) => ({ ...pages, ...chapter.pages }),
  {},
);

describe('<ConfirmationPage>', () => {
  const testDate = new Date('12-15-2021');
  const store = ({
    transportationReceiptsLength = 2,
    claimedBenefits = true,
    hasDeathCertificate = true,
    burialConfirmationPage = false,
  } = {}) => ({
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          savedForms: [],
          prefillsAvailable: [],
        },
      },
      form: {
        pages: formPages,
        data: {
          claimantFullName: {
            first: 'Sally',
            middle: 'Jane',
            last: 'Doe',
          },
          veteranFullName: {
            first: 'Josie',
            middle: 'Henrietta',
            last: 'Smith',
          },
          'view:claimedBenefits': {
            burialAllowance: claimedBenefits,
            plotAllowance: claimedBenefits,
            transportation: claimedBenefits,
          },
          ...(hasDeathCertificate && {
            deathCertificate: [
              {
                name: 'DeathCertificate.pdf',
                confirmationCode: 'e22d5af8-848d-4fa1-b4f6-90953e0e3c8d',
                attachmentId: '',
                isEncrypted: false,
              },
            ],
          }),
          transportationReceipts: {
            length: transportationReceiptsLength,
          },
        },
        submission: {
          submittedAt: testDate,
          timestamp: testDate.getTime(),
          response: {
            confirmationNumber: 'V-EBC-177',
            regionalOffice: [
              'Western Region',
              'VA Regional Office',
              'P.O. Box 8888',
              'Muskogee, OK 74402-8888',
            ],
          },
        },
      },
      featureToggles: {
        loading: false,
        [`burials_form_enabled`]: true,
        [`burial_confirmation_page`]: burialConfirmationPage,
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  });

  it('renders', () => {
    const mockStore = store();
    const { container, queryByText } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    expect(queryByText('V-EBC-177')).to.not.be.null;
    expect(
      container.querySelector('.benefits-claimed').children.length,
    ).to.equal(3);
  });

  it('renders alternate state', () => {
    const mockStore = store({
      transportationReceiptsLength: 1,
      claimedBenefits: false,
      hasDeathCertificate: false,
    });
    const { queryByText } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    expect(queryByText('Transportation documentation: 1 file')).to.exist;
  });

  context('with burialsConfirmationPage', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = mount(
        <Provider store={store({ burialConfirmationPage: true })}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );
    });

    afterEach(() => {
      if (wrapper) {
        wrapper.unmount();
      }
      cleanup();
    });

    it('it should show status success', () => {
      const mockStore = store({ burialConfirmationPage: true });
      const { container } = render(
        <Provider store={mockStore}>
          <ConfirmationPage route={{ formConfig }} />
        </Provider>,
      );
      expect(container.querySelector('va-alert')).to.have.attr(
        'status',
        'success',
      );
    });

    it('passes the correct props to ConfirmationPageView', () => {
      const confirmationViewProps = wrapper.find('ConfirmationView').props();
      expect(confirmationViewProps.submitDate).to.equal(testDate.getTime());
      expect(confirmationViewProps.confirmationNumber).to.equal('V-EBC-177');
    });
  });
});
