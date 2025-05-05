import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleMobileDisplayHidden } from '../../mega-menu/actions';

export const Main = props => {
  const { hidden } = props.display;

  return (
    <div>
      <button
        aria-controls="vetnav"
        aria-expanded={!hidden}
        type="button"
        onClick={() => props.toggleMobileDisplayHidden()}
        className={
          hidden ? 'vetnav-controller-open' : 'vetnav-controller-close'
        }
      >
        {hidden ? (
          <span className="va-flex">
            Menu
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 444.8 444.8"
              pointerEvents="none"
            >
              <path d="M248.1 352L434 165.9c7.2-6.9 10.8-15.4 10.8-25.7 0-10.3-3.6-18.8-10.8-25.7l-21.4-21.7c-7-7-15.6-10.6-25.7-10.6-9.9 0-18.6 3.5-26 10.6L222.4 231.5 83.7 92.8c-7-7-15.6-10.6-25.7-10.6-9.9 0-18.6 3.5-26 10.6l-21.4 21.7c-7 7-10.6 15.6-10.6 25.7s3.5 18.7 10.6 25.7L196.4 352c7.4 7 16.1 10.6 26 10.6 10.1 0 18.7-3.5 25.7-10.6z" />
            </svg>
          </span>
        ) : (
          <span className="va-flex">
            Close
            <svg
              width="16"
              height="16"
              viewBox="0 0 49 49"
              xmlns="http://www.w3.org/2000/svg"
              pointerEvents="none"
            >
              <path d="M48.152 39.402c0 1.07-.375 1.982-1.125 2.732l-5.465 5.464c-.75.75-1.66 1.125-2.732 1.125-1.07 0-1.982-.375-2.732-1.125L24.286 35.786 12.473 47.598c-.75.75-1.66 1.125-2.732 1.125-1.07 0-1.98-.375-2.73-1.125l-5.465-5.464c-.75-.75-1.125-1.66-1.125-2.732 0-1.072.375-1.982 1.125-2.732l11.812-11.813L1.545 13.045c-.75-.75-1.125-1.66-1.125-2.732C.42 9.24.795 8.33 1.545 7.58L7.01 2.116C7.76 1.366 8.67.99 9.74.99c1.073 0 1.983.376 2.733 1.126L24.286 13.93 36.098 2.115c.75-.75 1.66-1.125 2.732-1.125 1.072 0 1.982.376 2.733 1.126l5.464 5.464c.75.75 1.125 1.66 1.125 2.732 0 1.072-.375 1.983-1.125 2.733L35.214 24.857 47.027 36.67c.75.75 1.125 1.66 1.125 2.732z" />
            </svg>
          </span>
        )}
      </button>
    </div>
  );
};

Main.propTypes = {
  display: PropTypes.object,
};

const mapStateToProps = state => {
  return {
    display: state.megaMenu?.display,
  };
};

const mapDispatchToProps = dispatch => ({
  toggleMobileDisplayHidden: () => {
    dispatch(toggleMobileDisplayHidden());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
