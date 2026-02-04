import React from 'react';
import { expect } from 'chai';
import FilesOptional from '../../../components/claim-files-tab/FilesOptional';
import { renderWithRouter } from '../../utils';

const item = {
  displayName: 'Request 1',
  description: 'This is a alert',
  requestedDate: '2025-04-21',
};

const itemWithOverrideDescription = {
  displayName: 'Request 2',
  friendlyName: 'Friendly Request',
  description: 'This is a alert',
  requestedDate: '2025-04-21',
  shortDescription: 'Short description',
};

const DBQItemWithOverride = {
  displayName: 'DBQ AUDIO Hearing Loss and Tinnitus',
  friendlyName: 'Friendly DBQ',
  description: 'This is a description for a DBQ item',
  requestedDate: '2025-04-25',
  shortDescription: 'Short description',
};
const DBQItemNoOverride = {
  displayName: 'DBQ no override',
  description: 'This is a description for a DBQ no override item',
  requestedDate: '2025-05-25',
};

describe('<FilesOptional>', () => {
  it('should render non DBQ items updated UI', () => {
    const { getByText, queryByText } = renderWithRouter(
      <FilesOptional item={item} />,
    );

    getByText('Request for evidence outside VA');
    getByText('We made a request outside VA on April 21, 2025');
    expect(queryByText(item.description)).to.be.null;
    getByText(/you don’t need to do anything/i);
    getByText(
      'We asked someone outside VA for documents related to your claim.',
    );
    getByText('About this notice');
  });

  it(`should render you don't need to do anything and short description and non DBQ track item has override description content`, () => {
    const { getByText, queryByText } = renderWithRouter(
      <FilesOptional item={itemWithOverrideDescription} />,
    );

    getByText(itemWithOverrideDescription.friendlyName);
    getByText('We made a request outside VA on April 21, 2025');
    expect(queryByText(/you don’t need to do anything/i)).to.exist;
    getByText(itemWithOverrideDescription.shortDescription);
    expect(
      queryByText(
        'We asked someone outside VA for documents related to your claim.',
      ),
    ).to.be.null;
    getByText('About this notice');
  });
  it(`should render We made a request for an exam and track item is a DBQ wtih override`, () => {
    const { getByText } = renderWithRouter(
      <FilesOptional item={DBQItemWithOverride} />,
    );

    getByText(`We made a request for an exam on April 25, 2025`);
    getByText('Short description');
  });
  it(`should render We made a request for an exam and track item is a DBQ with no override content`, () => {
    const { getByText } = renderWithRouter(
      <FilesOptional item={DBQItemNoOverride} />,
    );

    getByText(`We made a request for an exam on May 25, 2025`);
    getByText(
      `We’ve requested an exam related to your claim. The examiner’s office will contact you to schedule this appointment.`,
    );
  });

  context('isDBQ boolean property fallback pattern', () => {
    it('should use API value when provided (true)', () => {
      const itemWithApiIsDBQ = {
        displayName: 'Non-DBQ Request',
        requestedDate: '2025-04-21',
        isDBQ: true, // API value is true, displayName doesn't include 'dbq'
      };
      const { getByText } = renderWithRouter(
        <FilesOptional item={itemWithApiIsDBQ} />,
      );

      // Should show exam text because API value is true
      getByText('Request for an exam');
      getByText('We made a request for an exam on April 21, 2025');
    });

    it('should fall back to displayName check when API value is false', () => {
      const itemWithApiIsDBQFalse = {
        displayName: 'DBQ AUDIO Hearing Loss',
        requestedDate: '2025-04-21',
        isDBQ: false, // API value is false, but displayName contains 'dbq'
      };
      const { getByText } = renderWithRouter(
        <FilesOptional item={itemWithApiIsDBQFalse} />,
      );

      // Should show exam text because displayName contains 'dbq'
      getByText('Request for an exam');
      getByText('We made a request for an exam on April 21, 2025');
    });

    it('should fallback to evidenceDictionary when API value not provided', () => {
      const itemWithDictIsDBQ = {
        displayName: 'DBQ AUDIO Hearing Loss and Tinnitus', // In dictionary with isDBQ: true
        requestedDate: '2025-04-21',
        // No isDBQ property from API
      };
      const { getByText } = renderWithRouter(
        <FilesOptional item={itemWithDictIsDBQ} />,
      );

      // Should use dictionary value (true)
      getByText('Request for an exam');
      getByText('We made a request for an exam on April 21, 2025');
    });

    it('should fallback to displayName check when neither API nor dictionary has value', () => {
      const itemWithDbqInName = {
        displayName: 'Some DBQ Related Request', // Contains 'dbq' but not in dictionary
        requestedDate: '2025-04-21',
        // No isDBQ property from API or dictionary
      };
      const { getByText } = renderWithRouter(
        <FilesOptional item={itemWithDbqInName} />,
      );

      // Should detect 'dbq' in displayName
      getByText('Request for an exam');
      getByText('We made a request for an exam on April 21, 2025');
    });

    it('should default to false when all fallbacks fail', () => {
      const itemWithNoDBQ = {
        displayName: 'Medical Records Request', // Not in dictionary, no 'dbq'
        requestedDate: '2025-04-21',
        // No isDBQ property from API
      };
      const { getByText } = renderWithRouter(
        <FilesOptional item={itemWithNoDBQ} />,
      );

      // Should default to false (outside VA request)
      getByText('Request for evidence outside VA');
      getByText('We made a request outside VA on April 21, 2025');
    });

    it('should fall back to displayName check when API value is false and displayName contains dbq', () => {
      const itemWithConflict = {
        displayName: 'DBQ Test Item',
        requestedDate: '2025-04-21',
        isDBQ: false, // API says false, but displayName contains 'dbq'
      };
      const { getByText } = renderWithRouter(
        <FilesOptional item={itemWithConflict} />,
      );

      // displayName check should be used as fallback
      getByText('Request for an exam');
      getByText('We made a request for an exam on April 21, 2025');
    });

    it('should use dictionary value when displayName has dbq but is in dictionary', () => {
      const itemInDictionary = {
        displayName: 'DBQ PSYCH Mental Disorders', // In dictionary with isDBQ: true
        requestedDate: '2025-04-21',
      };
      const { getByText } = renderWithRouter(
        <FilesOptional item={itemInDictionary} />,
      );

      // Should use dictionary value
      getByText('Request for an exam');
      getByText('We made a request for an exam on April 21, 2025');
    });
  });
});
