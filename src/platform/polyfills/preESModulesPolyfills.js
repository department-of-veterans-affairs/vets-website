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
import 'core-js/modules/es6.typed.array-buffer'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.typed.int8-array'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.typed.uint8-array'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.typed.uint8-clamped-array'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.typed.int16-array'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.typed.uint16-array'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.typed.int32-array'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.typed.uint32-array'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.typed.float32-array'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.typed.float64-array'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.map'; // {"edge":"14","ie":"11","ios":"9"}
import 'core-js/modules/es6.set'; // {"edge":"14","ie":"11","ios":"9"}
import 'core-js/modules/es6.weak-map'; // {"edge":"14","ie":"11"}
import 'core-js/modules/es6.weak-set'; // {"edge":"14","ie":"11"}
import 'core-js/modules/es6.reflect.apply'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.reflect.construct'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.reflect.define-property'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.reflect.delete-property'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.reflect.get'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.reflect.get-own-property-descriptor'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.reflect.get-prototype-of'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.reflect.has'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.reflect.is-extensible'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.reflect.own-keys'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.reflect.prevent-extensions'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.reflect.set'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.reflect.set-prototype-of'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.promise'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es6.symbol'; // {"edge":"14","ie":"11","ios":"9"}
import 'core-js/modules/es6.object.freeze'; // {"ie":"11"}
import 'core-js/modules/es6.object.seal'; // {"ie":"11"}
import 'core-js/modules/es6.object.prevent-extensions'; // {"ie":"11"}
import 'core-js/modules/es6.object.is-frozen'; // {"ie":"11"}
import 'core-js/modules/es6.object.is-sealed'; // {"ie":"11"}
import 'core-js/modules/es6.object.is-extensible'; // {"ie":"11"}
import 'core-js/modules/es6.object.get-own-property-descriptor'; // {"ie":"11"}
import 'core-js/modules/es6.object.get-prototype-of'; // {"ie":"11"}
import 'core-js/modules/es6.object.keys'; // {"ie":"11"}
import 'core-js/modules/es6.object.get-own-property-names'; // {"ie":"11"}
import 'core-js/modules/es6.object.assign'; // {"ie":"11"}
import 'core-js/modules/es6.object.is'; // {"ie":"11"}
import 'core-js/modules/es6.string.raw'; // {"ie":"11"}
import 'core-js/modules/es6.string.from-code-point'; // {"ie":"11"}
import 'core-js/modules/es6.string.code-point-at'; // {"ie":"11"}
import 'core-js/modules/es6.string.repeat'; // {"ie":"11"}
import 'core-js/modules/es6.string.starts-with'; // {"ie":"11"}
import 'core-js/modules/es6.string.ends-with'; // {"ie":"11"}
import 'core-js/modules/es6.string.includes'; // {"ie":"11"}
import 'core-js/modules/es6.array.from'; // {"edge":"14","ie":"11","ios":"9"}
import 'core-js/modules/es6.array.of'; // {"ie":"11"}
import 'core-js/modules/es6.array.copy-within'; // {"ie":"11"}
import 'core-js/modules/es6.array.find'; // {"ie":"11"}
import 'core-js/modules/es6.array.find-index'; // {"ie":"11"}
import 'core-js/modules/es6.array.fill'; // {"ie":"11"}
import 'core-js/modules/es6.array.iterator'; // {"ie":"11"}
import 'core-js/modules/es6.number.is-finite'; // {"ie":"11"}
import 'core-js/modules/es6.number.is-integer'; // {"ie":"11"}
import 'core-js/modules/es6.number.is-safe-integer'; // {"ie":"11"}
import 'core-js/modules/es6.number.is-nan'; // {"ie":"11"}
import 'core-js/modules/es6.number.epsilon'; // {"ie":"11"}
import 'core-js/modules/es6.number.min-safe-integer'; // {"ie":"11"}
import 'core-js/modules/es6.number.max-safe-integer'; // {"ie":"11"}
import 'core-js/modules/es6.math.acosh'; // {"ie":"11"}
import 'core-js/modules/es6.math.asinh'; // {"ie":"11"}
import 'core-js/modules/es6.math.atanh'; // {"ie":"11"}
import 'core-js/modules/es6.math.cbrt'; // {"ie":"11"}
import 'core-js/modules/es6.math.clz32'; // {"ie":"11"}
import 'core-js/modules/es6.math.cosh'; // {"ie":"11"}
import 'core-js/modules/es6.math.expm1'; // {"ie":"11"}
import 'core-js/modules/es6.math.fround'; // {"ie":"11"}
import 'core-js/modules/es6.math.hypot'; // {"ie":"11"}
import 'core-js/modules/es6.math.imul'; // {"ie":"11"}
import 'core-js/modules/es6.math.log1p'; // {"ie":"11"}
import 'core-js/modules/es6.math.log10'; // {"ie":"11"}
import 'core-js/modules/es6.math.log2'; // {"ie":"11"}
import 'core-js/modules/es6.math.sign'; // {"ie":"11"}
import 'core-js/modules/es6.math.sinh'; // {"ie":"11"}
import 'core-js/modules/es6.math.tanh'; // {"ie":"11"}
import 'core-js/modules/es6.math.trunc'; // {"ie":"11"}
import 'core-js/modules/es7.array.includes'; // {"ie":"11","ios":"9"}
import 'core-js/modules/es7.object.values'; // {"ie":"11","ios":"9","safari":"10"}
import 'core-js/modules/es7.object.entries'; // {"ie":"11","ios":"9","safari":"10"}
import 'core-js/modules/es7.object.get-own-property-descriptors'; // {"edge":"14","ie":"11","ios":"9","safari":"10"}
import 'core-js/modules/es7.string.pad-start'; // {"edge":"14","ie":"11","ios":"9"}
import 'core-js/modules/es7.string.pad-end'; // {"edge":"14","ie":"11","ios":"9"}
