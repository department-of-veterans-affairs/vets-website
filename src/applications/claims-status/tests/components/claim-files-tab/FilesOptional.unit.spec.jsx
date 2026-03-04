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

  context('isDBQ property', () => {
    it('should use API value when provided (true)', () => {
      const itemWithApiIsDBQ = {
        displayName: 'Non-DBQ Request',
        requestedDate: '2025-04-21',
        isDBQ: true,
      };
      const { getByText } = renderWithRouter(
        <FilesOptional item={itemWithApiIsDBQ} />,
      );

      // Should show exam text because API value is true
      getByText('Request for an exam');
      getByText('We made a request for an exam on April 21, 2025');
    });

    it('should use displayName when isDBQ is false but displayName contains dbq', () => {
      const itemWithApiIsDBQFalse = {
        displayName: 'DBQ AUDIO Hearing Loss',
        requestedDate: '2025-04-21',
        isDBQ: false,
      };
      const { getByText } = renderWithRouter(
        <FilesOptional item={itemWithApiIsDBQFalse} />,
      );

      // Should show exam text because displayName contains 'dbq'
      getByText('Request for an exam');
      getByText('We made a request for an exam on April 21, 2025');
    });

    it('should use displayName check when isDBQ not provided', () => {
      const itemWithoutIsDBQ = {
        displayName: 'DBQ AUDIO Hearing Loss and Tinnitus',
        requestedDate: '2025-04-21',
      };
      const { getByText } = renderWithRouter(
        <FilesOptional item={itemWithoutIsDBQ} />,
      );

      getByText('Request for an exam');
      getByText('We made a request for an exam on April 21, 2025');
    });

    it('should use displayName check when isDBQ not provided (displayName contains dbq)', () => {
      const itemWithDbqInName = {
        displayName: 'Some DBQ Related Request',
        requestedDate: '2025-04-21',
      };
      const { getByText } = renderWithRouter(
        <FilesOptional item={itemWithDbqInName} />,
      );

      // Should detect 'dbq' in displayName
      getByText('Request for an exam');
      getByText('We made a request for an exam on April 21, 2025');
    });

    it('should default to false when isDBQ not provided and displayName has no dbq', () => {
      const itemWithNoDBQ = {
        displayName: 'Medical Records Request',
        requestedDate: '2025-04-21',
      };
      const { getByText } = renderWithRouter(
        <FilesOptional item={itemWithNoDBQ} />,
      );

      // Should default to false (outside VA request)
      getByText('Request for evidence outside VA');
      getByText('We made a request outside VA on April 21, 2025');
    });

    it('should return false when isDBQ is false and displayName does not contain dbq', () => {
      const itemWithApiFalseNoDbqName = {
        displayName: 'Medical Records Request',
        requestedDate: '2025-04-21',
        isDBQ: false,
      };
      const { getByText } = renderWithRouter(
        <FilesOptional item={itemWithApiFalseNoDbqName} />,
      );

      // Should show non-DBQ content (outside VA request)
      getByText('Request for evidence outside VA');
      getByText('We made a request outside VA on April 21, 2025');
    });

    it('should treat as DBQ when isDBQ not provided but displayName contains dbq', () => {
      const itemWithDbqInDisplayName = {
        displayName: 'DBQ PSYCH Mental Disorders',
        requestedDate: '2025-04-21',
      };
      const { getByText } = renderWithRouter(
        <FilesOptional item={itemWithDbqInDisplayName} />,
      );

      getByText('Request for an exam');
      getByText('We made a request for an exam on April 21, 2025');
    });
  });
});
