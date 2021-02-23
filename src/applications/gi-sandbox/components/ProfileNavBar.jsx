import React from 'react';
import { connect } from 'react-redux';
import { scroller } from 'react-scroll';

import { createId } from '../utils/helpers';
import classNames from 'classnames';
import { getScrollOptions } from 'platform/utilities/ui';
import { NAV_WIDTH } from '../constants';

const ABOVE_TOP_SECTION = 'ABOVE_TOP_SECTION';
const BELOW_LAST_SECTION = 'BELOW_LAST_SECTION';

export class ProfileNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSection: ABOVE_TOP_SECTION,
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, true);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, true);
  }

  onDesktop = () => window.innerWidth >= NAV_WIDTH;
  atTop = () => this.currentSectionIndex() === 0;
  atBottom = () =>
    this.currentSectionIndex() === this.props.profileSections.length - 1;
  placeholderElementBottom = () =>
    document.getElementById('profile-nav-placeholder')?.getBoundingClientRect()
      .bottom;
  shouldBeStuck = () => this.placeholderElementBottom() <= 0;

  handleScroll = () => {
    if (this.onDesktop()) {
      this.handleDesktopScroll();
    } else {
      this.handleMobileScroll();
    }

    const { profileSections } = this.props;
    // i think this is a safe way to find section closest to top of screen since render order of sections
    // is based on order of sections in the array
    const topSection = profileSections.find(
      section =>
        document.getElementById(createId(section)).getBoundingClientRect()
          .top >= 0,
    );

    let currentSection =
      topSection === undefined ? BELOW_LAST_SECTION : topSection;

    // i tried to use placeholder element but because it is visible when scrolling to first section
    // it was causing issues so instead relying on an element not rendered within this component
    const topOfHeadingSummaryVisible =
      document.getElementById('heading-summary').getBoundingClientRect().top >=
      0;
    if (topOfHeadingSummaryVisible) {
      currentSection = ABOVE_TOP_SECTION;
    }

    this.setState({ currentSection });
  };

  scrollToSection = (section, navBar) => {
    this.setState({ currentSection: section });

    let offset = -navBar.offsetHeight - 2;
    if (!this.shouldBeStuck()) {
      offset = -(navBar.offsetHeight * 2);
      // it's a magic number but it fixes the weird scrolling issue when navbar is unstuck
    }

    scroller.scrollTo(createId(section), getScrollOptions({ offset }));
  };

  currentSectionIndex = () => {
    const { currentSection } = this.state;
    const { profileSections } = this.props;
    if (currentSection === ABOVE_TOP_SECTION) {
      return 0;
    } else if (currentSection === BELOW_LAST_SECTION) {
      return profileSections.length - 1;
    } else {
      return profileSections.findIndex(section => section === currentSection);
    }
  };

  // Desktop functions

  profileNavBarDesktop = () =>
    document.getElementById('profile-nav-bar-desktop');

  handleDesktopScroll = () => {
    const jumpLinks = document.getElementById('jump-links');
    const desktopStuck = this.shouldBeStuck();

    this.profileNavBarDesktop().className = this.navBarDesktopClasses(
      desktopStuck,
    );
    jumpLinks.className = this.jumpLinkClasses(desktopStuck);
  };

  navBarDesktopClasses = (stuck = false) =>
    classNames('profile-nav-bar', 'nav-bar-desktop-only', {
      'profile-nav-bar-stuck': stuck,
      row: !stuck,
    });

  jumpLinkClasses = (stuck = false) =>
    classNames('row', { 'vads-u-margin--0': !stuck });

  jumpLinkClickedDesktop = e => {
    e.preventDefault();
    const section = e.target.text;
    this.scrollToSection(section, this.profileNavBarDesktop());
  };

  // Mobile functions

  profileNavBarMobile = () => document.getElementById('profile-nav-bar-mobile');

  handleMobileScroll = () => {
    const mobileStuck = this.shouldBeStuck();
    this.profileNavBarMobile().className = this.navBarMobileClasses(
      mobileStuck,
    );
  };

  navBarMobileClasses = (stuck = false) =>
    classNames('profile-nav-bar', 'nav-bar-mobile-only', {
      'profile-nav-bar-stuck': stuck,
    });

  navBarMobileArrowClasses = (direction, disabled = false) =>
    classNames(
      'far',
      `fa-arrow-alt-circle-${direction}`,
      'vads-u-margin-right--1p5',
      'vads-u-margin-top--0p5',
      { disabled },
    );

  navigateMobile = e => {
    const arrow = e.target.id;
    const { profileSections } = this.props;
    const { currentSection } = this.state;
    const downArrow = arrow === 'mobile-down-arrow';
    const upArrow = arrow === 'mobile-up-arrow';

    if (currentSection === ABOVE_TOP_SECTION && downArrow) {
      this.scrollToSection(profileSections[0], this.profileNavBarMobile());
    } else if (currentSection !== ABOVE_TOP_SECTION) {
      let scrollIndex = this.currentSectionIndex();

      if (downArrow && !this.atBottom()) {
        scrollIndex += 1;
      } else if (upArrow) {
        if (!this.atTop() && currentSection !== BELOW_LAST_SECTION) {
          scrollIndex -= 1;
        } else {
          scrollIndex = profileSections.length - 1;
        }
      }

      this.scrollToSection(
        profileSections[scrollIndex],
        this.profileNavBarMobile(),
      );
    }
  };

  render() {
    const stuck = this.shouldBeStuck();

    return (
      <>
        <span id="profile-nav-placeholder" />
        <div
          id="profile-nav-bar-desktop"
          className={this.navBarDesktopClasses(stuck)}
        >
          <div id="jump-links" className={this.jumpLinkClasses(stuck)}>
            {this.props.profileSections.map(section => (
              <span
                className="vads-u-margin-right--1p5"
                key={`${createId(section)}-nav-bar`}
              >
                <a
                  href={`#${createId(section)}`}
                  onClick={this.jumpLinkClickedDesktop}
                >
                  {section}
                </a>
              </span>
            ))}
          </div>
        </div>
        <div
          id="profile-nav-bar-mobile"
          className={this.navBarMobileClasses(stuck)}
        >
          <h2 className="vads-u-font-size--h3 vads-u-margin--0">
            Navigate this page
            <span
              className="vads-u-margin-right--1p5"
              style={{ float: 'right' }}
            >
              <i
                id="mobile-up-arrow"
                className={this.navBarMobileArrowClasses('up', this.atTop())}
                onClick={this.navigateMobile}
              />
              <i
                id="mobile-down-arrow"
                className={this.navBarMobileArrowClasses(
                  'down',
                  this.atBottom(),
                )}
                onClick={this.navigateMobile}
              />
            </span>
          </h2>
        </div>
      </>
    );
  }
}

export default connect()(ProfileNavBar);
