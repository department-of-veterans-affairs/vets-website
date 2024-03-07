import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { mount } from 'enzyme';

import MegaMenu from '../mega-menu/components/MegaMenu.jsx';

const data = [
  {
    title: 'Nav Title 1',
    menuSections: [
      {
        title: 'Section Title 1',
        links: {
          columnOne: {
            title: 'Menu Item 1',
            links: [
              {
                text: 'First link',
                href: '#',
              },
            ],
          },
          columnTwo: {
            title: 'Column 2 title',
            links: [
              {
                text: 'First link',
                href: '#',
              },
            ],
          },
          columnThree: {
            img: {
              src: 'http://via.placeholder.com/228x128',
              alt: 'Place Holder Image',
            },
            link: {
              text: 'Text for link',
              href: '#',
            },
            description: 'Add a description of the marketing content',
          },
          seeAllLink: {
            text: 'Link to menu page',
            href: '#',
          },
        },
      },
      {
        title: 'Section Title 2',
        links: {
          columnOne: {
            title: 'Menu Item 1',
            links: [
              {
                text: 'First link',
                href: '#',
              },
            ],
          },
          columnTwo: {
            title: 'Column 2 title',
            links: [
              {
                text: 'First link',
                href: '#',
              },
            ],
          },
          columnThree: {
            img: {
              src: 'http://via.placeholder.com/228x128',
              alt: 'Place Holder Image',
            },
            link: {
              text: 'Text for Marketing Link',
              href: '#',
            },
            description: 'Add a description of the marketing content',
          },
          seeAllLink: {
            text: 'Link to menu page',
            href: '#',
          },
        },
      },
    ],
  },
  {
    title: 'Nav Title 2',
    menuSections: {
      mainColumn: {
        title: 'Main Dropdown Section Title',
        links: [
          {
            text: 'First Link',
            href: '#',
          },
        ],
      },
      columnOne: {
        title: 'Column 1 Title',
        links: [
          {
            text: 'Link 1',
            href: '#',
          },
        ],
      },
      columnTwo: {
        title: 'Column 2 Title',
        links: [
          {
            text: 'Link 1',
            href: '#',
          },
        ],
      },
      columnThree: {
        img: {
          src: 'http://via.placeholder.com/228x128',
          alt: 'Place Holder Image',
        },
        link: {
          text: 'Text for Marketing Link',
          href: '#',
        },
        description: 'Add a description of the marketing content',
      },
    },
  },
  {
    title: 'Nav Title 3 link only',
    href: '#',
  },
];

let div;
let megaMenu;

describe('<MegaMenu>', () => {
  beforeEach(() => {
    div = document.createElement('div');
    div.setAttribute('class', 'mega-menu');
    document.body.appendChild(div);

    megaMenu = mount(
      <MegaMenu
        data={data}
        toggleDropDown={title => {
          title;
        }}
        toggleDisplayHidden={hidden => {
          hidden;
        }}
        updateCurrentSection={title => {
          title;
        }}
      />,
      {
        attachTo: div,
      },
    );
  });

  afterEach(() => {
    document.body.removeChild(div);
  });

  it('should render', () => {
    const menuTexts = [
      'Home',
      'Nav Title 1',
      'Nav Title 2',
      'Nav Title 3 link only',
    ];

    expect(megaMenu.find('.login-container').exists()).to.be.true;

    megaMenu.find('.vetnav-level1').forEach(el => {
      expect(menuTexts.includes(el.text())).to.be.true;
    });
  });

  it('should run toggleDropDown if clicked on', () => {
    const spy = sinon.spy(megaMenu.instance(), 'toggleDropDown');
    megaMenu
      .find('button')
      .first()
      .simulate('click');

    expect(spy.calledOnce).to.be.true;
    expect(spy.getCall(0).args[0]).to.equal('Nav Title 1');
  });

  it('should not show dropdown on initial load', () => {
    expect(megaMenu.find('.vetnav-level2').exists()).to.be.false;
  });

  it('should show dropdown if state.currentDropdown is = menu title', () => {
    megaMenu.setProps({
      ...megaMenu.props(),
      currentDropdown: 'Nav Title 1',
    });

    expect(
      megaMenu
        .find('.vetnav-level2')
        .first()
        .text(),
    ).to.equal('Section Title 1');
  });

  it('should run updateCurrentSection if menu section is clicked on', () => {
    const spy = sinon.spy(megaMenu.instance(), 'updateCurrentSection');

    megaMenu.setProps({
      currentDropdown: 'Nav Title 1',
    });

    megaMenu
      .find('.vetnav-level2')
      .at(1)
      .simulate('click');

    expect(spy.calledOnce).to.be.true;
    expect(spy.getCall(0).args[0]).to.equal('Section Title 2');
  });

  it('should show Nav Title 1 section if state.currentSection is = Section Title 2', () => {
    megaMenu.setProps({
      ...megaMenu.props(),
      currentDropdown: 'Nav Title 1',
      currentSection: 'Section Title 2',
    });

    expect(
      megaMenu
        .find('h3')
        .at(0)
        .text(),
    ).to.equal('Menu Item 1');
  });

  // this will be skipped until axeCheck can be rewritten TODO: @asg5704
  it.skip('should pass axe check when open', () => {
    megaMenu.unmount();

    return axeCheck(
      <MegaMenu
        data={data}
        toggleDropDown={title => {
          title;
        }}
        toggleDisplayHidden={hidden => {
          hidden;
        }}
        updateCurrentSection={title => {
          title;
        }}
      />,
    );
  });
});
