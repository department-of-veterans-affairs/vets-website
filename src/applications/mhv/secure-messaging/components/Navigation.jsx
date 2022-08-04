import React from 'react';

export default function Navigation() {
  function hello() {
    return <span>'hello'</span>;
  }
  return (
    <div>
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-padding-y--2">
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 large-screen:vads-l-col--3">
            <nav
              className="va-sidebarnav vads-u-width--full"
              id="va-detailpage-sidebar"
            >
              <div>
                <button
                  type="button"
                  aria-label="Close this menu"
                  className="va-btn-close-icon va-sidebarnav-close"
                />
                <div className="left-side-nav-title">
                  <h4>My Health</h4>
                </div>
                <ul className="usa-accordion">
                  <li>
                    <button
                      className="usa-accordion-button" 
                      aria-expanded="false"
                      aria-controls="a1"
                    >
                      Messages
                    </button>
                    <div
                      id="a1"
                      className="usa-accordion-content"
                      aria-hidden="true"
                    >
                      <ul className="usa-sidenav-list">
                        <li>
                          <a href="#">Compose</a>
                        </li>
                        <li>
                          <a href="#">Dafts</a>
                        </li>
                        <li>
                          <a href="#">Folders</a>
                        </li>
                        <li>
                          <a href="#">Sent</a>
                        </li>
                        <li>
                          <a href="#">Deleted</a>
                        </li>
                        <li>
                          <a href="#">Search Messages</a>
                        </li>
                        <li>
                          <a href="#">How to use the Messages tool</a>
                        </li>
                        <li>
                          <a href="#">Messages FAQ</a>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

//goes above list code 
{/* <button type="button" className="va-btn-sidebarnav-trigger" aria-controls="va-detailpage-sidebar">
<span>
  <b>More in this section</b>
  <svg xmlns="http://www.w3.org/2000/svg" width="444.819" height="444.819" viewBox="0 0 444.819 444.819">
    <path fill="#ffffff" d="M352.025 196.712L165.885 10.848C159.028 3.615 150.468 0 140.185 0s-18.84 3.62-25.696 10.848l-21.7 21.416c-7.045 7.043-10.567 15.604-10.567 25.692 0 9.897 3.52 18.56 10.566 25.98L231.544 222.41 92.785 361.168c-7.04 7.043-10.563 15.604-10.563 25.693 0 9.9 3.52 18.566 10.564 25.98l21.7 21.417c7.043 7.043 15.612 10.564 25.697 10.564 10.09 0 18.656-3.52 25.697-10.564L352.025 248.39c7.046-7.423 10.57-16.084 10.57-25.98.002-10.09-3.524-18.655-10.57-25.698z"></path>
  </svg>
</span>
</button> */}

    // <nav>
    //   <div>image</div>
    //   <h4>My Health</h4>
    //   <button>x</button>
    //   <ul>
    //     <li>Messages</li>
    //     <li>Compose</li>
    //     <li>Dafts</li>
    //     <li>Folders</li>
    //     <li>Sent</li>
    //     <li>Deleted</li>
    //     <li>Search Messages</li>
    //     <li>How to use the Messages tool</li>
    //     <li>Messages FAQ</li>
    //   </ul>
    // </nav>