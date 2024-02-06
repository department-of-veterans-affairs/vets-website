import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import set from 'platform/utilities/data/set';

import {
  WIZARD_STATUS,
  WIZARD_STATUS_NOT_STARTED,
  WIZARD_STATUS_RESTARTING,
  WIZARD_STATUS_RESTARTED,
  WIZARD_STATUS_COMPLETE,
} from 'platform/site-wide/wizard';

export {
  WIZARD_STATUS,
  WIZARD_STATUS_NOT_STARTED,
  WIZARD_STATUS_RESTARTING,
  WIZARD_STATUS_RESTARTED,
  WIZARD_STATUS_COMPLETE,
};

export const NO_BENEFIT_REFERRED = 'no benefit was referred';
export const formIdSuffixes = {
  FORM_ID_1990: '1990',
  FORM_ID_10203: '10203',
  FORM_ID_1995: '1995',
  FORM_ID_0994: '0994',
  FORM_ID_5495: '5495',
  FORM_ID_5490: '5490',
  FORM_ID_1990E: '1990E',
  FORM_ID_1990N: '1990N',
};

export const getReferredBenefit = async () =>
  (await sessionStorage.getItem('benefitReferred')) || NO_BENEFIT_REFERRED;

export const getWizardStatus = async () =>
  (await sessionStorage.getItem('wizardStatus')) || WIZARD_STATUS_NOT_STARTED;

export class Wizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageHistory: [props.pages[0]],
      currentPageIndex: 0,
      expanded: !props.expander,
      benefitReferred: getReferredBenefit(),
      wizardStatus: getWizardStatus(),
    };
  }
  get currentPage() {
    const { pageHistory, currentPageIndex } = this.state;
    return pageHistory[currentPageIndex];
  }

  getPageStateFromPageName = pageName =>
    this.state.pageHistory.find(page => page.name === pageName)?.state;

  /**
   * Wizard~pageObject
   * @type {Object}
   * @property {JSX} component - Wizard page component
   * @property {String} name - Wizard page name
   * @property {Object} state - Wizard state for the named page
   */
  /**
   * Wizard~pageHistory
   * @type {Object[]}
   * @property {Wizard~pageObject} - Array of pages
   */
  /**
   * Wizard page state (history) array manipulation
   * @param {number} index - wizard step index from this.state.pageHistory map
   *  in the render function
   * @param {Wizard~pageHistory} newState - pageHistory state from Wizard page
   * @param {null|number|string} nextPageName - manipulate the pageHistory
   *  - null - do nothing
   *  - number - history index to render, but prevent rendering subsequent pages
   *  - string - update page history with the next page name
   */
  setPageState = (index, newState, nextPageName) => {
    let newHistory = set(`[${index}].state`, newState, this.state.pageHistory);
    if (nextPageName === index && newHistory.length - 1 > index) {
      // Remove previous page (needed to not show messaging when an invalid
      // value is provided; e.g. for an invalid date, we don't want to show an
      // inappropriate alert message)
      newHistory.pop();
    } else if (typeof nextPageName === 'string') {
      // If the next page is new, rewrite the future history
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
    const {
      setReferredBenefit,
      setWizardStatus,
      expander,
      buttonText,
    } = this.props;
    const buttonClasses = classNames('usa-button-primary', 'wizard-button');
    const contentClasses = classNames(
      'form-expanding-group-open',
      'wizard-content',
      {
        'wizard-content-closed': !this.state.expanded,
      },
    );
    return (
      <form onSubmit={e => e.preventDefault()}>
        {expander && (
          <button
            type="button"
            aria-expanded={this.state.expanded ? 'true' : 'false'}
            aria-controls="wizardOptions"
            className={buttonClasses}
            onClick={() => this.setState({ expanded: !this.state.expanded })}
          >
            {buttonText}
          </button>
        )}
        {this.state.expanded && (
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
                    setWizardStatus={setWizardStatus}
                    setReferredBenefit={setReferredBenefit}
                  />
                );
              })}
            </div>
          </div>
        )}
      </form>
    );
  }
}

Wizard.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      component: PropTypes.oneOfType([
        PropTypes.elementType,
        PropTypes.func,
        PropTypes.node,
      ]).isRequired,
      state: PropTypes.any,
    }),
  ),
  buttonText: PropTypes.string,
  expander: PropTypes.bool,
  setWizardStatus: PropTypes.func,
  setReferredBenefit: PropTypes.func,
};

Wizard.defaultProps = {
  buttonText: 'Find your form',
  expander: true,
  setWizardStatus: () => {},
  setReferredBenefit: () => {},
};

export default Wizard;
