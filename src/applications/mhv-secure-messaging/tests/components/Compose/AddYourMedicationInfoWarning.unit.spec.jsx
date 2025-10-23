import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import AddYourMedicationInfoWarning from '../../../components/ComposeForm/AddYourMedicationInfoWarning';

describe('AddYourMedicationInfoWarning component', () => {
  it('renders the warning banner when isVisible is true', () => {
    const { container } = render(<AddYourMedicationInfoWarning isVisible />);
    const banner = container.querySelector('va-alert');

    expect(banner).to.exist;
    const h2 = banner.querySelector('h2');
    expect(h2).to.exist;
    expect(h2.textContent).to.equal(
      'Add your medication information to this message',
    );
    expect(banner.getAttribute('status')).to.equal('warning');
    expect(banner.getAttribute('visible')).to.equal('true');
  });

  it('does not render the warning banner when isVisible is false', () => {
    const { container } = render(
      <AddYourMedicationInfoWarning isVisible={false} />,
    );
    const banner = container.querySelector('va-alert');

    expect(banner).to.exist;
    expect(banner.getAttribute('visible')).to.equal('false');
  });

  it('renders the correct text content', () => {
    const { getByText } = render(<AddYourMedicationInfoWarning isVisible />);

    expect(
      getByText(
        'To submit your renewal request, you should fill in as many of the medication details as possible. You can find this information on your prescription label or in your prescription details page.',
      ),
    ).to.exist;
  });
});
