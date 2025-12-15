import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import FileUploadDescription from '../../../../components/FormDescriptions/FileUploadDescription';
import { FILE_TYPES_ACCEPTED } from '../../../../utils/constants';

describe('10-7959a <FileUploadDescription>', () => {
  before(() => {
    if (typeof Intl === 'object' && typeof Intl.ListFormat !== 'function') {
      class ListFormatPolyfill {
        // eslint-disable-next-line no-useless-constructor, no-empty-function
        constructor(_locale, _opts) {}

        // eslint-disable-next-line class-methods-use-this
        format(arr) {
          if (!Array.isArray(arr) || arr.length === 0) return '';
          if (arr.length === 1) return arr[0];
          if (arr.length === 2) return `${arr[0]} or ${arr[1]}`;
          return `${arr.slice(0, -1).join(', ')}, or ${arr[arr.length - 1]}`;
        }
      }
      Object.defineProperty(Intl, 'ListFormat', {
        value: ListFormatPolyfill,
        configurable: true,
        writable: false,
      });
    }
  });

  const subject = () => render(<FileUploadDescription />);

  it('should render the correct disjunction text', () => {
    const { container } = subject();
    const typeList = new Intl.ListFormat('en', { type: 'disjunction' }).format(
      FILE_TYPES_ACCEPTED.map(ext => `.${ext}`),
    );
    expect(container.textContent).to.contain(typeList);
  });
});
