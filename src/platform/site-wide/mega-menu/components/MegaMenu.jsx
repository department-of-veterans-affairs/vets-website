/* eslint-disable react/jsx-indent */
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import MenuSection from './MenuSection';
import SubMenu from './SubMenu';

export default class MegaMenu extends React.Component {
  componentDidMount() {
    this.mobileMediaQuery = window.matchMedia('(max-width: 767px)');
    this.smallDesktopMediaQuery = window.matchMedia(
      '(min-width: 768px and max-width: 1007px)',
    );

    if (this.mobileMediaQuery.matches) {
      this.props.toggleDisplayHidden(true);
    }

    this.mobileMediaQuery.addListener(this.resetDefaultState);
    document.body.addEventListener('click', this.handleDocumentClick, false);
  }

  /**
   * Remove event listener
   */
  componentWillUnmount() {
    this.props.updateCurrentSection('');
    this.props.toggleDisplayHidden(true);
    this.mobileMediaQuery.removeListener(this.resetDefaultState);
    document.body.removeEventListener('click', this.handleDocumentClick, false);
  }

  getSubmenu(item, currentSection) {
    if (this.mobileMediaQuery?.matches) {
      const menuSections = [
        item.menuSections.mainColumn,
        item.menuSections.columnOne,
        item.menuSections.columnTwo,
      ].reduce((acc, column) => {
        acc.push({
          title: column.title,
          links: {
            columnOne: {
              title: '',
              links: column.links,
            },
            columnTwo: {
              title: '',
              links: [],
            },
          },
        });

        return acc;
      }, []);

      return menuSections.map((section, i) => (
        <MenuSection
          key={`${section}-${i}`}
          title={section.title}
          currentSection={currentSection}
          updateCurrentSection={() => this.updateCurrentSection(section.title)}
          links={section.links}
          linkClicked={this.props.linkClicked}
          mobileMediaQuery={this.mobileMediaQuery}
          smallDesktopMediaQuery={this.smallDesktopMediaQuery}
          columnThreeLinkClicked={this.props.columnThreeLinkClicked}
        />
      ));
    }

    return (
      <SubMenu
        data={item.menuSections}
        navTitle={item.title}
        handleBackToMenu={() => this.toggleDropDown('')}
        show={this.props.currentDropdown !== ''}
        linkClicked={this.props.linkClicked}
        mobileMediaQuery={this.mobileMediaQuery}
        smallDesktopMediaQuery={this.smallDesktopMediaQuery}
        columnThreeLinkClicked={this.props.columnThreeLinkClicked}
      />
    );
  }

  handleDocumentClick = event => {
    if (this.props.currentDropdown && !this.menuRef.contains(event.target)) {
      this.props.toggleDropDown('');
      this.props.updateCurrentSection('');
    }
  };

  resetDefaultState = () => {
    if (this.mobileMediaQuery?.matches) {
      this.props.toggleDisplayHidden(true);
    } else {
      this.props.toggleDisplayHidden(false);
    }
    this.props.updateCurrentSection('');
    this.props.toggleDropDown('');
  };

  toggleDropDown(title) {
    if (this.props.currentDropdown === title) {
      this.props.toggleDropDown('');
    } else {
      this.props.toggleDropDown(title);
    }
  }

  updateCurrentSection(title) {
    let sectionTitle = title;

    if (this.mobileMediaQuery?.matches) {
      sectionTitle = this.props.currentSection === title ? '' : title;
    }

    this.props.updateCurrentSection(sectionTitle);
  }

  render() {
    const {
      currentDropdown,
      currentSection,
      data,
      display,
      linkClicked,
      columnThreeLinkClicked,
    } = this.props;

    const hasOpenSubMenu = currentSection !== '';

    return (
      <div className="hidden-header login-container" {...display}>
        <div
          className="row va-flex"
          ref={el => {
            this.menuRef = el;
          }}
        >
          <div id="vetnav" role="navigation">
            <ul id="vetnav-menu">
              <li>
                <a
                  className="vetnav-level1"
                  data-testid="mobile-home-nav-link"
                  href="/"
                >
                  Home
                </a>
              </li>
              {data.map((item, i) => (
                <li
                  key={`${_.kebabCase(item.title)}-${i}`}
                  className={`${item.className || ''} ${
                    item.currentPage
                      ? 'current-page medium-screen:vads-u-margin-right--0'
                      : ''
                  }`}
                >
                  {item.menuSections ? (
                    <button
                      type="button"
                      aria-expanded={currentDropdown === item.title}
                      aria-controls={`vetnav-${_.kebabCase(item.title)}`}
                      aria-haspopup={!!item.menuSections}
                      className="vetnav-level1"
                      data-e2e-id={`${_.kebabCase(item.title)}-${i}`}
                      onClick={() => {
                        this.toggleDropDown(item.title);
                        this.props.updateCurrentSection('');
                      }}
                    >
                      {item.title}
                    </button>
                  ) : (
                    <a
                      className="vetnav-level1 medium-screen:vads-u-padding--2"
                      data-e2e-id={`${_.kebabCase(item.title)}-${i}`}
                      href={item.href}
                      onClick={linkClicked.bind(null, item)}
                    >
                      {item.title}
                    </a>
                  )}
                  <div
                    id={`vetnav-${_.kebabCase(item.title)}`}
                    className={`vetnav-panel ${
                      hasOpenSubMenu ? 'vetnav-submenu--expanded' : ''
                    }`}
                    hidden={currentDropdown !== item.title}
                  >
                    {item.title === currentDropdown &&
                      item.menuSections && (
                        <ul aria-label={item.title}>
                          {Array.isArray(item.menuSections)
                            ? item.menuSections.map((section, j) => (
                                <MenuSection
                                  key={`${section}-${j}`}
                                  title={section.title}
                                  currentSection={currentSection}
                                  updateCurrentSection={() =>
                                    this.updateCurrentSection(section.title)
                                  }
                                  href={section.href}
                                  links={section.links}
                                  linkClicked={linkClicked}
                                  mobileMediaQuery={this.mobileMediaQuery}
                                  smallDesktopMediaQuery={
                                    this.smallDesktopMediaQuery
                                  }
                                  columnThreeLinkClicked={
                                    columnThreeLinkClicked
                                  }
                                />
                              ))
                            : this.getSubmenu(item, currentSection)}
                        </ul>
                      )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

MegaMenu.propTypes = {
  /**
   * This is the data that will generate the navigation
   * Data is made up an array of objects
   * Read Notes tab to see the structure of the data prop
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      menuSections: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    }),
  ).isRequired,
  /**
   * Function to update currentSection in state
   */
  updateCurrentSection: PropTypes.func.isRequired,
  /**
   * Function to update currentDropdown in state
   */
  toggleDropDown: PropTypes.func.isRequired,
  /**
   * Function to update if the MegaMenu is displayed or not
   */
  toggleDisplayHidden: PropTypes.func.isRequired,
  /**
   * String value of current dropdown
   */
  currentDropdown: PropTypes.string,
  /**
   * String value of current dropdown section
   */
  currentSection: PropTypes.string,

  /**
   * Optional function to intercept links clicked
   */
  linkClicked: PropTypes.func,

  /**
   * Optional function to intercept links clicked at column three
   */
  columnThreeLinkClicked: PropTypes.func,

  display: PropTypes.shape({
    hidden: PropTypes.bool,
  }),
};

MegaMenu.defaultProps = {
  currentDropdown: '',
  currentSection: '',
  display: {},
  linkClicked() {},
  columnThreeLinkClicked() {},
};
