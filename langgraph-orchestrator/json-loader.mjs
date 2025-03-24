// json-loader.mjs
export async function resolve(specifier, context, nextResolve) {
    return nextResolve(specifier, context);
  }
  
  export async function load(url, context, nextLoad) {
    if (url.endsWith('.json')) {
      // Add assertion for JSON files
      return nextLoad(url, { ...context, importAttributes: { type: 'json' } });
    }
    return nextLoad(url, context);
  }