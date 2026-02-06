import React from 'react';
import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { EvidenceRequestPage } from '../../components/EvidenceRequestPage';

describe('EvidenceRequestPage', () => {
  const page = ({
    data = {},
    goBack = () => {},
    goForward = () => {},
    setFormData = () => {},
    updatePage = () => {},
    onReviewPage = false,
  } = {}) => {
    return (
      <div>
        <EvidenceRequestPage
          setFormData={setFormData}
          data={data}
          goBack={goBack}
          goForward={goForward}
          onReviewPage={onReviewPage}
          updatePage={updatePage}
        />
      </div>
    );
  };

  it('should render', () => {
    const { container } = render(page());

    expect($$('va-radio-option').length).to.equal(2);

    const question = container.querySelector('va-radio');
    expect(question).to.have.attribute(
      'label',
      'Are there medical records related to your claim that you’d like us to access on your behalf from VA or private medical centers?',
    );
    expect(question).to.have.attribute(
      'hint',
      'If you select “Yes,” we’ll request these records from VA or private medical centers. Or you can upload copies of your private medical records.',
    );
    expect(container.querySelector('va-radio-option[label="Yes"]')).to.exist;
    expect(container.querySelector('va-radio-option[label="No"]')).to.exist;
  });
});
