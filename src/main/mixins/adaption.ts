interface CustomDescriptor {
  [propsname: string]: any;
}

type DesType = 'class' | 'method';

function getOwnKeys(object: any) {
  const symbolKeys = Object.getOwnPropertySymbols(object).map((item) =>
    item.toString()
  );

  return Object.getOwnPropertyNames(object).concat(symbolKeys);
}

function getOwnPropertyDescriptors(obj: Function) {
  let descs: CustomDescriptor = {};

  getOwnKeys(obj).forEach((key) => {
    return (descs[key] = Object.getOwnPropertyDescriptor(obj, key));
  });

  return descs;
}

function autoClass(fn: Function, klass: Function, ...rest: any[]) {
  const descs = getOwnPropertyDescriptors(klass.prototype);

  const keys = getOwnKeys(descs);

  keys.forEach((key) => {
    let desc = descs[key];

    if (typeof desc.value === 'function' && key !== 'constructor') {
      const descriptor: PropertyDescriptor = fn(
        klass.prototype,
        key,
        desc,
        ...rest
      );

      Object.defineProperty(klass.prototype, key, descriptor);
    }
  });
}

function handleDescriptor(fn: Function, desType: DesType, args: any[]) {
  if (desType === 'class') {
    autoClass.apply(undefined, [fn, args[0], ...args.splice(1)]);
  } else {
    return fn.apply(undefined, [...args]);
  }
}

function isDescriptor(desc: any) {
  if (!desc || !desc.hasOwnProperty) {
    return false;
  }

  const keys = ['value', 'initializer', 'get', 'set'];

  for (let i = 0, l = keys.length; i < l; i++) {
    if (desc.hasOwnProperty(keys[i])) {
      return true;
    }
  }

  return false;
}

function hasParameters(target: any) {
  return typeof target !== 'function' && !isDescriptor(target);
}

export default function adaption(fn: Function) {
  if (typeof fn !== 'function') {
    new TypeError('params has function');
  }

  return function (...args: any[]) {
    if (!hasParameters(args[args.length - 1])) {
      return handleDescriptor(fn, args.length === 1 ? 'class' : 'method', args);
    } else {
      return function () {
        const toArgs = Array.prototype.slice.call(arguments);

        return handleDescriptor(
          fn,
          toArgs.length === 1 ? 'class' : 'method',
          toArgs.concat(args)
        );
      };
    }
  };
}
