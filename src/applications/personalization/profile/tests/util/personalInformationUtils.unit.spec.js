import { expect } from 'chai';

import {
  formatMultiSelectAndText,
  createNotListedTextKey,
  renderGender,
  createBooleanSchemaPropertiesFromOptions,
  createUiTitlePropertiesFromOptions,
} from '@@profile/util/personal-information/personalInformationUtils';

import { NOT_SET_TEXT } from '@@profile/constants';

describe('formatMultiSelectAndText utility', () => {
  it('returns single pronouns', () => {
    expect(
      formatMultiSelectAndText({ pronouns: ['heHimHis'] }, 'pronouns'),
    ).to.equal('He/him/his');
  });

  it('returns comma separated pronouns', () => {
    expect(
      formatMultiSelectAndText(
        { pronouns: ['heHimHis', 'theyThemTheirs'] },
        'pronouns',
      ),
    ).to.equal('He/him/his, They/them/theirs');
  });

  it('returns pronounsNotListedText value', () => {
    expect(
      formatMultiSelectAndText(
        { pronounsNotListedText: 'custom pronouns' },
        'pronouns',
      ),
    ).to.equal('custom pronouns');
  });

  it('returns comma separated list including pronounsNotListedText', () => {
    expect(
      formatMultiSelectAndText(
        { pronouns: ['heHimHis'], pronounsNotListedText: 'custom pronouns' },
        'pronouns',
      ),
    ).to.equal('He/him/his, custom pronouns');
  });

  it('returns null if fields do not have values', () => {
    expect(
      formatMultiSelectAndText(
        { pronouns: [], pronounsNotListedText: '' },
        'pronouns',
      ),
    ).to.be.null;
  });
});

describe('createNotListedTextKey utility', () => {
  it('returns the properly formatted text string', () => {
    expect(createNotListedTextKey('pronouns')).to.equal(
      'pronounsNotListedText',
    );
  });
});

describe('renderGender utility', () => {
  it('returns Male', () => {
    expect(renderGender('M')).to.equal('Male');
  });

  it('returns Female', () => {
    expect(renderGender('F')).to.equal('Female');
  });

  it('returns NOT_SET_TEXT', () => {
    expect(renderGender('')).to.equal(NOT_SET_TEXT);
  });
});

describe('createBooleanSchemaPropertiesFromOptions utility', () => {
  it('returns properly formatted object with boolean type properties', () => {
    const input = {
      one: 'test1',
      two: 'test2',
      three: 'test3',
    };

    const output = {
      one: { type: 'boolean' },
      two: { type: 'boolean' },
      three: { type: 'boolean' },
    };

    expect(createBooleanSchemaPropertiesFromOptions(input)).to.deep.equal(
      output,
    );
  });
});

describe('createUiTitlePropertiesFromOptions utility', () => {
  it('returns properly formatted object with ui:title properties', () => {
    const input = {
      one: 'test1',
      two: 'test2',
      three: 'test3',
    };

    const output = {
      one: { 'ui:title': 'test1' },
      two: { 'ui:title': 'test2' },
      three: { 'ui:title': 'test3' },
    };

    expect(createUiTitlePropertiesFromOptions(input)).to.deep.equal(output);
  });
});
