import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import CCDDescription from '../../../components/DownloadRecords/CCDDescription';

describe('CCDDescription', () => {
  it('renders the main CCD description', () => {
    const { getByText } = render(<CCDDescription />);

    expect(
      getByText(
        /This Continuity of Care Document \(CCD\) is a summary of your VA medical records/,
      ),
    ).to.exist;
  });

  it('renders XML format text when showXmlFormatText is true (default)', () => {
    const { getByText } = render(<CCDDescription />);

    expect(
      getByText(
        /You can download this report in \.xml format, a standard file format/,
      ),
    ).to.exist;
  });

  it('renders XML format text when showXmlFormatText is explicitly true', () => {
    const { getByText } = render(<CCDDescription showXmlFormatText />);

    expect(
      getByText(
        /You can download this report in \.xml format, a standard file format/,
      ),
    ).to.exist;
  });

  it('does not render XML format text when showXmlFormatText is false', () => {
    const { queryByText, getByText } = render(
      <CCDDescription showXmlFormatText={false} />,
    );

    // Main description should still exist
    expect(
      getByText(
        /This Continuity of Care Document \(CCD\) is a summary of your VA medical records/,
      ),
    ).to.exist;

    // XML format text should not exist
    expect(
      queryByText(
        /You can download this report in \.xml format, a standard file format/,
      ),
    ).to.not.exist;
  });

  it('includes VA Health Summary reference in description', () => {
    const { getByText } = render(<CCDDescription />);

    expect(getByText(/We used to call this report your VA Health Summary/)).to
      .exist;
  });
});
