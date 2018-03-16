this.workbox = this.workbox || {};
this.workbox.strategies = (function (logger_mjs,cacheNames_mjs,cacheWrapper_mjs,fetchWrapper_mjs,assert_mjs) {
'use strict';

try {
  self.workbox.v['workbox:strategies:3.0.0'] = 1;
} catch (e) {} // eslint-disable-line

/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

const getFriendlyURL = url => {
  const urlObj = new URL(url, location);
  if (urlObj.origin === location.origin) {
    return urlObj.pathname;
  }
  return urlObj.href;
};

var messages = {
  strategyStart: (strategyName, event) => `Using ${strategyName} to respond ` + `to  '${getFriendlyURL(event.request.url)}'`,
  printFinalResponse: response => {
    if (response) {
      logger_mjs.logger.groupCollapsed(`View the final response here.`);
      logger_mjs.logger.unprefixed.log(response);
      logger_mjs.logger.groupEnd();
    }
  }
};

/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

/**
 * An implementation of a [cache-first]{@link https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-falling-back-to-network}
 * request strategy.
 *
 * A cache first strategy is useful for assets that have beeng revisioned,
 * such as URLs like `/styles/example.a8f5f1.css`, since they
 * can be cached for long periods of time.
 *
 * @memberof workbox.strategies
 */
class CacheFirst {
  // TODO: Replace `plugins` parameter link with link to d.g.c.

  /**
   * @param {Object} options
   * @param {string} options.cacheName Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * [workbox-core]{@link workbox.core.cacheNames}.
   * @param {string} options.plugins [Plugins]{@link https://docs.google.com/document/d/1Qye_GDVNF1lzGmhBaUvbgwfBWRQDdPgwUAgsbs8jhsk/edit?usp=sharing}
   * to use in conjunction with this caching strategy.
   * @param {Object} options.fetchOptions Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of all fetch() requests made by this strategy.
   */
  constructor(options = {}) {
    this._cacheName = cacheNames_mjs.cacheNames.getRuntimeName(options.cacheName);
    this._plugins = options.plugins || [];
    this._fetchOptions = options.fetchOptions || null;
  }

  /**
   * This method will perform a request strategy and follows an API that
   * will work with the
   * [Workbox Router]{@link workbox.routing.Router}.
   *
   * @param {Object} input
   * @param {FetchEvent} input.event The fetch event to run this strategy
   * against.
   * @return {Promise<Response>}
   */
  handle({ event }) {
    var _this = this;

    return babelHelpers.asyncToGenerator(function* () {
      const logs = [];
      {
        assert_mjs.assert.isInstance(event, FetchEvent, {
          moduleName: 'workbox-strategies',
          className: 'CacheFirst',
          funcName: 'handle',
          paramName: 'event'
        });
      }

      let response = yield cacheWrapper_mjs.cacheWrapper.match(_this._cacheName, event.request, null, _this._plugins);

      let error;
      if (!response) {
        {
          logs.push(`No response found in the '${_this._cacheName}' cache. ` + `Will respond with a network request.`);
        }
        try {
          response = yield _this._getFromNetwork(event);
        } catch (err) {
          error = err;
        }

        {
          if (response) {
            logs.push(`Got response from network.`);
          } else {
            logs.push(`Unable to get a response from the network.`);
          }
        }
      } else {
        {
          logs.push(`Found a cached response in the '${_this._cacheName}' cache.`);
        }
      }

      {
        logger_mjs.logger.groupCollapsed(messages.strategyStart('CacheFirst', event));
        for (let log of logs) {
          logger_mjs.logger.log(log);
        }
        messages.printFinalResponse(response);
        logger_mjs.logger.groupEnd();
      }

      if (error) {
        // Don't swallow error as we'll want it to throw and enable catch
        // handlers in router.
        throw error;
      }

      return response;
    })();
  }

  /**
   * Handles the network and cache part of CacheFirst.
   *
   * @param {FetchEvent} event
   * @return {Promise<Response>}
   *
   * @private
   */
  _getFromNetwork(event) {
    var _this2 = this;

    return babelHelpers.asyncToGenerator(function* () {
      const response = yield fetchWrapper_mjs.fetchWrapper.fetch(event.request, _this2._fetchOptions, _this2._plugins);

      // Keep the service worker while we put the request to the cache
      const responseClone = response.clone();
      event.waitUntil(cacheWrapper_mjs.cacheWrapper.put(_this2._cacheName, event.request, responseClone, _this2._plugins));

      return response;
    })();
  }
}

/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// TODO: Replace `Workbox plugins` link in the class description with a
// link to d.g.c.
// TODO: Replace `plugins` parameter link with link to d.g.c.

/**
 * An implementation of a
 * [cache-only]{@link https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-only}
 * request strategy.
 *
 * This class is useful if you want to take advantage of any [Workbox plugins]{@link https://docs.google.com/document/d/1Qye_GDVNF1lzGmhBaUvbgwfBWRQDdPgwUAgsbs8jhsk/edit?usp=sharing}.
 *
 * @memberof workbox.strategies
 */
class CacheOnly {
  /**
   * @param {Object} options
   * @param {string} options.cacheName Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * [workbox-core]{@link workbox.core.cacheNames}.
   * @param {string} options.plugins [Plugins]{@link https://docs.google.com/document/d/1Qye_GDVNF1lzGmhBaUvbgwfBWRQDdPgwUAgsbs8jhsk/edit?usp=sharing}
   * to use in conjunction with this caching strategy.
   */
  constructor(options = {}) {
    this._cacheName = cacheNames_mjs.cacheNames.getRuntimeName(options.cacheName);
    this._plugins = options.plugins || [];
  }

  /**
   * This method will perform a request strategy and follows an API that
   * will work with the
   * [Workbox Router]{@link workbox.routing.Router}.
   *
   * @param {Object} input
   * @param {FetchEvent} input.event The fetch event to run this strategy
   * against.
   * @return {Promise<Response>}
   */
  handle({ event }) {
    var _this = this;

    return babelHelpers.asyncToGenerator(function* () {
      {
        assert_mjs.assert.isInstance(event, FetchEvent, {
          moduleName: 'workbox-strategies',
          className: 'CacheOnly',
          funcName: 'handle',
          paramName: 'event'
        });
      }

      const response = yield cacheWrapper_mjs.cacheWrapper.match(_this._cacheName, event.request, null, _this._plugins);

      {
        logger_mjs.logger.groupCollapsed(messages.strategyStart('CacheOnly', event));
        if (response) {
          logger_mjs.logger.log(`Found a cached response in the '${_this._cacheName}'` + ` cache.`);
          messages.printFinalResponse(response);
        } else {
          logger_mjs.logger.log(`No response found in the '${_this._cacheName}' cache.`);
        }
        logger_mjs.logger.groupEnd();
      }

      return response;
    })();
  }
}

/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

var cacheOkAndOpaquePlugin = {
  /**
   * Return return a response (i.e. allow caching) if the
   * response is ok (i.e. 200) or is opaque.
   *
   * @param {Object} input
   * @param {Response} input.response
   * @return {Response|null}
   *
   * @private
   */
  cacheWillUpdate: ({ response }) => {
    if (response.ok || response.status === 0) {
      return response;
    }
    return null;
  }
};

/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// TODO: Change opaque responses to d.g.c link
// TODO: Replace `plugins` parameter link with link to d.g.c.

/**
 * An implementation of a
 * [network first]{@link https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#network-falling-back-to-cache}
 * request strategy.
 *
 * By default, this strategy will cache responses with a 200 status code as
 * well as [opaque responses]{@link https://developers.google.com/web/tools/workbox/guides/handle-third-party-requests}.
 * Opaque responses are are cross-origin requests where the response doesn't
 * support [CORS]{@link https://enable-cors.org/}.
 *
 * @memberof workbox.strategies
 */
class NetworkFirst {
  /**
   * @param {Object} options
   * @param {string} options.cacheName Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * [workbox-core]{@link workbox.core.cacheNames}.
   * @param {string} options.plugins [Plugins]{@link https://docs.google.com/document/d/1Qye_GDVNF1lzGmhBaUvbgwfBWRQDdPgwUAgsbs8jhsk/edit?usp=sharing}
   * to use in conjunction with this caching strategy.
   * @param {Object} options.fetchOptions Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of all fetch() requests made by this strategy.
   * @param {number} options.networkTimeoutSeconds If set, any network requests
   * that fail to respond within the timeout will fallback to the cache.
   *
   * This option can be used to combat
   * "[lie-fi]{@link https://developers.google.com/web/fundamentals/performance/poor-connectivity/#lie-fi}"
   * scenarios.
   */
  constructor(options = {}) {
    this._cacheName = cacheNames_mjs.cacheNames.getRuntimeName(options.cacheName);

    if (options.plugins) {
      let isUsingCacheWillUpdate = options.plugins.some(plugin => !!plugin.cacheWillUpdate);
      this._plugins = isUsingCacheWillUpdate ? options.plugins : [cacheOkAndOpaquePlugin, ...options.plugins];
    } else {
      // No plugins passed in, use the default plugin.
      this._plugins = [cacheOkAndOpaquePlugin];
    }

    this._networkTimeoutSeconds = options.networkTimeoutSeconds;
    {
      if (this._networkTimeoutSeconds) {
        assert_mjs.assert.isType(this._networkTimeoutSeconds, 'number', {
          moduleName: 'workbox-strategies',
          className: 'NetworkFirst',
          funcName: 'constructor',
          paramName: 'networkTimeoutSeconds'
        });
      }
    }

    this._fetchOptions = options.fetchOptions || null;
  }

  /**
   * This method will perform a request strategy and follows an API that
   * will work with the
   * [Workbox Router]{@link workbox.routing.Router}.
   *
   * @param {Object} input
   * @param {FetchEvent} input.event The fetch event to run this strategy
   * against.
   * @return {Promise<Response>}
   */
  handle({ event }) {
    var _this = this;

    return babelHelpers.asyncToGenerator(function* () {
      const logs = [];
      {
        assert_mjs.assert.isInstance(event, FetchEvent, {
          moduleName: 'workbox-strategies',
          className: 'NetworkFirst',
          funcName: 'handle',
          paramName: 'event'
        });
      }

      const promises = [];
      let timeoutId;

      if (_this._networkTimeoutSeconds) {
        const { id, promise } = _this._getTimeoutPromise(event, logs);
        timeoutId = id;
        promises.push(promise);
      }

      const networkPromise = _this._getNetworkPromise(timeoutId, event, logs);
      promises.push(networkPromise);

      // Promise.race() will resolve as soon as the first promise resolves.
      let response = yield Promise.race(promises);
      // If Promise.race() resolved with null, it might be due to a network
      // timeout + a cache miss. If that were to happen, we'd rather wait until
      // the networkPromise resolves instead of returning null.
      // Note that it's fine to await an already-resolved promise, so we don't
      // have to check to see if it's still "in flight".
      if (!response) {
        response = yield networkPromise;
      }

      {
        logger_mjs.logger.groupCollapsed(messages.strategyStart('NetworkFirst', event));
        for (let log of logs) {
          logger_mjs.logger.log(log);
        }
        messages.printFinalResponse(response);
        logger_mjs.logger.groupEnd();
      }

      return response;
    })();
  }

  /**
   * @param {FetchEvent} event
   * @param {Array} logs A reference to the logs array
   * @return {Promise<Response>}
   *
   * @private
   */
  _getTimeoutPromise(event, logs) {
    var _this2 = this;

    let timeoutId;
    const timeoutPromise = new Promise(resolve => {
      const onNetworkTimeout = (() => {
        var _ref = babelHelpers.asyncToGenerator(function* () {
          {
            logs.push(`Timing out the network response at ` + `${_this2._networkTimeoutSeconds} seconds.`);
          }

          resolve((yield _this2._respondFromCache(event.request)));
        });

        return function onNetworkTimeout() {
          return _ref.apply(this, arguments);
        };
      })();

      timeoutId = setTimeout(onNetworkTimeout, this._networkTimeoutSeconds * 1000);
    });

    return {
      promise: timeoutPromise,
      id: timeoutId
    };
  }

  /**
   * @param {number} timeoutId
   * @param {FetchEvent} event
   * @param {Array} logs A reference to the logs Array.
   * @return {Promise<Response>}
   *
   * @private
   */
  _getNetworkPromise(timeoutId, event, logs) {
    var _this3 = this;

    return babelHelpers.asyncToGenerator(function* () {
      let error;
      let response;
      try {
        response = yield fetchWrapper_mjs.fetchWrapper.fetch(event.request, _this3._fetchOptions, _this3._plugins);
      } catch (err) {
        error = err;
      }

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      {
        if (response) {
          logs.push(`Got response from network.`);
        } else {
          logs.push(`Unable to get a response from the network. Will respond ` + `with a cached response.`);
        }
      }

      if (error || !response) {
        response = yield _this3._respondFromCache(event.request);
        {
          if (response) {
            logs.push(`Found a cached response in the '${_this3._cacheName}'` + ` cache.`);
          } else {
            logs.push(`No response found in the '${_this3._cacheName}' cache.`);
          }
        }
      } else {
        // Keep the service worker alive while we put the request in the cache
        const responseClone = response.clone();
        event.waitUntil(cacheWrapper_mjs.cacheWrapper.put(_this3._cacheName, event.request, responseClone, _this3._plugins));
      }

      return response;
    })();
  }

  /**
   * Used if the network timeouts or fails to make the request.
   *
   * @param {Request} request The fetchEvent request to match in the cache
   * @return {Promise<Object>}
   *
   * @private
   */
  _respondFromCache(request) {
    return cacheWrapper_mjs.cacheWrapper.match(this._cacheName, request, null, this._plugins);
  }
}

/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// TODO: Replace `Workbox plugins` link in the class description with a
// link to d.g.c.
// TODO: Replace `plugins` parameter link with link to d.g.c.

/**
 * An implementation of a
 * [network-only]{@link https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#network-only}
 * request strategy.
 *
 * This class is useful if you want to take advantage of any [Workbox plugins]{@link https://docs.google.com/document/d/1Qye_GDVNF1lzGmhBaUvbgwfBWRQDdPgwUAgsbs8jhsk/edit?usp=sharing}.
 *
 * @memberof workbox.strategies
 */
class NetworkOnly {
  /**
   * @param {Object} options
   * @param {string} options.cacheName Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * [workbox-core]{@link workbox.core.cacheNames}.
   * @param {string} options.plugins [Plugins]{@link https://docs.google.com/document/d/1Qye_GDVNF1lzGmhBaUvbgwfBWRQDdPgwUAgsbs8jhsk/edit?usp=sharing}
   * to use in conjunction with this caching strategy.
   * @param {Object} options.fetchOptions Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of all fetch() requests made by this strategy.
   */
  constructor(options = {}) {
    this._cacheName = cacheNames_mjs.cacheNames.getRuntimeName(options.cacheName);
    this._plugins = options.plugins || [];
    this._fetchOptions = options.fetchOptions || null;
  }

  /**
   * This method will perform a request strategy and follows an API that
   * will work with the
   * [Workbox Router]{@link workbox.routing.Router}.
   *
   * @param {Object} input
   * @param {FetchEvent} input.event The fetch event to run this strategy
   * against.
   * @return {Promise<Response>}
   */
  handle({ event }) {
    var _this = this;

    return babelHelpers.asyncToGenerator(function* () {
      {
        assert_mjs.assert.isInstance(event, FetchEvent, {
          moduleName: 'workbox-strategies',
          className: 'NetworkOnly',
          funcName: 'handle',
          paramName: 'event'
        });
      }

      let error;
      let response;
      try {
        response = yield fetchWrapper_mjs.fetchWrapper.fetch(event.request, _this._fetchOptions, _this._plugins);
      } catch (err) {
        error = err;
      }

      {
        logger_mjs.logger.groupCollapsed(messages.strategyStart('NetworkOnly', event));
        if (response) {
          logger_mjs.logger.log(`Got response from network.`);
        } else {
          logger_mjs.logger.log(`Unable to get a response from the network.`);
        }
        messages.printFinalResponse(response);
        logger_mjs.logger.groupEnd();
      }

      // If there was an error thrown, re-throw it to ensure the Routers
      // catch handler is triggered.
      if (error) {
        throw error;
      }

      return response;
    })();
  }
}

/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// TODO: Replace `Workbox plugins` link in the class description with a
// link to d.g.c.
// TODO: Replace `plugins` parameter link with link to d.g.c.

/**
 * An implementation of a
 * [stale-while-revalidate]{@link https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate}
 * request strategy.
 *
 * Resources are requested from both the cache and the network in parallel.
 * The strategy will respond with the cached version if available, otherwise
 * wait for the network response. The cache is updated with the network response
 * with each successful request.
 *
 * By default, this strategy will cache responses with a 200 status code as
 * well as [opaque responses]{@link https://developers.google.com/web/tools/workbox/guides/handle-third-party-requests}.
 * Opaque responses are are cross-origin requests where the response doesn't
 * support [CORS]{@link https://enable-cors.org/}.
 *
 * @memberof workbox.strategies
 */
class StaleWhileRevalidate {
  /**
   * @param {Object} options
   * @param {string} options.cacheName Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * [workbox-core]{@link workbox.core.cacheNames}.
   * @param {string} options.plugins [Plugins]{@link https://docs.google.com/document/d/1Qye_GDVNF1lzGmhBaUvbgwfBWRQDdPgwUAgsbs8jhsk/edit?usp=sharing}
   * to use in conjunction with this caching strategy.
   * @param {Object} options.fetchOptions Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of all fetch() requests made by this strategy.
   */
  constructor(options = {}) {
    this._cacheName = cacheNames_mjs.cacheNames.getRuntimeName(options.cacheName);
    this._plugins = options.plugins || [];

    if (options.plugins) {
      let isUsingCacheWillUpdate = options.plugins.some(plugin => !!plugin.cacheWillUpdate);
      this._plugins = isUsingCacheWillUpdate ? options.plugins : [cacheOkAndOpaquePlugin, ...options.plugins];
    } else {
      // No plugins passed in, use the default plugin.
      this._plugins = [cacheOkAndOpaquePlugin];
    }

    this._fetchOptions = options.fetchOptions || null;
  }

  /**
   * This method will perform a request strategy and follows an API that
   * will work with the
   * [Workbox Router]{@link workbox.routing.Router}.
   *
   * @param {Object} input
   * @param {FetchEvent} input.event The fetch event to run this strategy
   * against.
   * @return {Promise<Response>}
   */
  handle({ event }) {
    var _this = this;

    return babelHelpers.asyncToGenerator(function* () {
      const logs = [];
      {
        assert_mjs.assert.isInstance(event, FetchEvent, {
          moduleName: 'workbox-strategies',
          className: 'StaleWhileRevalidate',
          funcName: 'handle',
          paramName: 'event'
        });
      }

      const fetchAndCachePromise = _this._getFromNetwork(event);

      let response = yield cacheWrapper_mjs.cacheWrapper.match(_this._cacheName, event.request, null, _this._plugins);

      if (response) {
        {
          logs.push(`Found a cached response in the '${_this._cacheName}'` + ` cache. Will update with the network response in the background.`);
        }
        event.waitUntil(fetchAndCachePromise);
      } else {
        {
          logs.push(`No response found in the '${_this._cacheName}' cache. ` + `Will wait for the network response.`);
        }
        response = yield fetchAndCachePromise;
      }

      {
        logger_mjs.logger.groupCollapsed(messages.strategyStart('StaleWhileRevalidate', event));
        for (let log of logs) {
          logger_mjs.logger.log(log);
        }
        messages.printFinalResponse(response);
        logger_mjs.logger.groupEnd();
      }

      return response;
    })();
  }

  /**
   * @param {FetchEvent} event
   * @return {Promise<Response>}
   *
   * @private
   */
  _getFromNetwork(event) {
    var _this2 = this;

    return babelHelpers.asyncToGenerator(function* () {
      const response = yield fetchWrapper_mjs.fetchWrapper.fetch(event.request, _this2._fetchOptions, _this2._plugins);

      event.waitUntil(cacheWrapper_mjs.cacheWrapper.put(_this2._cacheName, event.request, response.clone(), _this2._plugins));

      return response;
    })();
  }
}

/*
  Copyright 2017 Google Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/


var publicAPI = Object.freeze({
	CacheFirst: CacheFirst,
	CacheOnly: CacheOnly,
	NetworkFirst: NetworkFirst,
	NetworkOnly: NetworkOnly,
	StaleWhileRevalidate: StaleWhileRevalidate
});

/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

/**
 * @function workbox.strategies.cacheFirst
 * @param {workbox.strategies.StrategyOptions} options
 */

/**
 * @function workbox.strategies.cacheOnly
 * @param {workbox.strategies.StrategyOptions} options
 */

/**
 * @function workbox.strategies.networkFirst
 * @param {workbox.strategies.StrategyOptions} options
 */

/**
 * @function workbox.strategies.networkOnly
 * @param {workbox.strategies.StrategyOptions} options
 */

/**
 * @function workbox.strategies.staleWhileRevalidate
 * @param {workbox.strategies.StrategyOptions} options
 */

const mapping = {
  cacheFirst: CacheFirst,
  cacheOnly: CacheOnly,
  networkFirst: NetworkFirst,
  networkOnly: NetworkOnly,
  staleWhileRevalidate: StaleWhileRevalidate
};

const defaultExport = {};
Object.keys(mapping).forEach(keyName => {
  defaultExport[keyName] = (options = {}) => {
    const StrategyClass = mapping[keyName];
    return new StrategyClass(Object.assign(options));
  };
});

/*
  Copyright 2017 Google Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

const finalExport = Object.assign(defaultExport, publicAPI);

return finalExport;

}(workbox.core._private,workbox.core._private,workbox.core._private,workbox.core._private,workbox.core._private));

//# sourceMappingURL=workbox-strategies.dev.js.map
