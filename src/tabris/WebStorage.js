import {types} from './property-types';
import NativeObject from './NativeObject';

class ClientStore extends NativeObject.extend({
  _cid: 'tabris.ClientStore'
}) {}

class SecureStore extends NativeObject.extend({
  _cid: 'tabris.SecureStore'
}) {}

let encode = types.string.encode;

export default class WebStorage {

  constructor() {
    let proxy = arguments[0];
    if (!(proxy instanceof NativeObject)) {
      throw new Error('Cannot instantiate WebStorage');
    }
    Object.defineProperty(this, '_proxy', {value: proxy});
  }

  // Note: key and length methods currently not supported

  setItem(key, value) {
    if (arguments.length < 2) {
      throw new TypeError("Not enough arguments to 'setItem'");
    }
    this._proxy._nativeCall('add', {
      key: encode(key),
      value: encode(value)
    });
  }

  getItem(key) {
    if (arguments.length < 1) {
      throw new TypeError("Not enough arguments to 'getItem'");
    }
    let result = this._proxy._nativeCall('get', {key: encode(key)});
    // Note: iOS can not return null, only undefined:
    return result === undefined ? null : result;
  }

  removeItem(key) {
    if (arguments.length < 1) {
      throw new TypeError("Not enough arguments to 'removeItem'");
    }
    this._proxy._nativeCall('remove', {keys: [encode(key)]});
  }

  clear() {
    this._proxy._nativeCall('clear');
  }

}

export function create(secure) {
  let proxy = secure ? new SecureStore() : new ClientStore();
  return new WebStorage(proxy);
}
