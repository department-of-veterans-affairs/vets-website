import React from 'react';
import { useSelector } from 'react-redux';
// import { setData } from 'platform/forms-system/src/js/actions';
import MiniSummaryCard from '../utils/MiniSummaryCard';
import { currency as currencyFormatter } from '../../utils/helpers';

const OtherAssetsSummary = () => {
  // const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const { assets } = formData;
  const { otherAssetsEnhanced = [] } = assets;

  // Need to get an id for the asset to edit
  const onEdit = () => {};

  // Need to get an id for the asset to delete
  const onDelete = () => {};

  return (
    <>
      {otherAssetsEnhanced.map(asset => (
        <MiniSummaryCard
          heading={asset.name}
          key={asset.name}
          onDelete={event => onDelete(event)}
          onEdit={event => onEdit(event)}
          subheading={`Value: ${currencyFormatter(asset.amount)}`}
        />
      ))}
      {/* <a className="vads-c-action-link--green" href="#">
        Add additional assets
      </a> */}
      <va-additional-info
        class="vads-u-margin-top--4"
        trigger="Why do I need to provide this information?"
      >
        We ask for details about items of value such as jewelry and art because
        it gives us a picture of your financial situation and allows us to make
        a more informed decision regarding your request.
      </va-additional-info>
      <va-additional-info trigger="What if I don’t know the estimated value of an asset?">
        Don’t worry. We just want to get an idea of items of value you may own
        so we can better understand your financial situation. Include the amount
        of money you think you would get if you sold the asset. To get an idea
        of prices, you can check these places:
        <ul>
          <li>Online forums for your community</li>
          <li>Classified ads in local newspapers</li>
          <li>
            Websites or forums that appraise the value of items like jewelry and
            art
          </li>
        </ul>
      </va-additional-info>
    </>
  );
};

export default OtherAssetsSummary;
