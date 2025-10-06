import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import formConfig from '../../../config/form';
import IntroductionPage from '../../../containers/IntroductionPage';
import { TITLE, SUBTITLE } from '../../../utils/constants';

const instructions = {
  introParagraph:
    'Use our online tool to report medical or dental expenses that you have paid for yourself or for a family member living in your household. These must be expenses you weren’t reimbursed for and don’t expect to be reimbursed for.',
};

const props = {
  route: {
    path: 'introductions',
    pageList: [],
    formConfig,
  },
  userLoggedIn: false,
  userIdVerified: true,
};

const mockStore = {
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: false,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: [],
        loa: {
          current: 3,
          highest: 3,
        },
        verified: true,
        dob: '2000-01-01',
        claims: {
          appeals: false,
        },
      },
    },
    form: {
      formId: formConfig.formId,
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: {
        metadata: {},
      },
      data: {},
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get() {} },
      dismissedDowntimeWarnings: [],
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

describe('IntroductionPage', () => {
  it('should display the correct title and subtitle', () => {
    const screen = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const titleElement = screen.getByTestId('form-title');
    const subtitleElement = screen.getByTestId('form-subtitle');

    expect(titleElement).to.exist;
    expect(titleElement.textContent).to.include(TITLE);
    expect(subtitleElement).to.exist;
    expect(subtitleElement.textContent).to.include(SUBTITLE);
  });

  it('should display the correct instructions paragraph', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const instructionParagraph = container.querySelector(
      'article.schemaform-intro > p:first-of-type',
    );

    expect(instructionParagraph).to.exist;
    expect(instructionParagraph.textContent).to.include(
      instructions.introParagraph,
    );
  });
});

describe('IntroductionPage ProcessList', () => {
  it('should render the process list with three steps', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const processList = container.querySelector('va-process-list');
    expect(processList).to.exist;

    const processListItems = container.querySelectorAll('va-process-list-item');
    expect(processListItems.length).to.equal(3);
  });

  it('should display the correct headers for each step', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const processListItems = Array.from(
      container.querySelectorAll('va-process-list-item'),
    );

    expect(processListItems[0].getAttribute('header')).to.equal(
      'Check that your expenses qualify',
    );
    expect(processListItems[1].getAttribute('header')).to.equal(
      'Gather your information',
    );
    expect(processListItems[2].getAttribute('header')).to.equal(
      'Start your application',
    );
  });

  it('should display all example expenses in the first step', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const firstStep = container.querySelectorAll('va-process-list-item')[0];

    // Check header
    expect(firstStep.textContent).to.include(
      'Here are some examples of expenses you may include:',
    );

    // Check all 11 example expenses from the component
    expect(firstStep.textContent).to.include('Hospital expenses');
    expect(firstStep.textContent).to.include('office fees');
    expect(firstStep.textContent).to.include('Dental fees');
    expect(firstStep.textContent).to.include('Nursing home costs');
    expect(firstStep.textContent).to.include('Hearing aid costs');
    expect(firstStep.textContent).to.include('Home health service expenses');
    expect(firstStep.textContent).to.include(
      'Prescription/non-prescription drug costs',
    );
    expect(firstStep.textContent).to.include(
      'Expenses related to transportation to a hospital, doctor or other medical facility',
    );
    expect(firstStep.textContent).to.include('Vision care costs');
    expect(firstStep.textContent).to.include('Medical insurance premiums');
    expect(firstStep.textContent).to.include('Monthly Medicare deduction');

    // Verify it's a list structure
    const expenseList = firstStep.querySelector('ul');
    expect(expenseList).to.exist;
    const listItems = firstStep.querySelectorAll('li');
    expect(listItems.length).to.equal(11);
  });

  it('should display complete required information in the second step', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const secondStep = container.querySelectorAll('va-process-list-item')[1];

    // Check first section header and content
    expect(secondStep.textContent).to.include('need to apply:');
    expect(secondStep.textContent).to.include(
      'Veteran Social Security number or VA file number',
    );

    // Check second section header and all items
    expect(secondStep.textContent).to.include('medical expense information:');
    expect(secondStep.textContent).to.include(
      'The date of each of each expense',
    );
    expect(secondStep.textContent).to.include(
      'The amount you paid for each expense',
    );
    expect(secondStep.textContent).to.include('The name of the provider');

    // Verify structure - should have 2 h4 elements and 2 ul elements
    const headers = secondStep.querySelectorAll('h4');
    expect(headers.length).to.equal(2);
    const lists = secondStep.querySelectorAll('ul');
    // Last header is in addtional info drop down section.
    expect(lists.length).to.equal(3);

    // Check specific list items count
    const firstList = lists[0];
    const secondList = lists[1];
    expect(firstList.querySelectorAll('li').length).to.equal(1);
    expect(secondList.querySelectorAll('li').length).to.equal(3);
  });

  it('should display complete application process information in the third step', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const thirdStep = container.querySelectorAll('va-process-list-item')[2];

    // Check the complete paragraph text
    const expectedText = 'take you through each step';

    expect(thirdStep.textContent).to.include(expectedText);

    // Verify it contains a paragraph element
    const paragraph = thirdStep.querySelector('p');
    expect(paragraph).to.exist;
    expect(paragraph.textContent.trim()).to.include(expectedText);
  });

  it('should display the process list introduction heading', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const heading = container.querySelector('h2.vads-u-font-size--h3');
    expect(heading).to.exist;
    expect(heading.textContent).to.equal(
      'Follow the steps below to apply for medical expense.',
    );
  });
});
