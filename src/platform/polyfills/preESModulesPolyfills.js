/*
 * This file contains polyfills for browsers that don't support
 * the "nomodule" script attribute. These are generally older browsers
 * like IE 11 that need more polyfills than the more common, newer versions
 * of evergreen browsers
 *
 */

// This section is for custom polyfills that we need
import 'classlist-polyfill'; // DOM element classList support.

/*
 * This section is all of the core-js polyfills we need.
 *
 * To recreate this list:
 *
 * 1. Switch the list of browsers in babelrc to the full, older list
 * 2. Set debug to true in babelrc
 * 3. Run a build and get the list of polyfills included in @babel/polyfill from the terminal output
 * 4. Switch the browsers list back to the newer list and run another build
 * 5. Remove the polyfills listed in the second list from the first
 * 6. Now you have the full list and you can format them into import statements with some
 *   regex work
 */
import 'core-js/modules/es.symbol'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.symbol.has-instance'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.symbol.is-concat-spreadable'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.symbol.iterator'; // { "ie":"11" }
import 'core-js/modules/es.symbol.species'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.symbol.to-primitive'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.symbol.to-string-tag'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.symbol.unscopables'; // { "ie":"11" }
import 'core-js/modules/es.array.concat'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.array.copy-within'; // { "ie":"11" }
import 'core-js/modules/es.array.every'; // { "edge":"14", "ie":"11" }
import 'core-js/modules/es.array.fill'; // { "ie":"11" }
import 'core-js/modules/es.array.filter'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.array.find'; // { "ie":"11" }
import 'core-js/modules/es.array.find-index'; // { "ie":"11" }
import 'core-js/modules/es.array.for-each'; // { "edge":"14", "ie":"11" }
import 'core-js/modules/es.array.from'; // { "edge":"14", "ie":"11" }
import 'core-js/modules/es.array.includes'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.array.index-of'; // { "edge":"14", "ie":"11", "ios":"9", "safari":"10" }
import 'core-js/modules/es.array.iterator'; // {"ie":"11"}
import 'core-js/modules/es.array.join'; // { "ie":"11" }
import 'core-js/modules/es.array.last-index-of'; // { "ie":"11", "ios":"9", "safari":"10" }
import 'core-js/modules/es.array.map'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.array.of'; // { "ie":"11" }
import 'core-js/modules/es.array.reduce'; // { "edge":"14", "ie":"11" }
import 'core-js/modules/es.array.reduce-right'; // { "edge":"14", "ie":"11" }
import 'core-js/modules/es.array.slice'; // { "edge":"14", "ie":"11", "ios":"9", "safari":"10" }
import 'core-js/modules/es.array.some'; // { "edge":"14", "ie":"11" }
import 'core-js/modules/es.array.species'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.array.splice'; // { "edge":"14", "ie":"11", "ios":"9", "safari":"10" }
import 'core-js/modules/es.date.to-json'; // { "ios":"9" }
import 'core-js/modules/es.date.to-primitive'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.function.has-instance'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.function.name'; // { "ie":"11" }
import 'core-js/modules/es.json.to-string-tag'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.map'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.math.acosh'; // { "ie":"11" }
import 'core-js/modules/es.math.asinh'; // { "ie":"11" }
import 'core-js/modules/es.math.atanh'; // { "ie":"11" }
import 'core-js/modules/es.math.cbrt'; // { "ie":"11" }
import 'core-js/modules/es.math.clz32'; // { "ie":"11" }
import 'core-js/modules/es.math.cosh'; // { "ie":"11" }
import 'core-js/modules/es.math.expm1'; // { "ie":"11" }
import 'core-js/modules/es.math.fround'; // { "ie":"11" }
import 'core-js/modules/es.math.hypot'; // {"ie":"11"}
import 'core-js/modules/es.math.imul'; // { "ie":"11" }
import 'core-js/modules/es.math.log10'; // { "ie":"11" }
import 'core-js/modules/es.math.log1p'; // { "ie":"11" }
import 'core-js/modules/es.math.log2'; // { "ie":"11" }
import 'core-js/modules/es.math.sign'; // { "ie":"11" }
import 'core-js/modules/es.math.sinh'; // { "ie":"11" }
import 'core-js/modules/es.math.tanh'; // { "ie":"11" }
import 'core-js/modules/es.math.to-string-tag'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.math.trunc'; // { "ie":"11" }
import 'core-js/modules/es.number.constructor'; // { "ie":"11" }
import 'core-js/modules/es.number.epsilon'; // { "ie":"11" }
import 'core-js/modules/es.number.is-finite'; // { "ie":"11" }
import 'core-js/modules/es.number.is-integer'; // { "ie":"11" }
import 'core-js/modules/es.number.is-nan'; // { "ie":"11" }
import 'core-js/modules/es.number.is-safe-integer'; // { "ie":"11" }
import 'core-js/modules/es.number.max-safe-integer'; // { "ie":"11" }
import 'core-js/modules/es.number.min-safe-integer'; // { "ie":"11" }
import 'core-js/modules/es.number.parse-float'; // { "ie":"11", "ios":"9", "safari":"10" }
import 'core-js/modules/es.number.parse-int'; // { "ie":"11" }
import 'core-js/modules/es.object.assign'; // {"ie":"11"}
import 'core-js/modules/es.object.entries'; // { "ie":"11", "ios":"9", "safari":"10" }
import 'core-js/modules/es.object.freeze'; // { "ie":"11" }
import 'core-js/modules/es.object.get-own-property-descriptor'; // { "ie":"11" }
import 'core-js/modules/es.object.get-own-property-descriptors'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.object.get-own-property-names'; // { "ie":"11" }
import 'core-js/modules/es.object.get-prototype-of'; // { "ie":"11" }
import 'core-js/modules/es.object.is'; // { "ie":"11" }
import 'core-js/modules/es.object.is-extensible'; // { "ie":"11" }
import 'core-js/modules/es.object.is-frozen'; // { "ie":"11" }
import 'core-js/modules/es.object.is-sealed'; // { "ie":"11" }
import 'core-js/modules/es.object.keys'; // { "ie":"11" }
import 'core-js/modules/es.object.prevent-extensions'; // { "ie":"11" }
import 'core-js/modules/es.object.seal'; // { "ie":"11" }
import 'core-js/modules/es.object.to-string'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.object.values'; // { "ie":"11", "ios":"9", "safari":"10" }
import 'core-js/modules/es.promise'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es.reflect.apply'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.reflect.construct'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.reflect.define-property'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.reflect.delete-property'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.reflect.get'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.reflect.get-own-property-descriptor'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.reflect.get-prototype-of'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.reflect.has'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.reflect.is-extensible'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.reflect.own-keys'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.reflect.prevent-extensions'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.reflect.set'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es.reflect.set-prototype-of'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.regexp.exec'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.regexp.sticky'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.set'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.string.code-point-at'; // { "ie":"11" }
import 'core-js/modules/es.string.ends-with'; // {"ie":"11"}
import 'core-js/modules/es.string.from-code-point'; // { "ie":"11" }
import 'core-js/modules/es.string.includes'; // {"ie":"11"}
import 'core-js/modules/es.string.iterator'; // { "ie":"11" }
import 'core-js/modules/es.string.pad-end'; // { "edge":"14", "ie":"11", "ios":"9", "safari":"10" }
import 'core-js/modules/es.string.pad-start'; // { "edge":"14", "ie":"11", "ios":"9", "safari":"10" }
import 'core-js/modules/es.string.raw'; // { "ie":"11" }
import 'core-js/modules/es.string.repeat'; // { "ie":"11" }
import 'core-js/modules/es.string.anchor'; // { "ie":"11" }
import 'core-js/modules/es.string.big'; // { "ie":"11" }
import 'core-js/modules/es.string.blink'; // { "ie":"11" }
import 'core-js/modules/es.string.bold'; // { "ie":"11" }
import 'core-js/modules/es.string.fixed'; // { "ie":"11" }
import 'core-js/modules/es.string.fontcolor'; // { "ie":"11" }
import 'core-js/modules/es.string.fontsize'; // { "ie":"11" }
import 'core-js/modules/es.string.italics'; // { "ie":"11" }
import 'core-js/modules/es.string.link'; // { "ie":"11" }
import 'core-js/modules/es.string.small'; // { "ie":"11" }
import 'core-js/modules/es.string.starts-with'; // {"ie":"11"}
import 'core-js/modules/es.string.strike'; // { "ie":"11" }
import 'core-js/modules/es.string.sub'; // { "ie":"11" }
import 'core-js/modules/es.string.sup'; // { "ie":"11" }
import 'core-js/modules/es.typed-array.copy-within'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.every'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.fill'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.filter'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.find'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.find-index'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.float32-array'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es.typed-array.float64-array'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es.typed-array.for-each'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.includes'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.index-of'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.int16-array'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es.typed-array.int32-array'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es.typed-array.int8-array'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es.typed-array.iterator'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.join'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.last-index-of'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.map'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.reduce'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.reduce-right'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.reverse'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.set'; // { "ie":"11" }
import 'core-js/modules/es.typed-array.slice'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.some'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.sort'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.subarray'; // { "ie":"11" }
import 'core-js/modules/es.typed-array.to-string'; // { "ie":"11", "ios":"9" }
import 'core-js/modules/es.typed-array.uint16-array'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es.typed-array.uint32-array'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es.typed-array.uint8-array'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es.typed-array.uint8-clamped-array'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es.weak-map'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/es.weak-set'; // { "edge":"14", "ie":"11", "ios":"9" }
import 'core-js/modules/web.dom-collections.for-each'; // { "edge":"14", "ie":"11", "ios":"9" }

/**
 * This section is for Intl.DateTimeFormat polyfills. Needed for date-fns-tz to
 * function on IE11.
 *
 * The first two are pre-requisites for polyfilling Intl.DateTimeFormat, which
 * is the one that's actually needed for date-fns-tz.
 */
import '@formatjs/intl-getcanonicallocales/polyfill';
import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-datetimeformat/polyfill';
// Rather than adding all the timezone data (which is a LOT)...
//     import '@formatjs/intl-datetimeformat/locale-data/en'; // locale-data for en
//     import '@formatjs/intl-datetimeformat/add-all-tz';
// ...only add the minimum required data for EST/EDT
import './polyfill-timezone-data';

// Polyfill for childNode.remove() - https://caniuse.com/childnode-remove
import 'element-remove';
