function makeInfallible(fn, thisv) {
  return (...args) => {
    try {
      fn.apply(thisv, args);
    } catch (e) {
      console.error(e);
    }
  };
}

function defer() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function throttle(callback, time) {
  let scheduled = false;
  return () => {
    if (scheduled) {
      return;
    }
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      callback();
    }, time);
  };
}

function clamp(value, min, max) {
  assert(min < max);
  return Math.max(min, Math.min(max, value));
}

function assert(v, msg = "Assertion failed!") {
  if (!v) {
    console.error(msg);
    throw new Error(msg);
  }
}

function binarySearch(start, end, callback) {
  while (start + 1 < end) {
    const mid = ((start + end) / 2) | 0;
    const rv = callback(mid);
    if (rv < 0) {
      end = mid;
    } else {
      start = mid;
    }
  }
  return start;
}

function NotAllowed() {
  console.error("Not allowed");
}

const DisallowEverythingProxyHandler = {
  getPrototypeOf() {
    NotAllowed();
  },
  has() {
    NotAllowed();
  },
  get(_, name) {
    NotAllowed();
  },
  //set() { NotAllowed(); },
  apply() {
    NotAllowed();
  },
  construct() {
    NotAllowed();
  },
  getOwnPropertyDescriptor() {
    NotAllowed();
  },
  ownKeys() {
    NotAllowed();
  },
  isExtensible() {
    NotAllowed();
  },
  setPrototypeOf() {
    NotAllowed();
  },
  preventExtensions() {
    NotAllowed();
  },
  defineProperty() {
    NotAllowed();
  },
  deleteProperty() {
    NotAllowed();
  },
};

const EventEmitter = {
  decorate(obj) {
    obj.eventListeners = new Map();

    obj.on = (name, handler) => {
      if (obj.eventListeners.has(name)) {
        obj.eventListeners.get(name).push(handler);
      } else {
        obj.eventListeners.set(name, [handler]);
      }
    };

    obj.off = (name, handler) => {
      obj.eventListeners.set(
        name,
        (obj.eventListeners.get(name) || []).filter(h => h != handler)
      );
    };

    obj.emit = (name, value) => {
      (obj.eventListeners.get(name) || []).forEach(handler => handler(value));
    };
  },
};

// Map from keys to arrays of values.
function ArrayMap() {
  this.map = new Map();
}

ArrayMap.prototype = {
  add(key, value) {
    if (this.map.has(key)) {
      this.map.get(key).push(value);
    } else {
      this.map.set(key, [value]);
    }
  },
};

module.exports = {
  makeInfallible,
  defer,
  throttle,
  clamp,
  assert,
  binarySearch,
  DisallowEverythingProxyHandler,
  EventEmitter,
  ArrayMap,
};
