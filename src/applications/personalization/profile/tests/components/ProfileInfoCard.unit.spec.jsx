import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { ProfileInfoCard } from '../../components/ProfileInfoCard';

describe('ProfileInfoCard', () => {
  context('as `sections` layout', () => {
    const data = [
      { title: 'row 1', value: 'value 1', id: 'row-1' },
      { title: 'row 2', value: 'value 2', id: 'row-2' },
    ];

    it('should render the card title as an h3 by default, and render row titles as h4', async () => {
      const defaultHeadingLevel = 3;

      const tree = render(
        <ProfileInfoCard
          title="Card Title"
          fieldName="profileField"
          data={data}
          namedAnchor="card-anchor"
        />,
      );

      // first heading is the card title
      expect(
        tree.getByRole('heading', { level: defaultHeadingLevel }),
      ).to.have.text('Card Title');

      // subsequent headings are the row titles and are one level deeper than the card title
      expect(
        await tree.findAllByRole('heading', { level: defaultHeadingLevel + 1 }),
      ).to.have.length(data.length);
    });

    it('should render the card title using `level` prop, and render row titles as `level + 1`', async () => {
      const baseHeadingLevel = 2;

      const tree = render(
        <ProfileInfoCard
          title="Card Title"
          fieldName="profileField"
          data={data}
          namedAnchor="card-anchor"
          level={baseHeadingLevel}
        />,
      );

      // first heading is the card title
      expect(
        tree.getByRole('heading', { level: baseHeadingLevel }),
      ).to.have.text('Card Title');

      // subsequent headings are the row titles and are one level deeper than the card title
      expect(
        await tree.findAllByRole('heading', { level: baseHeadingLevel + 1 }),
      ).to.have.length(data.length);
    });
  });

  context('as `list` layout', () => {
    const data = [
      { title: 'row 1', value: 'value 1', id: 'row-1' },
      { title: 'row 2', value: 'value 2', id: 'row-2' },
    ];

    it('should render the card title as an h3 by default, and render row titles as dfn', async () => {
      const defaultHeadingLevel = 3;

      const tree = render(
        <ProfileInfoCard
          title="Card Title"
          fieldName="profileField"
          data={data}
          namedAnchor="card-anchor"
          asList
        />,
      );

      // first heading is the card title
      expect(
        tree.getByRole('heading', { level: defaultHeadingLevel }),
      ).to.have.text('Card Title');

      // row titles in a list are rendered as `dfn`
      expect(await tree.findAllByRole('term')).to.have.length(data.length);
    });
  });

  context('as `raw` content instead of array', () => {
    const Content = () => <div>Raw Content</div>;

    it('should render the card and show raw content as is', () => {
      const defaultHeadingLevel = 3;

      const tree = render(
        <ProfileInfoCard
          title="Card Title"
          fieldName="profileField"
          data={<Content />}
          namedAnchor="card-anchor"
        />,
      );

      // first heading is the card title
      expect(
        tree.getByRole('heading', { level: defaultHeadingLevel }),
      ).to.have.text('Card Title');

      expect(tree.getByText('Raw Content')).to.exist;
    });
  });
});
