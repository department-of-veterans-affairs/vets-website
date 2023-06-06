import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ConditionalProcessList as List } from '@@profile/components/account-security/ConditionalProcessList';
import { $ } from '~/platform/forms-system/src/js/utilities/ui';

describe('ConditionalProcessList', () => {
  it('renders an ordered list its children', () => {
    const view = render(
      <List>
        <li>Process 1</li>
        <li>Process 2</li>
      </List>,
    );

    expect(view.container.querySelector('ol')).to.exist;
    expect(view.queryByText('Process 1')).to.exist;
    expect(view.queryByText('Process 2')).to.exist;
  });

  it('renders a list item with the `item-complete` class, heading, and content when completed', () => {
    const view = render(
      <List>
        <List.Item complete>
          <List.HeadingComplete>
            <span data-testid="headingComplete">
              Process 1 Heading Complete
            </span>
          </List.HeadingComplete>
          <List.ContentComplete>
            <span data-testid="contentComplete">
              Process 1 Content Complete
            </span>
          </List.ContentComplete>
          <List.HeadingIncomplete>
            Process 1 Heading Incomplete
          </List.HeadingIncomplete>
          <List.ContentIncomplete>
            Process 1 Content Incomplete
          </List.ContentIncomplete>
        </List.Item>
      </List>,
    );

    expect($('.item-complete', view.container)).to.exist;
    expect(view.queryByText('Process 1 Heading Complete')).to.exist;
    expect(view.queryByText('Process 1 Content Complete')).to.exist;
    expect(view.queryByText('Process 1 Heading Incomplete')).to.not.exist;
    expect(view.queryByText('Process 1 Content Incomplete')).to.not.exist;
  });

  it('renders a list item without the `item-complete` class, heading, and content when incomplete', () => {
    const view = render(
      <List>
        <List.Item>
          <List.HeadingComplete>
            Process 1 Heading Complete
          </List.HeadingComplete>

          <List.ContentComplete>
            Process 1 Content Complete
          </List.ContentComplete>

          <List.HeadingIncomplete>
            Process 1 Heading Incomplete
          </List.HeadingIncomplete>

          <List.ContentIncomplete>
            Process 1 Content Incomplete
          </List.ContentIncomplete>
        </List.Item>
      </List>,
    );

    expect($('.item-complete', view.container)).to.not.exist;
    expect(view.queryByText('Process 1 Heading Complete')).to.not.exist;
    expect(view.queryByText('Process 1 Content Complete')).to.not.exist;
    expect(view.queryByText('Process 1 Heading Incomplete')).to.exist;
    expect(view.queryByText('Process 1 Content Incomplete')).to.exist;
  });

  it('should NOT render a list item even when `completed` if shouldShow is false', () => {
    const view = render(
      <List>
        <List.Item complete shouldShow={false}>
          <List.HeadingComplete>
            Process 1 Heading Complete
          </List.HeadingComplete>

          <List.ContentComplete>
            Process 1 Content Complete
          </List.ContentComplete>

          <List.HeadingIncomplete>
            Process 1 Heading Incomplete
          </List.HeadingIncomplete>

          <List.ContentIncomplete>
            Process 1 Content Incomplete
          </List.ContentIncomplete>
        </List.Item>
      </List>,
    );

    expect($('.item-complete', view.container)).to.not.exist;
    expect(view.queryByText('Process 1 Heading Complete')).to.not.exist;
    expect(view.queryByText('Process 1 Content Complete')).to.not.exist;
    expect(view.queryByText('Process 1 Heading Incomplete')).to.not.exist;
    expect(view.queryByText('Process 1 Content Incomplete')).to.not.exist;
  });

  it('should use a dynamic heading level passed into props for a list item that is complete', () => {
    const view = render(
      <List>
        <List.Item complete>
          <List.HeadingComplete headingLevel={1}>
            Process 1 Heading Complete
          </List.HeadingComplete>

          <List.ContentComplete>
            Process 1 Content Complete
          </List.ContentComplete>

          <List.HeadingIncomplete>
            Process 1 Heading Incomplete
          </List.HeadingIncomplete>

          <List.ContentIncomplete>
            Process 1 Content Incomplete
          </List.ContentIncomplete>
        </List.Item>
      </List>,
    );

    expect($('.item-complete h1.item-heading', view.container)).to.exist;
    expect($('.item-incomplete h1.item-heading', view.container)).to.not.exist;
    expect($('h3', view.container)).to.not.exist;
  });

  it('should use a dynamic heading level passed into props for a list item that is incomplete', () => {
    const view = render(
      <List>
        <List.Item>
          <List.HeadingComplete headingLevel={1}>
            Process 1 Heading Complete
          </List.HeadingComplete>

          <List.ContentComplete>
            Process 1 Content Complete
          </List.ContentComplete>

          <List.HeadingIncomplete headingLevel={1}>
            Process 1 Heading Incomplete
          </List.HeadingIncomplete>

          <List.ContentIncomplete>
            Process 1 Content Incomplete
          </List.ContentIncomplete>
        </List.Item>
      </List>,
    );

    expect($('.item-complete h1.item-heading', view.container)).to.not.exist;
    expect($('.item-incomplete h1.item-heading', view.container)).to.exist;
    expect($('h3', view.container)).to.not.exist;
  });
});
