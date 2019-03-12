import React from 'react';
import set from 'platform/utilities/data/set';

export default class Wizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageHistory: [props.pages[0]],
      pageStates: {},
      currentPageIndex: 0,
    };
  }

  get currentPage() {
    const { pageHistory, currentPageIndex } = this.state;
    return pageHistory[currentPageIndex];
  }

  setPageState = pageState => {
    this.setState({
      pageStates: set(this.currentPage.name, pageState, this.state.pageStates),
    });
  };

  navigateToNext = pageName => {
    const { pageHistory, currentPageIndex } = this.state;
    const nextPageIndex = currentPageIndex + 1;
    const nextPage = this.props.pages.find(p => p.name === pageName);
    if (!nextPage) {
      // eslint-disable-next-line no-console
      console.error(`Page not found: ${pageName}`);
      return;
    }

    // If the next page is new, rewrite the future history
    if (
      pageHistory[nextPageIndex] &&
      pageHistory[nextPageIndex].name !== nextPage.name
    ) {
      const newHistory = set(nextPageIndex, nextPage, pageHistory).slice(
        0,
        nextPageIndex + 1,
      );
      this.setState({ pageHistory: newHistory });
    }
    this.setState({ currentPageIndex: nextPageIndex });
  };

  navigateToPrevious = () => {
    this.setState({ currentPageIndex: this.state.currentPageIndex - 1 });
  };

  render() {
    const { pageStates } = this.state;
    const Page = this.currentPage.component;
    return (
      <div className="form-expanding-group-open va-nav-linkslist--related wizard-content">
        <Page
          setPageState={this.setPageState}
          state={pageStates[this.currentPage.name]}
          goForward={this.navigateToNext}
          goBack={this.navigateToPrevious}
        />
      </div>
    );
  }
}
