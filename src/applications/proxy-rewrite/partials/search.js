import React from 'react';
import PropTypes from 'prop-types';

const Keycodes = {
  Enter: 13,
  Tab: 9,
};

class SearchDropdownComponent extends React.Component {
  constructor(props) {
    super(props);
    this.onInputSubmit = this.onInputSubmit.bind(this);

    this.state = {
      inputValue: '',
      isOpen: false,
    };
  }

  componentDidMount() {
    const searchDropdownButton = document.getElementById(
      'search-dropdown-button',
    );

    if (searchDropdownButton) {
      searchDropdownButton.addEventListener('click', this.toggleDropdown);
      searchDropdownButton.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleDropdown();
        }
      });

      const htmlElement = document.getElementsByTagName('html')[0];

      htmlElement.addEventListener('click', e => {
        if (this.state.isOpen && !searchDropdownButton.contains(e.target)) {
          this.toggleDropdown();
        }
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const searchDropdown = document.getElementById('search');
    const searchInput = document.getElementById(
      `search-header-dropdown-input-field`,
    );

    if (searchDropdown && prevState.isOpen !== this.state.isOpen) {
      searchDropdown.toggleAttribute('hidden');

      if (searchInput && this.state.isOpen) {
        searchInput.focus();
      }
    }
  }

  componentWillUnmount() {
    const button = document.getElementById('search-dropdown-button');

    button.removeEventListener('click', this.toggleDropdown);
    button.removeEventListener('keydown', this.toggleDropdown);
  }

  toggleDropdown = () => {
    const { isOpen } = this.state;
    const button = document.getElementById('search-dropdown-button');

    this.setState({ isOpen: !isOpen }, () => {
      button.setAttribute(
        'aria-expanded',
        !isOpen ? 'true' : 'false',
      );
    });
  };

  handleInputChange = event => {
    const inputValue = event.target.value;

    this.setState({
      inputValue,
    });
  };

  onInputSubmit = () => {
    const searchUrl = `https://www.va.gov/search/?query=${encodeURIComponent(
      this.state.inputValue,
    )}&t=${false}`;

    window.location.assign(searchUrl);
  };

  onKeyDown = event => {
    const currentKeyPress = event.which || event.keyCode;

    if (currentKeyPress === Keycodes.Enter) {
      event.preventDefault();
      this.onInputSubmit();
    }
  };

  handleButtonShift = event => {
    const currentKeyPress = event.which || event.keycode;

    if (event.shiftKey && currentKeyPress === Keycodes.Tab) {
      event.preventDefault();
      document.getElementById('search-header-dropdown-input-field').focus();
    }
  };

  render() {
    const { inputValue } = this.state;
    const { isMobile } = this.props;
    console.log('isMobile: ', isMobile);

    if (isMobile) {
      return (
        <>
          <label
            className="vads-u-font-weight--normal vads-u-color--gray-dark vads-u-margin--0 vads-u-margin-top--2 vads-u-margin-left--1p5"
            htmlFor="search-header-dropdown-input-field"
          >
            Search
          </label>
          <div
            id="search-header-dropdown-component"
            className="search-dropdown-component vads-u-display--flex vads-u-width--full full-width-suggestions vads-u-padding-x--0p5"
          >
            <div className="search-dropdown-container vads-u-width--full vads-u-flex-direction--column full-width-suggestions vads-u-padding-y--1 vads-u-padding-left--1 vads-u-padding-right--0 vads-u-padding-bottom--2 vads-u-margin--0 search-input-container">
              <input
                aria-autocomplete="none"
                autoComplete="off"
                className="vads-u-width--full search-dropdown-input-field"
                id="search-header-dropdown-input-field"
                data-e2e-id="search-header-dropdown-input-field"
                type="text"
                value={inputValue}
                onChange={this.handleInputChange}
                onKeyDown={this.onKeyDown}
              />{' '}
            </div>
            <button
              type="submit"
              className="search-button search-dropdown-submit-button vads-u-margin-right--1 vads-u-font-size--base vads-u-padding-left--1p5"
              data-e2e-id="search-header-dropdown-submit-button"
              id="search-header-dropdown-submit-button"
              onClick={this.onInputSubmit}
              onKeyDown={this.handleButtonShift}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                width="18"
                viewBox="2 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                />
              </svg>
              <span className="usa-sr-only">Search</span>
            </button>
          </div>
        </>
      );
    }
    // Desktop
    return (
      <div
        id="search-header-dropdown-component"
        className="search-dropdown-component vads-u-display--flex vads-u-width--full"
      >
        <div className="search-dropdown-container vads-u-width--full vads-u-flex-direction--column vads-u-padding-y--1 vads-u-padding-left--1 vads-u-padding-right--0">
          <input
            aria-autocomplete="none"
            aria-label="Search"
            autoComplete="off"
            className="vads-u-width--full search-dropdown-input-field"
            id="search-header-dropdown-input-field"
            data-e2e-id="search-header-dropdown-input-field"
            type="text"
            value={inputValue}
            onChange={this.handleInputChange}
            onKeyDown={this.onKeyDown}
          />
        </div>
        <button
          type="submit"
          className="search-button vads-u-margin-right--1 vads-u-margin-top--1 vads-u-font-size--base vads-u-padding-left--1p5"
          onClick={this.onInputSubmit}
          onKeyDown={this.handleButtonShift}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            width="18"
            viewBox="3 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#fff"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
            />
          </svg>
          <span className="usa-sr-only">Search</span>
        </button>
      </div>
    );
  }
}

SearchDropdownComponent.propTypes = {
  isMobile: PropTypes.bool.isRequired,
};

export default SearchDropdownComponent;
