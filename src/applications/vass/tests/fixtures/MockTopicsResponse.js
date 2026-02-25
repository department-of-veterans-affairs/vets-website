import {
  createUnauthorizedError,
  createVassApiError,
  createServiceError,
} from '../../services/mocks/utils/errors';
import { createTopicsResponse } from '../../services/mocks/utils/responses';
import { createDefaultTopics } from '../../services/mocks/utils/topic';

/** @typedef {import('../../utils/appointments').Topic} Topic */

/**
 * Mock topics response.
 *
 * Based on API spec: GET /vass/v0/topics
 * @see https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/appointments/va-online-scheduling/initiatives/solid-start-scheduling/engineering/api-specification.md#get-vassv0topics
 *
 * @export
 * @class MockTopicsResponse
 */
export default class MockTopicsResponse {
  /**
   * Creates an instance of MockTopicsResponse.
   *
   * @param {Object} props - Properties used to create the mock response.
   * @param {Topic[]} [props.topics=[]] - Array of topic objects with topicId and topicName.
   * @memberof MockTopicsResponse
   */
  constructor({ topics = [] } = {}) {
    this.data = createTopicsResponse({
      topics,
    });
  }

  /**
   * Returns the response as a plain object.
   *
   * @returns {{ data: { topics: Topic[] } }} The mock response object.
   * @memberof MockTopicsResponse
   */
  toJSON() {
    return this.data;
  }

  /**
   * Creates the default set of mock topics.
   *
   * @static
   * @param {number} [numberOfTopics=17] - Number of topics to include in the response.
   * @returns {Topic[]} Array of topic objects.
   * @memberof MockTopicsResponse
   */
  static createDefaultTopics(numberOfTopics = 17) {
    return createDefaultTopics(numberOfTopics);
  }

  /**
   * Creates an unauthorized error response.
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockTopicsResponse
   */
  static createUnauthorizedError() {
    return createUnauthorizedError();
  }

  /**
   * Creates a VASS API error response (Bad Gateway).
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockTopicsResponse
   */
  static createVassApiError() {
    return createVassApiError();
  }

  /**
   * Creates a service error response (Service Unavailable).
   *
   * @static
   * @returns {Object} The error response object.
   * @memberof MockTopicsResponse
   */
  static createServiceError() {
    return createServiceError();
  }
}
