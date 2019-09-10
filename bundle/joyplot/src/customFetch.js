const fetchAlias = {
  'https://gist.githubusercontent.com/borgar/31c1e476b8e92a11d7e9/raw/0fae97dab6830ecee185a63c1cee0008f6778ff6/pulsar.csv':
    'data/pulsar.csv',
};

// intercept and reroute calls
const _fetch = fetch;
export function customFetch() {
  const a = arguments;
  if (a[0] in fetchAlias) a[0] = fetchAlias[a[0]];
  return _fetch(...a);
}
