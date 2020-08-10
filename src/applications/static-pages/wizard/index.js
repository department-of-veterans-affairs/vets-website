import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import set from 'platform/utilities/data/set';

import { connect } from 'react-redux';
import { form526BDDFeature } from '../../disability-benefits/all-claims/config/selectors';

export const NO_BENEFIT_REFERRED = 'no benefit was referred';
export const WIZARD_STATUS_NOT_STARTED = 'not started';
export const WIZARD_STATUS_COMPLETE = 'complete';
export const WIZARD_STATUS_APPLY_NOW = 'awaiting click on apply button';
export const WIZARD_STATUS_IN_PROGRESS = 'in progress';
export const WIZARD_STATUS_UPDATING = 'updating';
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
    const {
      setReferredBenefit,
      setWizardStatus,
      expander,
      buttonText,
    } = this.props;
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
        {expander && (
          <button
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
                    allowBDD={this.props.allowBDD}
                  />
                );
              })}
            </div>
          </div>
        )}
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
  setWizardStatus: PropTypes.func,
  setReferredBenefit: PropTypes.func,
};

Wizard.defaultProps = {
  buttonText: 'Find your form',
  expander: true,
  setWizardStatus: () => {},
  setReferredBenefit: () => {},
};

const mapStateToProps = state => ({
  allowBDD: form526BDDFeature(state),
});

export default connect(mapStateToProps)(Wizard);
