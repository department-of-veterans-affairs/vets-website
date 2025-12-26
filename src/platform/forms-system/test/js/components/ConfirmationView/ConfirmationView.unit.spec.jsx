import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import {
  ConfirmationView,
  SavePdfDownload,
  ChapterSectionCollection,
} from 'platform/forms-system/src/js/components/ConfirmationView';
import {
  fullNameSchema,
  fullNameUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const formConfig = {
  trackingPrefix: 'test-form-12345-',
  chapters: {
    chapter1: {
      title: 'Chapter 1',
      pages: {
        page1: {
          path: 'page-1',
          title: 'Page 1',
          uiSchema: {
            fullName: fullNameUI(),
          },
          schema: {
            type: 'object',
            properties: {
              fullName: fullNameSchema,
            },
          },
        },
      },
    },
  },
};

const storeBase = {
  form: {
    formId: '123',
    submission: {
      response: {
        confirmationNumber: '123456',
      },
      timestamp: Date.UTC(2025, 1, 1),
    },
    data: {
      fullName: {
        first: 'John',
        middle: '',
        last: 'Veteran',
      },
    },
  },
};

describe('Confirmation view', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('it should be able to be defined using a single component', () => {
    const { container } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationView
          formConfig={formConfig}
          submitDate={new Date()}
          pdfUrl="/"
          confirmationNumber="123456"
        />
      </Provider>,
    );
    const alert = container.querySelector('va-alert');
    expect(alert).to.have.attr('status', 'success');
    expect(container.querySelector('.confirmation-print-only-header-section'))
      .to.exist;
    expect(container.querySelector('.confirmation-save-pdf-download-section'))
      .to.exist;
    expect(container.querySelector('.confirmation-chapter-section-collection'))
      .to.exist;
    expect(container.querySelector('.confirmation-print-this-page-section')).to
      .exist;
    expect(container.querySelector('.confirmation-how-to-contact-section')).to
      .exist;
    expect(container.querySelector('.confirmation-go-back-link-section')).to
      .exist;
  });

  it('it should be able to use chapterSectionCollection showPageTitles via the provider', () => {
    const { getByText } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationView
          formConfig={formConfig}
          submitDate={new Date()}
          pdfUrl="/"
          confirmationNumber="123456"
          chapterSectionCollection={{
            showPageTitles: true,
          }}
        />
      </Provider>,
    );
    const title = getByText(/Page 1/);
    expect(title).to.exist;
  });

  it('it should allow for manual child component specification', () => {
    const { container, getByText } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationView
          formConfig={formConfig}
          submitDate={new Date()}
          pdfUrl="/"
          confirmationNumber="123456"
        >
          <ConfirmationView.SubmissionAlert />
          <ConfirmationView.SavePdfDownload />
          <ConfirmationView.ChapterSectionCollection />
          <ConfirmationView.PrintThisPage />
          <ConfirmationView.WhatsNextProcessList />
          <ConfirmationView.HowToContact />
          <ConfirmationView.GoBackLink />
          <ConfirmationView.NeedHelp />
        </ConfirmationView>
      </Provider>,
    );
    const alert = container.querySelector('va-alert');
    expect(alert).to.have.attr('status', 'success');
    expect(container.querySelector('.confirmation-print-only-header-section'))
      .to.exist;
    expect(container.querySelector('.confirmation-save-pdf-download-section'))
      .to.exist;
    expect(container.querySelector('.confirmation-chapter-section-collection'))
      .to.exist;
    expect(container.querySelector('.confirmation-print-this-page-section')).to
      .exist;
    expect(container.querySelector('.confirmation-how-to-contact-section')).to
      .exist;
    expect(container.querySelector('.confirmation-go-back-link-section')).to
      .exist;
    expect(
      getByText(text =>
        text.includes('You won’t be able to access this page later.'),
      ),
    ).to.exist;
  });

  it('it should allow for component omission', () => {
    const { container } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationView
          formConfig={formConfig}
          submitDate={new Date()}
          pdfUrl="/"
          confirmationNumber="123456"
        >
          <ConfirmationView.SubmissionAlert />
          <ConfirmationView.GoBackLink />
          <ConfirmationView.NeedHelp />
        </ConfirmationView>
      </Provider>,
    );
    const alert = container.querySelector('va-alert');
    expect(alert).to.have.attr('status', 'success');
    expect(container.querySelector('.confirmation-print-only-header-section'))
      .to.exist;
    expect(container.querySelector('.confirmation-go-back-link-section')).to
      .exist;

    expect(container.querySelector('.confirmation-save-pdf-download-section'))
      .to.not.exist;
    expect(container.querySelector('.confirmation-chapter-section-collection'))
      .to.not.exist;
    expect(container.querySelector('.confirmation-print-this-page-section')).to
      .not.exist;
    expect(container.querySelector('.confirmation-contact-section')).to.not
      .exist;
  });

  it('it should allow for component injection', () => {
    const { getByText } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationView formConfig={formConfig}>
          <ConfirmationView.SubmissionAlert />
          <ConfirmationView.SavePdfDownload />
          <ConfirmationView.ChapterSectionCollection />
          <ConfirmationView.PrintThisPage />
          <div>hello world</div>
          <ConfirmationView.WhatsNextProcessList />
          <ConfirmationView.HowToContact />
          <ConfirmationView.GoBackLink />
          <ConfirmationView.NeedHelp />
        </ConfirmationView>
      </Provider>,
    );
    expect(getByText('hello world')).to.exist;
  });

  it('it should allow for individual component usage', () => {
    const { container } = render(
      <Provider store={mockStore(storeBase)}>
        <SavePdfDownload pdfUrl="/" />
        <ChapterSectionCollection formConfig={formConfig} />
      </Provider>,
    );
    expect(container.querySelector('.confirmation-save-pdf-download-section'))
      .to.exist;
    expect(container.querySelector('.confirmation-chapter-section-collection'))
      .to.exist;
  });
});
