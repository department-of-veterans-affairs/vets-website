import React from 'react';
import { connect } from 'react-redux';

export class SearchPage extends React.Component {

  renderPageTitle(prefix) {
    document.title = [prefix, 'GI Bill Comparison Tool'].join(' - ');
  }

  render() {
    this.renderPageTitle(`Search Results - ${'TODO search term'}`);
    return (
      <div className="search-page">

        <div className="row">
          <div className="column">
            <h1>92 Search Results</h1>
          </div>
        </div>

        <div className="row">
          <div className="small-12 medium-3 columns">
            <h5>Keywords</h5>
            <div style={{ height: '100px' }}/>

            <h5>Institution details</h5>
            <div style={{ height: '100px' }}/>

            <h5>Your eligibility</h5>
            <div style={{ height: '100px' }}/>
          </div>

          <div className="small-12 medium-9 columns">
            <div style={{ height: '600px', backgroundColor: '#ddd' }}>
              <h6>(Results)</h6>
            </div>
            <p>(Pagination)</p>
          </div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state) => state;
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
