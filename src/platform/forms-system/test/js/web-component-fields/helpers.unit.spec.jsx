import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import {
  schemaToEnumOptions,
  renderOptions,
} from '../../../src/js/web-component-fields/helpers';

describe('web-component-fields helpers', () => {
  describe('schemaToEnumOptions', () => {
    it('should convert schema.enum to option objects with string values as labels', () => {
      const schema = {
        enum: ['cat', 'dog', 'bird'],
      };
      const result = schemaToEnumOptions(schema);
      expect(result).to.deep.equal([
        { label: 'cat', value: 'cat' },
        { label: 'dog', value: 'dog' },
        { label: 'bird', value: 'bird' },
      ]);
    });

    it('should use schema.enumNames for labels when provided', () => {
      const schema = {
        enum: ['cat', 'dog', 'bird'],
        enumNames: ['Cat', 'Dog', 'Bird'],
      };
      const result = schemaToEnumOptions(schema);
      expect(result).to.deep.equal([
        { label: 'Cat', value: 'cat' },
        { label: 'Dog', value: 'dog' },
        { label: 'Bird', value: 'bird' },
      ]);
    });

    it('should handle numeric enum values', () => {
      const schema = {
        enum: [1, 2, 3],
      };
      const result = schemaToEnumOptions(schema);
      expect(result).to.deep.equal([
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
      ]);
    });

    it('should handle partial enumNames', () => {
      const schema = {
        enum: ['cat', 'dog', 'bird'],
        enumNames: ['Cat', 'Dog'],
      };
      const result = schemaToEnumOptions(schema);
      expect(result).to.deep.equal([
        { label: 'Cat', value: 'cat' },
        { label: 'Dog', value: 'dog' },
        { label: 'bird', value: 'bird' },
      ]);
    });
  });

  describe('renderOptions', () => {
    it('should render flat options with no labels config', () => {
      const schema = {
        enum: ['cat', 'dog', 'bird'],
      };
      const { container } = render(<select>{renderOptions(schema)}</select>);
      const options = container.querySelectorAll('option');

      expect(options).to.have.lengthOf(3);
      expect(options[0].value).to.equal('cat');
      expect(options[0].textContent).to.equal('cat');
      expect(options[1].value).to.equal('dog');
      expect(options[1].textContent).to.equal('dog');
      expect(options[2].value).to.equal('bird');
      expect(options[2].textContent).to.equal('bird');
    });

    it('should render options with string labels', () => {
      const schema = {
        enum: ['cat', 'dog', 'bird'],
      };
      const labels = {
        cat: 'Feline',
        dog: 'Canine',
        bird: 'Avian',
      };
      const { container } = render(
        <select>{renderOptions(schema, labels)}</select>,
      );
      const options = container.querySelectorAll('option');

      expect(options).to.have.lengthOf(3);
      expect(options[0].value).to.equal('cat');
      expect(options[0].textContent).to.equal('Feline');
      expect(options[1].value).to.equal('dog');
      expect(options[1].textContent).to.equal('Canine');
      expect(options[2].value).to.equal('bird');
      expect(options[2].textContent).to.equal('Avian');
    });

    it('should fall back to enumNames when label is not provided', () => {
      const schema = {
        enum: ['cat', 'dog', 'bird'],
        enumNames: ['Cat', 'Dog', 'Bird'],
      };
      const labels = {
        cat: 'Feline',
        // dog label not provided
      };
      const { container } = render(
        <select>{renderOptions(schema, labels)}</select>,
      );
      const options = container.querySelectorAll('option');

      expect(options).to.have.lengthOf(3);
      expect(options[0].textContent).to.equal('Feline');
      expect(options[1].textContent).to.equal('Dog'); // from enumNames
      expect(options[2].textContent).to.equal('Bird'); // from enumNames
    });

    it('should fall back to option.label for empty string labels', () => {
      const schema = {
        enum: ['cat', 'dog'],
        enumNames: ['Cat', 'Dog'],
      };
      const labels = {
        cat: '', // empty string should fall back
      };
      const { container } = render(
        <select>{renderOptions(schema, labels)}</select>,
      );
      const options = container.querySelectorAll('option');

      expect(options[0].textContent).to.equal('Cat'); // fallback to enumNames
      expect(options[1].textContent).to.equal('Dog');
    });

    it('should handle object labels with label property', () => {
      const schema = {
        enum: ['cat', 'dog'],
      };
      const labels = {
        cat: { label: 'Feline' },
        dog: { label: 'Canine' },
      };
      const { container } = render(
        <select>{renderOptions(schema, labels)}</select>,
      );
      const options = container.querySelectorAll('option');

      expect(options[0].textContent).to.equal('Feline');
      expect(options[1].textContent).to.equal('Canine');
    });

    it('should render grouped options when groups are defined', () => {
      const schema = {
        enum: ['cat', 'dog', 'parrot', 'eagle'],
      };
      const labels = {
        cat: { label: 'Cat', group: 'Mammals' },
        dog: { label: 'Dog', group: 'Mammals' },
        parrot: { label: 'Parrot', group: 'Birds' },
        eagle: { label: 'Eagle', group: 'Birds' },
      };
      const { container } = render(
        <select>{renderOptions(schema, labels)}</select>,
      );
      const optgroups = container.querySelectorAll('optgroup');

      expect(optgroups).to.have.lengthOf(2);

      const mammalsGroup = Array.from(optgroups).find(
        g => g.label === 'Mammals',
      );
      const birdsGroup = Array.from(optgroups).find(g => g.label === 'Birds');

      expect(mammalsGroup).to.exist;
      expect(birdsGroup).to.exist;

      const mammalsOptions = mammalsGroup.querySelectorAll('option');
      expect(mammalsOptions).to.have.lengthOf(2);
      expect(mammalsOptions[0].textContent).to.equal('Cat');
      expect(mammalsOptions[1].textContent).to.equal('Dog');

      const birdsOptions = birdsGroup.querySelectorAll('option');
      expect(birdsOptions).to.have.lengthOf(2);
      expect(birdsOptions[0].textContent).to.equal('Parrot');
      expect(birdsOptions[1].textContent).to.equal('Eagle');
    });

    it('should group ungrouped items into "Other" group', () => {
      const schema = {
        enum: ['cat', 'dog', 'fish'],
      };
      const labels = {
        cat: { label: 'Cat', group: 'Mammals' },
        dog: { label: 'Dog', group: 'Mammals' },
        fish: 'Fish', // no group specified
      };
      const { container } = render(
        <select>{renderOptions(schema, labels)}</select>,
      );
      const optgroups = container.querySelectorAll('optgroup');

      expect(optgroups).to.have.lengthOf(2);

      const otherGroup = Array.from(optgroups).find(g => g.label === 'Other');
      expect(otherGroup).to.exist;

      const otherOptions = otherGroup.querySelectorAll('option');
      expect(otherOptions).to.have.lengthOf(1);
      expect(otherOptions[0].textContent).to.equal('Fish');
    });

    it('should handle mixed label formats with groups', () => {
      const schema = {
        enum: ['cat', 'dog', 'parrot'],
      };
      const labels = {
        cat: { label: 'Cat', group: 'Mammals' },
        dog: 'Dog', // string without group
        parrot: { group: 'Birds' }, // group without custom label
      };
      const { container } = render(
        <select>{renderOptions(schema, labels)}</select>,
      );
      const optgroups = container.querySelectorAll('optgroup');

      expect(optgroups).to.have.lengthOf(3);

      const birdsGroup = Array.from(optgroups).find(g => g.label === 'Birds');
      const birdsOptions = birdsGroup.querySelectorAll('option');
      expect(birdsOptions[0].textContent).to.equal('parrot'); // uses enum value
    });

    it('should handle null schema gracefully', () => {
      const { container } = render(<select>{renderOptions(null)}</select>);
      const options = container.querySelectorAll('option');
      expect(options).to.have.lengthOf(0);
    });

    it('should handle schema without enum gracefully', () => {
      const schema = { type: 'string' };
      const { container } = render(<select>{renderOptions(schema)}</select>);
      const options = container.querySelectorAll('option');
      expect(options).to.have.lengthOf(0);
    });

    it('should handle empty enum array', () => {
      const schema = { enum: [] };
      const { container } = render(<select>{renderOptions(schema)}</select>);
      const options = container.querySelectorAll('option');
      expect(options).to.have.lengthOf(0);
    });
  });
});
