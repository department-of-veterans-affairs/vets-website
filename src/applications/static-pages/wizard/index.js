import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import set from 'platform/utilities/data/set';

export default class Wizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageHistory: [props.pages[0]],
      currentPageIndex: 0,
      expanded: !props.expander,
    };
  }

  get currentPage() {
    const { pageHistory, currentPageIndex } = this.state;
    return pageHistory[currentPageIndex];
  }

  getPageStateFromPageName = pageName =>
    this.state.pageHistory.find(page => page.name === pageName)?.state;

  setPageState = (index, newState, nextPageName) => {
    let newHistory = set(`[${index}].state`, newState, this.state.pageHistory);

    // If the next page is new, rewrite the future history
    if (nextPageName) {
      const nextPageIndex = index + 1;
      const nextPage = this.props.pages.find(p => p.name === nextPageName);
      const { pageHistory } = this.state;
      if (!nextPage) {
        // eslint-disable-next-line no-console
        console.error(`Page not found: ${nextPageName}`);
        return;
      }

      if (
        !pageHistory[nextPageIndex] ||
        pageHistory[nextPageIndex].name !== nextPage.name
      ) {
        newHistory = set(`${nextPageIndex}`, nextPage, newHistory).slice(
          0,
          nextPageIndex + 1,
        );
      }
    }
    this.setState({ pageHistory: newHistory });
  };

  render() {
    const buttonClasses = classNames('usa-button-primary', 'wizard-button', {
      'va-button-primary': !this.state.expanded,
    });
    const contentClasses = classNames(
      'form-expanding-group-open',
      'wizard-content',
      {
        'wizard-content-closed': !this.state.expanded,
      },
    );

    return (
      <div>
        {this.props.expander && (
          <button
            aria-expanded={this.state.expanded ? 'true' : 'false'}
            aria-controls="wizardOptions"
            className={buttonClasses}
            onClick={() => this.setState({ expanded: !this.state.expanded })}
          >
            {this.props.buttonText}
          </button>
        )}
        <div className={contentClasses} id="wizardOptions">
          <div className="wizard-content-inner">
            {this.state.pageHistory.map((page, index) => {
              const Page = page.component;
              return (
                <Page
                  key={`${page.name}_${index}`}
                  getPageStateFromPageName={pageName =>
                    this.getPageStateFromPageName(pageName)
                  }
                  setPageState={(newState, nextPageName) =>
                    this.setPageState(index, newState, nextPageName)
                  }
                  state={page.state}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

Wizard.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      component: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
        .isRequired,
      state: PropTypes.any,
    }),
  ),
  buttonText: PropTypes.string,
  expander: PropTypes.bool,
};

Wizard.defaultProps = {
  buttonText: 'Find your form',
  expander: true,
};
