import {default as fetchAlias} from './fetchAlias.json';

// intercept and reroute calls
const _fetch = fetch;
export function customFetch() {
  const a = arguments;
  if (a[0] in fetchAlias) a[0] = fetchAlias[a[0]];
  return _fetch(...a);
}
