import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import formConfig from '../../../config/form';

describe('ConfirmationPage', () => {
  let wrapper;
  const mockStore = configureMockStore();
  const baseState = {
    form: {
      formId: formConfig.formId,
      submission: {
        response: {
          confirmationNumber: '123456',
          pdfUrl: 'http://example.com/confirmation.pdf',
        },
        timestamp: Date.now(),
      },
      data: {
        veteran: { fullName: { first: 'John', last: 'Doe' } },
      },
    },
  };

  const mountComponent = (storeState = baseState) => {
    const store = mockStore(storeState);
    return mount(
      <Provider store={store}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
  };

  afterEach(() => {
    if (wrapper) wrapper.unmount();
  });

  it('renders correctly with full data', () => {
    wrapper = mountComponent();
    const confirmationViewProps = wrapper.find('ConfirmationView').props();

    expect(confirmationViewProps.submitDate).to.exist;
    expect(confirmationViewProps.confirmationNumber).to.equal(
      baseState.form.submission.response.confirmationNumber,
    );
    expect(confirmationViewProps.submitterName).to.deep.equal(
      baseState.form.data.veteran.fullName,
    );
    expect(confirmationViewProps.pdfUrl).to.equal(
      baseState.form.submission.response.pdfUrl,
    );
  });

  it('displays preparer name if defined', () => {
    const mockState = {
      ...baseState,
      form: {
        ...baseState.form,
        data: {
          ...baseState.form.data,
          preparerIdentification: {
            preparerFullName: { first: 'Jane', last: 'Smith' },
          },
        },
      },
    };
    wrapper = mountComponent(mockState);
    const confirmationViewProps = wrapper.find('ConfirmationView').props();

    expect(confirmationViewProps.submitterName).to.deep.equal({
      first: 'Jane',
      last: 'Smith',
    });
  });

  it('handles missing form gracefully', () => {
    wrapper = mountComponent({});
    const confirmationViewProps = wrapper.find('ConfirmationView').props();

    expect(confirmationViewProps.submitDate).to.be.undefined;
    expect(confirmationViewProps.confirmationNumber).to.be.undefined;
    expect(confirmationViewProps.submitterName).to.be.undefined;
  });

  it('throws an error if submission timestamp is missing', () => {
    const mockState = {
      ...baseState,
      form: {
        ...baseState.form,
        submission: {
          ...baseState.form.submission,
          timestamp: undefined,
        },
      },
    };

    expect(() => mountComponent(mockState)).to.throw();
  });

  it('renders alert content with confirmation number', () => {
    wrapper = mountComponent();
    expect(wrapper.text()).to.include(
      `Your confirmation number is ${
        baseState.form.submission.response.confirmationNumber
      }.`,
    );
  });

  it('handles undefined preparer and veteran names gracefully', () => {
    const mockState = {
      form: {
        ...baseState.form,
        data: {},
      },
    };
    wrapper = mountComponent(mockState);
    const confirmationViewProps = wrapper.find('ConfirmationView').props();

    expect(confirmationViewProps.submitterName).to.be.undefined;
  });

  it('renders essential ConfirmationView components', () => {
    wrapper = mountComponent();

    expect(wrapper.find('ConfirmationView.SubmissionAlert').exists()).to.be
      .true;
    expect(wrapper.find('ConfirmationView.SavePdfDownload').exists()).to.be
      .true;
    expect(wrapper.find('ConfirmationView.ChapterSectionCollection').exists())
      .to.be.true;
    expect(wrapper.find('ConfirmationView.PrintThisPage').exists()).to.be.true;
    expect(wrapper.find('ConfirmationView.WhatsNextProcessList').exists()).to.be
      .true;
    expect(wrapper.find('ConfirmationView.HowToContact').exists()).to.be.true;
    expect(wrapper.find('ConfirmationView.GoBackLink').exists()).to.be.true;
    expect(wrapper.find('ConfirmationView.NeedHelp').exists()).to.be.true;
  });
});
