import { expect } from 'chai';
import {
  errorMessage,
  missingTotalMessage,
  totalRatingMessage,
} from '../../components/TotalRatingStates';

describe('TotalRatingStates', () => {
  it('should include an error message', () => {
    const message = errorMessage();
    expect(message.props.status).to.equal('error');
    expect(message.props.isVisible).to.equal(true);
  });

  it('should include a no rating message', () => {
    const message = missingTotalMessage();
    expect(message.props.status).to.equal('info');
    expect(message.props.isVisible).to.equal(true);
  });

  it('should include the totalRatingMessage', () => {
    const message = totalRatingMessage();

    expect(message).to.not.equal(null);
  });
});
