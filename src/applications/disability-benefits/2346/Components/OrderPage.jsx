import React, { useState } from 'react';
import { Link } from 'react-router';

const OrderPage = () => {
  const [checked, setChecked] = useState(false);
  const handleClicked = e => {
    const value = e.target.checked;
    const name = e.target.name;

    setChecked({
      ...checked,
      [name]: value,
    });
  };
  return (
    <div>
      <h1>Select the products you need</h1>
      <p>Option XD3241 Hearing Aid.</p>
      <p>Prescribed 5/30/2014</p>
      <div>
        <input
          name="2352battery"
          id="2352battery"
          type="checkbox"
          onClick={handleClicked}
        />
        <label htmlFor="2352battery">2352 Battery</label>
        <p>Last Ordered: 10/10/19</p>
        <p>Qty: 60 (approximately 6 months) </p>
        <p>Next suggested order: 4/10/19</p>
      </div>
      <div>
        <input
          name="oticonmediumdomes"
          id="oticonmediumdomes"
          type="checkbox"
          onClick={handleClicked}
        />
        <label htmlFor="oticonmediumdomes">Oticon Medium Domes</label>
        <p>Last Ordered: 10/10/19</p>
        <p>Qty: 10 (approximately 6 months) </p>
        <p>Next suggested order: 4/10/19</p>
      </div>
      <div>
        <input
          name="additional-requests-1"
          id="additional-requests-1"
          type="checkbox"
          onClick={handleClicked}
        />
        <p>Do you have any additional requests for this order?</p>
      </div>
      <Link to="/home">
        <button>Back</button>
      </Link>
      <Link to="/home">
        <button>Comments</button>
      </Link>
    </div>
  );
};

export default OrderPage;
