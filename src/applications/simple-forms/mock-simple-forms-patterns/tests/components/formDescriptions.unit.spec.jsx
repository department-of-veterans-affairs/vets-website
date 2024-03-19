import { render } from '@testing-library/react';
import { expect } from 'chai';
import { CompensationTypeDescription } from '../../components/formDescriptions';

describe('CompensationTypeDescription', () => {
  it('should render', () => {
    const { container } = render(CompensationTypeDescription);
    const selector = container.querySelector('va-additional-info');
    expect(selector).to.exist;
  });
});
