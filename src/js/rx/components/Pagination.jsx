/*
 * Pagination Component
 * TODO:
 * - Integrate the API
 * - Add click handlers for updating the view.
 * - View in IE10, 11, Edge
*/

import React from 'react';

class Pagination extends React.Component {
  render() {
    return (
      <div className="va-pagination">
        <a className="va-pagination-prev" href="#prev"><abbr title="Previous">Prev</abbr></a>
        <div className="va-pagination-inner">
          <a href="#1" className="va-pagination-active">1</a>
          <a href="#2">2</a>
          <a href="#3">3</a>
          <a href="#4">4</a>
          <a href="#5">5</a>
          <a href="#6">6</a>
          <a href="#7">7</a>
          <a href="#8">8</a>
          <a href="#9">9</a>
          <a href="#10">10</a>
          <a href="#11">11</a>
          <a href="#12">12</a>
          <a href="#13">13</a>
          <a href="#14">14</a>
          <a href="#15">15</a>
        </div>
        <a className="va-pagination-next" href="#next">Next</a>
      </div>
    );
  }
}

export default Pagination;
