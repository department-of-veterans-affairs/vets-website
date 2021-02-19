import React from 'react';
import { connect } from 'react-redux';
import { scroller } from 'react-scroll';

import { createId } from '../utils/helpers';
import classNames from 'classnames';
import { getScrollOptions } from 'platform/utilities/ui';
import { NAV_WIDTH } from '../constants';

export class ProfileNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSection: null,
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, true);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, true);
  }

  onDesktop = () => {
    return window.innerWidth >= NAV_WIDTH;
  };

  handleScroll = () => {
    const { profileSections } = this.props;
    // i think this is a safe way to find section closest to top of screen since render order of sections
    // is based on order of sections in the array
    const topSection = profileSections.find(
      section =>
        document.getElementById(createId(section)).getBoundingClientRect()
          .top >= 0,
    );

    const currentSection =
      topSection !== undefined
        ? topSection
        : profileSections[profileSections.length - 1];

    this.setState({ currentSection });

    if (this.onDesktop()) {
      this.handleDesktopScroll();
    } else {
      this.handleMobileScroll();
    }
  };

  shouldBeStuck = profileNavBar => {
    const placeholder = document.getElementById('profile-nav-placeholder');

    const topOffset = profileNavBar?.getBoundingClientRect().top <= 0;
    const bottomOffset = placeholder?.getBoundingClientRect().bottom <= 0;

    return topOffset && bottomOffset;
  };

  scrollToSection = (section, navBar) => {
    this.setState({ currentSection: section });

    let offset = -navBar.offsetHeight;
    if (!this.shouldBeStuck(navBar)) {
      offset = -(navBar.offsetHeight * 2);
      // it's a magic number but it fixes the weird scrolling issue when navbar is unstuck
    }

    scroller.scrollTo(createId(section), getScrollOptions({ offset }));
  };

  currentSectionIndex = () => {
    const { currentSection } = this.state;
    if (currentSection === null) {
      return 0;
    } else {
      return this.props.profileSections.findIndex(
        section => section === currentSection,
      );
    }
  };

  atTop = () => this.currentSectionIndex() === 0;
  atBottom = () =>
    this.currentSectionIndex() === this.props.profileSections.length - 1;

  // Desktop functions

  profileNavBarDesktop = () =>
    document.getElementById('profile-nav-bar-desktop');

  handleDesktopScroll = () => {
    const jumpLinks = document.getElementById('jump-links');
    const desktopStuck = this.shouldBeStuck(this.profileNavBarDesktop());

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
    const mobileStuck = this.shouldBeStuck(this.profileNavBarMobile());
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

    if (currentSection === null && arrow === 'mobile-down-arrow') {
      this.scrollToSection(profileSections[0], this.profileNavBarMobile());
    } else if (currentSection !== null) {
      let scrollIndex = this.currentSectionIndex();

      if (arrow === 'mobile-down-arrow' && !this.atBottom()) {
        scrollIndex += 1;
      } else if (arrow === 'mobile-up-arrow' && !this.atTop()) {
        scrollIndex -= 1;
      }
      this.scrollToSection(
        profileSections[scrollIndex],
        this.profileNavBarMobile(),
      );
    }
  };

  render() {
    const desktopStuck = this.shouldBeStuck(this.profileNavBarDesktop());
    const mobileStuck = this.shouldBeStuck(this.profileNavBarMobile());

    return (
      <>
        <span id="profile-nav-placeholder" />
        <div
          id="profile-nav-bar-desktop"
          className={this.navBarDesktopClasses(desktopStuck)}
        >
          <div id="jump-links" className={this.jumpLinkClasses(desktopStuck)}>
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
          className={this.navBarMobileClasses(mobileStuck)}
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
