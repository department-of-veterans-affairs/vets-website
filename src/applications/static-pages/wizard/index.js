import React from 'react';
import set from 'platform/utilities/data/set';

export default class Wizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageHistory: [props.pages[0]],
      currentPageIndex: 0,
    };
  }

  get currentPage() {
    const { pageHistory, currentPageIndex } = this.state;
    return pageHistory[currentPageIndex];
  }

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
    const { pageHistory } = this.state;
    return (
      <div className="form-expanding-group-open va-nav-linkslist--related wizard-content">
        {pageHistory.map((page, index) => {
          const Page = page.component;
          return (
            <Page
              key={`${page.name}_${index}`}
              setPageState={(newState, nextPageName) =>
                this.setPageState(index, newState, nextPageName)
              }
              state={page.state}
            />
          );
        })}
      </div>
    );
  }
}
