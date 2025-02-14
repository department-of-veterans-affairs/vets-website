import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import sinon from 'sinon';
import * as Scroll from 'react-scroll';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import { scrollToTop } from '../../../helpers';
import formConfig from '../../../config/form';

const getData = ({
  loggedIn = true,
  hasResponse = true,
  hasRegionalOffice = true,
  hasBankAccount = true,
  timestamp = new Date('09/07/2024'),
  pensionConfirmationUpdate = false,
} = {}) => ({
  mockStore: {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          savedForms: [],
          prefillsAvailable: [],
          verified: false,
        },
      },
      form: {
        submission: {
          ...(hasResponse && {
            response: {
              confirmationNumber: 'V-PEN-177',
              ...(hasRegionalOffice && {
                regionalOffice: [
                  'Attention: Western Region',
                  'VA Regional Office',
                  'P.O. Box 8888',
                  'Muskogee, OK 74402-8888',
                ],
              }),
            },
          }),
          timestamp,
        },
        data: {
          veteranFullName: { first: 'Jane', last: 'Doe' },
          ...(hasBankAccount && {
            bankAccount: {
              accountType: 'checking',
              bankName: 'Best Bank',
              accountNumber: '001122334455',
              routingNumber: '123123123',
            },
          }),
        },
      },
      featureToggles: {
        loading: false,
        [`pension_confirmation_update`]: pensionConfirmationUpdate,
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('scrollToTop function', () => {
  let scrollToSpy;
  beforeEach(() => {
    scrollToSpy = sinon.stub(Scroll.scroller, 'scrollTo');
  });
  afterEach(() => {
    scrollToSpy.restore();
  });

  it('should call scroller.scrollTo with correct parameters', () => {
    scrollToTop();
    expect(scrollToSpy.calledOnce).to.be.true;
    expect(
      scrollToSpy.calledWith('topScrollElement', {
        duration: 500,
        delay: 0,
        smooth: true,
      }),
    ).to.be.true;
  });
});

describe('Pension benefits confirmation page', () => {
  it('should render', () => {
    const { mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    expect($('h2', container)).to.exist;
    expect($('h2', container).textContent).to.eql(
      'Your Veterans Pension application',
    );
    expect($$('va-alert[status="success', container).length).to.equal(1);
    expect($('va-button', container).getAttribute('text')).to.eq(
      'Print this page',
    );

    const sections = $$('section');
    expect(sections.length).to.eq(4);
    expect($('h2', sections[0]).textContent).to.eql(
      'If you need to submit supporting documents',
    );
    expect($('h2', sections[1]).textContent).to.eql('What to expect next');
    expect($('h2', sections[2]).textContent).to.eql(
      'Direct deposit account information',
    );
    expect($('h2', sections[3]).textContent).to.eql(
      'How to contact us if you have questions',
    );

    expect($$('.va-address-block', container).length).to.eq(2);
    expect($$('va-telephone', container).length).to.eq(2);
    expect($('#pension_527ez_submission_confirmation', container)).to.exist;
    expect($('.confirmation-submission-alert-section', container)).to.not.exist;
    expect($('.confirmation-print-this-page-section', container)).to.not.exist;
    expect($('.confirmation-whats-next-process-list-section', container)).to.not
      .exist;
  });

  it('should render if no submission response', () => {
    const { mockStore } = getData({ hasResponse: false });
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
    expect($('#pension_527ez_submission_confirmation', container)).not.to.exist;
  });

  it('should not include bank account section', () => {
    const { mockStore } = getData({ hasBankAccount: false });
    render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
    const sections = $$('section');
    expect(sections.length).to.eq(3);
  });

  it('should render updated content', () => {
    const { mockStore } = getData({
      pensionConfirmationUpdate: true,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    expect($('h2', container)).to.exist;
    expect($('h2', container).textContent).to.eql(
      'Form submission started on September 7, 2024',
    );
    expect($('.confirmation-submission-alert-section', container)).to.exist;
    expect($('.confirmation-print-this-page-section', container)).to.exist;
    expect($('.confirmation-whats-next-process-list-section', container)).to
      .exist;
    const sections = $$('section');
    expect(sections.length).to.eq(3);
    expect($('h2', sections[0]).textContent).to.eql(
      'If you need to submit supporting documents',
    );
    expect($('h2', sections[1]).textContent).to.eql(
      'Direct deposit account information',
    );
    expect($('h2', sections[2]).textContent).to.eql(
      'When to tell us if your information changes',
    );
    expect($('.confirmation-how-to-contact-section', container)).to.exist;
  });
});
