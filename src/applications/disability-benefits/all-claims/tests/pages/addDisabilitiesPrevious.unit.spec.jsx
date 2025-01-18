import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { fullStringSimilaritySearch } from 'platform/forms-system/src/js/utilities/addDisabilitiesStringSearch';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import set from 'platform/utilities/data/set';
import React from 'react';
import sinon from 'sinon';

import formConfig from '../../config/form';
import disabilityLabelsRevised from '../../content/disabilityLabelsRevised';
import { updateFormData } from '../../pages/addDisabilitiesPrevious';

const items = Object.values(disabilityLabelsRevised);

const {
  schema,
  uiSchema,
} = formConfig.chapters.disabilities.pages.addDisabilitiesPrevious;

const createScreen = (
  claimingNew = true,
  claimingIncrease = false,
  condition = null,
) => {
  const onSubmit = sinon.spy();

  return render(
    <DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      uiSchema={uiSchema}
      data={{
        'view:claimType': {
          'view:claimingNew': claimingNew,
          'view:claimingIncrease': claimingIncrease,
        },
        newDisabilities: condition,
        ratedDisabilities: [{}, {}],
      }}
      formData={{}}
      onSubmit={onSubmit}
    />,
  );
};

const simulateInputChange = (selector, value) => {
  const vaTextInput = selector;
  vaTextInput.value = value;

  const event = new Event('input', {
    bubbles: true,
  });

  vaTextInput.dispatchEvent(event);
};

const addAConditionWithMouse = (
  getAllByRole,
  getByTestId,
  getByText,
  searchTerm,
  searchResult,
) => {
  const input = getByTestId('combobox-input');
  simulateInputChange(input, searchTerm);

  const listboxItems = getAllByRole('option');
  const freeTextItem = listboxItems.find(
    item => item.textContent === searchResult,
  );
  fireEvent.click(freeTextItem);

  const saveButton = getByText('Save');
  fireEvent.click(saveButton);
};

const addAConditionWithKeyboard = (
  getAllByRole,
  getByTestId,
  getByText,
  searchTerm,
  searchResult,
) => {
  const input = getByTestId('combobox-input');
  simulateInputChange(input, searchTerm);

  fireEvent.keyDown(input, { key: 'ArrowDown' });

  const listboxItems = getAllByRole('option');

  for (const item of listboxItems) {
    if (item.textContent !== searchResult) {
      fireEvent.keyDown(item, { key: 'ArrowDown' });
    } else if (item.textContent === searchResult) {
      fireEvent.keyDown(input, { key: 'Enter' });
      break;
    }
  }

  const saveButton = getByText('Save');
  fireEvent.click(saveButton);
};

