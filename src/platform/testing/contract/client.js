/* eslint-disable no-console */

const base64 = require('base-64');
const fs = require('fs');
const path = require('path');

require('isomorphic-fetch');

/**
 * typedef {Object} PactObject
 * @property {Object} data - The object parsed from the pact JSON file.
 * @property {string} version - The version to apply to the pact.
 * @property {string} tag - A tag for the consumer on this version.
 */

/**
 * typedef {Object} BrokerOperationOptions
 * @param {string} pactDir - The directory of pacts to be published.
 * @param {string} version - The version to apply to the pacts.
 * @param {string} tag - A tag for the consumers on this version.
 */

/**
 * typedef {Object} ConsumerDeployContext
 * @param {string} consumer - The consumer name.
 * @param {string} version - The consumer version.
 * @param {string} tag - The environment to deploy the consumer.
 * @param {string} url - The endpoint to invoke for can-i-deploy.
 */

/**
 * Client that interacts with a Pact Broker.
 */
module.exports = class PactBrokerClient {
  /**
   * Instantiates the client.
   * @param {string} url - Location of the Pact Broker.
   * @param {string} [username] - Basic auth username.
   * @param {string} [password] - Basic auth password.
   */
  constructor({ url, username, password }) {
    try {
      if (!url) throw new Error('PactBrokerClient: url is required');
      this.url = new URL(url).toString();
      this.authHeaders =
        username && password
          ? {
              Authorization: `Basic ${base64.encode(
                `${username}:${password}`,
              )}`,
            }
          : null;
    } catch (e) {
      console.error('PactBrokerClient failed to initialize.');
      throw e;
    }
  }

  /**
   * Gets the object representations of all pacts that have been generated.
   * @param {string} pactDir - The directory where pacts have been generated.
   * @return {Object[]} An array of all generated pacts parsed into objects.
   */
  parsePacts = pactDir => {
    const pactFiles = fs.readdirSync(pactDir);
    if (!pactFiles.length) throw new Error('No pacts found.');
    return pactFiles.map(pactFile =>
      JSON.parse(fs.readFileSync(path.join(pactDir, pactFile))),
    );
  };

  /**
   * Publishes a pact.
   * @params {PactObject} pactObject
   */
  publishPact = async pactObject => {
    const { data, version } = pactObject;
    const consumer = data.consumer.name;
    const provider = data.provider.name;

    const url = new URL(
      path.join(
        this.url,
        'pacts',
        `provider/${provider}`,
        `consumer/${consumer}`,
        `version/${version}`,
      ),
    ).toString();

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...this.authHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log(
        `Published pact between consumer ${consumer} and provider ${provider}.`,
      );
    } else {
      throw new Error(
        `Failed to publish pact between consumer ${consumer} and provider ${provider}: ${
          response.status
        } ${response.statusText}`,
      );
    }

    return pactObject;
  };

  /**
   * Tags a pact.
   * @params {PactObject} pactObject
   */
  tagPact = async pactObject => {
    const { data, version, tag } = pactObject;
    const consumer = data.consumer.name;

    const url = new URL(
      path.join(
        this.url,
        'pacticipants',
        consumer,
        `versions/${version}`,
        `tags/${tag}`,
      ),
    ).toString();

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...this.authHeaders,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log(`Tagged version ${version} of ${consumer} as "${tag}".`);
    } else {
      throw new Error(
        `Failed to tag version ${version} of consumer ${consumer} as "${tag}": ${
          response.status
        } ${response.statusText}`,
      );
    }

    return pactObject;
  };

  /**
   * Publishes and tags a pact.
   * @param {PactObject} pactObject
   */
  publishAndTagPact = pactObject =>
    Promise.resolve(pactObject)
      .then(this.publishPact)
      .then(this.tagPact);

  /**
   * Publishes and tags all pacts in the pacts folder.
   * @param {BrokerOperationOptions} options
   */
  publishAndTagPacts = async options => {
    const requiredOptions = ['pactDir', 'version', 'tag'];

    try {
      requiredOptions.forEach(key => {
        if (!options[key])
          throw new Error(`publishAndTagPacts: ${key} is required`);
      });

      const { pactDir, version, tag } = options;

      const pactObjects = this.parsePacts(pactDir).map(data => ({
        data,
        version,
        tag,
      }));

      await Promise.all(pactObjects.map(this.publishAndTagPact));
      console.log('Successfully published and tagged pacts.');
    } catch (e) {
      console.error('Failed to publish and tag pacts.');
      throw e;
    }
  };

  /**
   * Creates a set of objects that provide context for figuring out
   * whether the consumers from the generated pacts can be deployed
   * to the desired environment.
   * @param {BrokerOperationOptions} options
   * @return {ConsumerDeployContext[]}
   */
  createConsumerContexts = options => {
    const { pactDir, version, tag = 'master' } = options;

    const baseUrl = new URL(path.join(this.url, 'matrix'));
    // Get latest result for each consumer version and provider (cvp) pairing.
    // In other words, checks if the consumer has passed verification with all
    // of its providers on the latest provider versions with the given tag.
    baseUrl.searchParams.append('latestby', 'cvp');
    baseUrl.searchParams.append('latest', true);
    baseUrl.searchParams.append('tag', tag);
    baseUrl.searchParams.append('q[]version', version);

    return this.parsePacts(pactDir).map(data => {
      const consumer = data.consumer.name;
      const url = new URL(baseUrl);
      url.searchParams.append('q[]pacticipant', consumer);
      return { consumer, version, tag, url };
    });
  };

  /**
   * Determines whether a consumer is deployable.
   * @param {ConsumerDeployContext}
   * @return {boolean}
   */
  isConsumerDeployable = async ({ consumer, version, tag, url }) => {
    const response = await fetch(url.toString());
    const { summary, errors } = await response.json();
    const deployable = response.ok && summary?.deployable;

    if (!deployable) {
      console.log(`Can't deploy version ${version} to ${tag}: ${consumer}.`);

      // This error from Pact seems to appear in a specific scenario.
      // Attempted a better error message based on interpretation of that.
      if (errors?.includes('Please provide 1 or more version selectors.')) {
        console.log(`There are no providers currently deployed on ${tag}.`);
      }
    }

    if (summary?.reason) console.log(summary.reason);

    return deployable;
  };

  /**
   * Checks whether all consumers from the generated pacts can be deployed
   * to the desired environment. Throws an error if the check fails.
   * @param {BrokerOperationOptions}
   */
  canDeploy = async options => {
    const requiredOptions = ['pactDir', 'version'];
    let results;

    try {
      requiredOptions.forEach(key => {
        if (!options[key]) throw new Error(`canDeploy: ${key} is required`);
      });

      const consumerContexts = this.createConsumerContexts(options);
      results = await Promise.all(
        consumerContexts.map(this.isConsumerDeployable),
      );
    } catch (e) {
      console.log('Failed to check deployability.');
      throw e;
    }

    const deployable = results.reduce((arr, cur) => arr && cur);
    if (!deployable) {
      throw new Error(
        "Can't deploy. Try again after providers have successfully verified pacts for the consumers that couldn't deploy.",
      );
    }
  };
};
