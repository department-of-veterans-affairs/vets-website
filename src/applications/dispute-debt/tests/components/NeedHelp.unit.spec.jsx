import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import NeedHelp from '../../components/NeedHelp';

describe('NeedHelp Component', () => {
  it('renders without crashing', () => {
    expect(NeedHelp).to.be.a('function');
  });

  it('renders help content in footer', () => {
    const { container } = render(<NeedHelp />);

    const footer = container.querySelector('footer[slot="content"]');
    expect(footer).to.exist;
  });

  it('renders MyVA411 information line', () => {
    const { container } = render(<NeedHelp />);

    expect(container.textContent).to.include('MyVA411 main information line');
    const phoneElement = container.querySelector(
      'va-telephone[contact="8006982411"]',
    );
    expect(phoneElement).to.exist;
  });

  it('renders TTY number for MyVA411', () => {
    const { container } = render(<NeedHelp />);

    const ttyElement = container.querySelector(
      'va-telephone[contact="711"][tty="true"]',
    );
    expect(ttyElement).to.exist;
  });

  it('renders link to get help filling out form', () => {
    const { container } = render(<NeedHelp />);

    expect(container.textContent).to.include(
      'contact an accredited representative or VSO',
    );
    const helpLink = container.querySelector(
      'a[href="/disability/get-help-filing-claim/"]',
    );
    expect(helpLink).to.exist;
    expect(helpLink.textContent).to.include('Get help filling out your form');
  });

  it('renders benefit overpayments contact information', () => {
    const { container } = render(<NeedHelp />);

    expect(container.textContent).to.include(
      'questions about your benefit overpayments',
    );
    expect(container.textContent).to.include(
      'Monday through Friday, 7:30 a.m. to 7:00 p.m. ET',
    );

    const phoneElements = container.querySelectorAll('va-telephone');
    expect(phoneElements.length).to.be.at.least(3);
  });

  it('renders copay bills contact information', () => {
    const { container } = render(<NeedHelp />);

    expect(container.textContent).to.include(
      'questions about your copay bills',
    );
    expect(container.textContent).to.include(
      'Monday through Friday, 8:00 a.m. to 8:00 p.m. ET',
    );

    const phoneElements = container.querySelectorAll('va-telephone');
    expect(phoneElements.length).to.be.at.least(4);
  });

  it('renders all four help paragraphs', () => {
    const { container } = render(<NeedHelp />);

    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).to.have.length(4);
  });

  it('contains multiple phone contact options', () => {
    const { container } = render(<NeedHelp />);

    const phoneElements = container.querySelectorAll('va-telephone');
    expect(phoneElements.length).to.be.at.least(5); // MyVA411, TTY, DMC, DMC_OVERSEAS, Copay
  });

  it('provides comprehensive help information', () => {
    const { container } = render(<NeedHelp />);

    // Check for key help topics
    expect(container.textContent).to.include('trouble using this online form');
    expect(container.textContent).to.include('gather your information');
    expect(container.textContent).to.include('benefit overpayments');
    expect(container.textContent).to.include('copay bills');
  });
});