describe('Add Disabilities Page', () => {
  describe('Default Rendering', () => {
    it('should render page heading and directions', () => {
      const { getByRole, getByText } = createScreen();

      const heading = getByRole('heading', {
        name: 'Tell us the new conditions you want to claim',
      });
      const directions = getByText(
        'Enter the name of your condition. Then, select your condition from the list of possible matches.',
      );

      expect(heading).to.be.visible;
      expect(directions).to.be.visible;
    });

    it('should render "If conditions aren\'t listed" subheading and details', () => {
      const { getByRole, getByText } = createScreen();

      const notListedSubHeading = getByRole('heading', {
        name: 'If your conditions aren’t listed',
      });
      const notListedDetails = getByText(
        'You can claim a condition that isn’t listed. Enter your condition, diagnosis, or short description of your symptoms.',
      );

      expect(notListedSubHeading).to.be.visible;
      expect(notListedDetails).to.be.visible;
    });

    it('should render examples subheading and list', () => {
      const { getByRole, getByText } = createScreen();

      const examplesSubHeading = getByRole('heading', {
        name: 'Examples of conditions',
      });
      const examples = getByRole('list').children;
      const example1 = getByText('Tinnitus (ringing or hissing in ears)');
      const example2 = getByText('PTSD (post-traumatic stress disorder)');
      const example3 = getByText('Hearing loss');
      const example4 = getByText('Neck strain (cervical strain)');
      const example5 = getByText('Ankylosis in knee, right');
      const example6 = getByText('Hypertension (high blood pressure)');
      const example7 = getByText('Migraines (headaches)');

      expect(examplesSubHeading).to.be.visible;
      expect(examples.length).to.eq(7);
      expect(example1).to.be.visible;
      expect(example2).to.be.visible;
      expect(example3).to.be.visible;
      expect(example4).to.be.visible;
      expect(example5).to.be.visible;
      expect(example6).to.be.visible;
      expect(example7).to.be.visible;
    });

    it('should render "Your new conditions" subheading, ComboBox, save button, and add another condition button', () => {
      const { getByRole, getByTestId, getByText } = createScreen();

      const newConditionsSubHeading = getByRole('heading', {
        name: 'Your new conditions',
      });
      const input = getByTestId('combobox-input');
      const saveButton = getByText('Save');
      const addAnotherConditionButton = getByText('Add another condition');

      expect(newConditionsSubHeading).to.be.visible;
      expect(input).to.be.visible;
      expect(saveButton).to.be.visible;
      expect(addAnotherConditionButton).to.be.visible;
    });

    it('should render with no saved conditions by default', () => {
      const { queryByText } = createScreen();

      const savedConditionEditButton = queryByText('Edit');

      expect(savedConditionEditButton).to.not.exist;
    });

    it('should render ComboBox label with required, input, and listbox', () => {
      const { getByRole, getByText, getByTestId } = createScreen();

      const label = getByText('Enter your condition');
      const required = label.querySelector('span').textContent;
      const input = getByTestId('combobox-input');
      const listbox = getByRole('listbox');

      expect(label).to.be.visible;
      expect(required).to.eq('(*Required)');
      expect(input).to.be.visible;
      expect(listbox).to.be.visible;
      expect(listbox).to.have.length(0);
    });

    it('should render error message on item and alert on page if no new conditions are added', () => {
      const { getByText } = createScreen();

      const submitButton = getByText('Submit');
      fireEvent.click(submitButton);

      const errorMessage = getByText(
        'Enter a condition, diagnosis, or short description of your symptoms',
      );
      const alertHeading = getByText('Enter a condition to submit your claim');
      const alertText = getByText(
        'You’ll need to enter a condition, diagnosis, or short description of your symptoms to submit your claim.',
      );

      expect(errorMessage).to.be.visible;
      expect(alertHeading).to.be.visible;
      expect(alertText).to.be.visible;
    });
  });

  describe('Updating State', () => {
    it('should render with saved condition when there is initial formData', () => {
      const { getByText } = createScreen(true, false, [
        {
          condition: 'asthma',
        },
      ]);

      const savedCondition = getByText('asthma');
      const savedConditionEditButton = getByText('Edit');

      expect(savedCondition).to.be.visible;
      expect(savedConditionEditButton).to.be.visible;
    });

    it('should be able to add value to ComboBox input ', () => {
      const searchTerm = 'Typed value';
      const searchResults = fullStringSimilaritySearch(searchTerm, items);
      const freeTextAndFilteredItemsCount = searchResults.length + 1;
      const { getByRole, getByTestId } = createScreen();

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);
      const listbox = getByRole('listbox');

      expect(listbox).to.have.length(freeTextAndFilteredItemsCount);

      fireEvent.click(document);

      expect(listbox).to.have.length(0);
      expect(input).to.have.value(searchTerm);
    });

    it('should render ComboBox listbox items in alignment with string similarity search', () => {
      const searchTerm = 'ACL';
      const searchResults = fullStringSimilaritySearch(searchTerm, items);
      const { getAllByRole, getByTestId } = createScreen();

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);
      const listboxItems = getAllByRole('option');

      listboxItems.forEach((item, index) => {
        if (index === 0) {
          expect(item.textContent).to.eq(
            `Enter your condition as "${searchTerm}"`,
          );
        } else {
          const searchResult = searchResults[index - 1];
          expect(item.textContent).to.eq(searchResult);
        }
      });
    });
  });

  describe('Mouse Interactions', () => {
    it('should be able to add a free-text condition', () => {
      const searchTerm = 'Tinnitus';
      const {
        getAllByRole,
        getByTestId,
        getByText,
        queryByTestId,
      } = createScreen();

      addAConditionWithMouse(
        getAllByRole,
        getByTestId,
        getByText,
        searchTerm,
        `Enter your condition as "${searchTerm}"`,
      );

      const savedConditionEditButton = getByText('Edit');
      const savedCondition = getByText(searchTerm);

      expect(savedConditionEditButton).to.be.visible;
      expect(savedCondition).to.be.visible;

      const input = queryByTestId('combobox-input');
      expect(input).to.not.exist;
    });

    it('should be able to select a condition', () => {
      const searchTerm = 'Tinn';
      const searchResult = 'tinnitus (ringing or hissing in ears)';
      const { getAllByRole, getByTestId, getByText } = createScreen();

      addAConditionWithMouse(
        getAllByRole,
        getByTestId,
        getByText,
        searchTerm,
        searchResult,
      );

      const savedConditionEditButton = getByText('Edit');
      const savedCondition = getByText(searchResult);

      expect(savedConditionEditButton).to.be.visible;
      expect(savedCondition).to.be.visible;
    });

    it('should be able to edit a condition', () => {
      const searchTerm = 'Tinn';
      const searchResult = 'tinnitus (ringing or hissing in ears)';
      const newSearchTerm = 'Neck strain';
      const newSearchResult = 'neck strain (cervical strain)';
      const { getAllByRole, getByTestId, getByText } = createScreen();

      addAConditionWithMouse(
        getAllByRole,
        getByTestId,
        getByText,
        searchTerm,
        searchResult,
      );

      const savedConditionEditButton = getByText('Edit');
      const savedCondition = getByText(searchResult);

      expect(savedConditionEditButton).to.be.visible;
      expect(savedCondition).to.be.visible;

      fireEvent.click(savedConditionEditButton);

      addAConditionWithMouse(
        getAllByRole,
        getByTestId,
        getByText,
        newSearchTerm,
        newSearchResult,
      );
      const newCondition = getByText(newSearchResult);

      expect(newCondition).to.be.visible;
    });

    it('should be able to select two conditions then remove one', () => {
      const searchTerm1 = 'Tinn';
      const searchResult1 = 'tinnitus (ringing or hissing in ears)';
      const searchTerm2 = 'Hear';
      const searchResult2 = 'hearing loss';
      const {
        getAllByRole,
        getAllByText,
        getByTestId,
        getByText,
        queryByText,
      } = createScreen();

      addAConditionWithMouse(
        getAllByRole,
        getByTestId,
        getByText,
        searchTerm1,
        searchResult1,
      );

      const savedConditionEditButton1 = getByText('Edit');
      const savedCondition1 = getByText(searchResult1);

      const addAnotherConditionButton = getByText('Add another condition');
      fireEvent.click(addAnotherConditionButton);

      addAConditionWithMouse(
        getAllByRole,
        getByTestId,
        getByText,
        searchTerm2,
        searchResult2,
      );

      const savedConditionEditButton2 = getAllByText('Edit')[1];
      let savedCondition2 = getByText(searchResult2);

      expect(savedConditionEditButton1).to.be.visible;
      expect(savedCondition1).to.be.visible;
      expect(savedConditionEditButton2).to.be.visible;
      expect(savedCondition2).to.be.visible;

      fireEvent.click(savedConditionEditButton2);
      const removeButton = getByText('Remove');
      fireEvent.click(removeButton);

      savedCondition2 = queryByText(searchResult2);

      expect(savedCondition2).not.to.exist;
    });

    it('should submit when form is completed', () => {
      const { getByText, queryByText } = createScreen(true, false, [
        {
          cause: 'NEW',
          condition: 'asthma',
          'view:descriptionInfo': {},
        },
      ]);

      const submitButton = getByText('Submit');
      fireEvent.click(submitButton);

      const errorMessage = queryByText(
        'Enter a condition, diagnosis, or short description of your symptoms',
      );
      const alertHeading = queryByText(
        'Enter a condition to submit your claim',
      );

      expect(errorMessage).not.to.exist;
      expect(alertHeading).not.to.exist;
    });
  });

  describe('Keyboard Interactions', () => {
    it('should be able to add a free-text condition', () => {
      const searchTerm = 'Tinnitus';
      const {
        getAllByRole,
        getByTestId,
        getByText,
        queryByTestId,
      } = createScreen();

      addAConditionWithKeyboard(
        getAllByRole,
        getByTestId,
        getByText,
        searchTerm,
        `Enter your condition as "${searchTerm}"`,
      );

      const savedConditionEditButton = getByText('Edit');
      const savedCondition = getByText(searchTerm);

      expect(savedConditionEditButton).to.be.visible;
      expect(savedCondition).to.be.visible;

      const input = queryByTestId('combobox-input');
      expect(input).to.not.exist;
    });

    it('should be able to select a condition', () => {
      const searchTerm = 'Tinn';
      const searchResult = 'tinnitus (ringing or hissing in ears)';
      const { getAllByRole, getByTestId, getByText } = createScreen();

      addAConditionWithKeyboard(
        getAllByRole,
        getByTestId,
        getByText,
        searchTerm,
        searchResult,
      );

      const savedConditionEditButton = getByText('Edit');
      const savedCondition = getByText(searchResult);

      expect(savedConditionEditButton).to.be.visible;
      expect(savedCondition).to.be.visible;
    });

    it('should be able to edit a condition', () => {
      const searchTerm = 'Tinn';
      const searchResult = 'tinnitus (ringing or hissing in ears)';
      const newSearchTerm = 'Neck strain';
      const newSearchResult = 'neck strain (cervical strain)';
      const { getAllByRole, getByTestId, getByText } = createScreen();

      addAConditionWithKeyboard(
        getAllByRole,
        getByTestId,
        getByText,
        searchTerm,
        searchResult,
      );

      const savedConditionEditButton = getByText('Edit');
      const savedCondition = getByText(searchResult);

      expect(savedConditionEditButton).to.be.visible;
      expect(savedCondition).to.be.visible;

      userEvent.type(savedConditionEditButton, '{enter}');

      addAConditionWithKeyboard(
        getAllByRole,
        getByTestId,
        getByText,
        newSearchTerm,
        newSearchResult,
      );
      const newCondition = getByText(newSearchResult);

      expect(newCondition).to.be.visible;
    });

    it('should be able to select two conditions then remove one', () => {
      const searchTerm1 = 'Tinn';
      const searchResult1 = 'tinnitus (ringing or hissing in ears)';
      const searchTerm2 = 'Hear';
      const searchResult2 = 'hearing loss';
      const {
        getAllByRole,
        getAllByText,
        getByTestId,
        getByText,
        queryByText,
      } = createScreen();

      addAConditionWithKeyboard(
        getAllByRole,
        getByTestId,
        getByText,
        searchTerm1,
        searchResult1,
      );

      const savedConditionEditButton1 = getByText('Edit');
      const savedCondition1 = getByText(searchResult1);

      const addAnotherConditionButton = getByText('Add another condition');
      userEvent.type(addAnotherConditionButton, '{enter}');

      addAConditionWithKeyboard(
        getAllByRole,
        getByTestId,
        getByText,
        searchTerm2,
        searchResult2,
      );

      const savedConditionEditButton2 = getAllByText('Edit')[1];
      let savedCondition2 = getByText(searchResult2);

      expect(savedConditionEditButton1).to.be.visible;
      expect(savedCondition1).to.be.visible;
      expect(savedConditionEditButton2).to.be.visible;
      expect(savedCondition2).to.be.visible;

      userEvent.type(savedConditionEditButton2, '{enter}');
      const removeButton = getByText('Remove');
      userEvent.type(removeButton, '{enter}');

      savedCondition2 = queryByText(searchResult2);

      expect(savedCondition2).not.to.exist;
    });

    it('should submit when form is completed', () => {
      const { getByText, queryByText } = createScreen(true, false, [
        {
          cause: 'NEW',
          condition: 'asthma',
          'view:descriptionInfo': {},
        },
      ]);

      const submitButton = getByText('Submit');
      userEvent.type(submitButton, '{enter}');

      const errorMessage = queryByText(
        'Enter a condition, diagnosis, or short description of your symptoms',
      );
      const alertHeading = queryByText(
        'Enter a condition to submit your claim',
      );

      expect(errorMessage).not.to.exist;
      expect(alertHeading).not.to.exist;
    });
  });

  describe('Accessibility', () => {
    it('should provide screen reader feedback when autocomplete results are available', () => {
      const searchTerm = 'asthma';
      const searchResults = fullStringSimilaritySearch(searchTerm, items);
      const resultsCount = searchResults.length + 1;
      const { getByTestId, getByText } = createScreen();

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);

      const screenReaderMessage = getByText(
        `${resultsCount} results available.`,
      );
      expect(screenReaderMessage).to.have.attribute('role', 'alert');
    });

    it('should announce errors to screen readers when a required field is not filled', () => {
      const { getByTestId, getByText } = createScreen();

      const input = getByTestId('combobox-input');
      const submitButton = getByText('Submit');
      simulateInputChange(input, '');
      fireEvent.click(submitButton);

      const errorMessage = getByText(
        'Enter a condition, diagnosis, or short description of your symptoms',
      );
      expect(errorMessage).to.have.attribute('role', 'alert');
    });
  });

  describe('User is claiming a new condition AND claiming an increase', () => {
    it('should display alert on page if no conditions exist', () => {
      const { getByText } = createScreen(true, true, null);

      const submitButton = getByText('Submit');
      fireEvent.click(submitButton);

      const alertHeading = getByText('We need you to add a condition');
      const alertText = getByText(
        'You’ll need to add a new condition or choose a rated disability to claim. We can’t process your claim without a disability or new condition selected. Please add a new condition or choose a rated disability for increased compensation.',
      );
      const disabilityLink = getByText('Choose a rated disability');

      expect(alertHeading).to.exist;
      expect(alertText).to.exist;
      expect(disabilityLink).to.exist;
    });

    it('should display helpful error if no new conditions are added', () => {
      const { getByText } = createScreen(true, true, null);

      const submitButton = getByText('Submit');
      fireEvent.click(submitButton);

      const alertHeading = getByText('We need you to add a condition');
      const alertText = getByText(
        'You’ll need to add a new condition or choose a rated disability to claim. We can’t process your claim without a disability or new condition selected. Please add a new condition or choose a rated disability for increased compensation.',
      );
      const disabilityLink = getByText('Choose a rated disability');

      expect(alertHeading).to.exist;
      expect(alertText).to.exist;
      expect(disabilityLink).to.exist;
    });
  });

  describe('Update Form Data', () => {
    const generateInitialData = () => ({
      newDisabilities: [{ condition: 'Something with-hyphens and ALLCAPS' }],
      vaTreatmentFacilities: [
        {
          treatedDisabilityNames: {
            somethingwithhyphensandallcaps: true,
          },
        },
      ],
      'view:isPow': {
        powDisabilities: { somethingwithhyphensandallcaps: true },
      },
    });

    it("if newDisabilities in initialData doesn't exist", () => {
      const initialData = {};
      const newData = { newDisabilities: ['asthma'] };

      expect(updateFormData(initialData, newData)).to.eql(newData);
    });

    it("if newDisabilities in newData doesn't exist", () => {
      const initialData = generateInitialData();
      const newData = {};

      expect(updateFormData(initialData, newData)).to.eql(newData);
    });

    it('if no disabilities changed', () => {
      const initialData = generateInitialData();

      expect(updateFormData(initialData, initialData)).to.eql(initialData);
    });

    it('should not modify initialData', () => {
      const initialData = generateInitialData();

      updateFormData(
        initialData,
        set(
          'newDisabilities[1]',
          { condition: 'Something else' },
          generateInitialData(),
        ),
      );

      expect(initialData).to.eql(generateInitialData());
    });

    it('should change the property name in treatedDisabilityNames and powDisabilities when a disability name is changed', () => {
      const initialData = generateInitialData();

      const newData = set(
        'newDisabilities[0].condition',
        'Foo-with EXTRAz',
        generateInitialData(),
      );
      const result = updateFormData(initialData, newData);

      expect(
        result.vaTreatmentFacilities[0].treatedDisabilityNames.foowithextraz,
      ).to.be.true;
      expect(result['view:isPow'].powDisabilities.foowithextraz).to.be.true;
    });

    it('should remove a deleted disability from treatedDisabilityNames and powDisabilities', () => {
      const newData = Object.assign(generateInitialData(), {
        newDisabilities: [],
      });
      const result = updateFormData(generateInitialData(), newData);

      expect(result.vaTreatmentFacilities[0].treatedDisabilityNames).to.be
        .empty;
      expect(result['view:isPow'].powDisabilities).to.be.empty;
    });
  });
});
