# Frecency Sort

[![NPM](https://nodei.co/npm/frecency-sort.png)](https://npmjs.org/package/frecency-sort)

Generic frecency sorting solution using localStorage based on the [popular blog post by Slack](https://slack.engineering/a-faster-smarter-quick-switcher/).

To use this library, simply import `sortByFrecency` and `updateFrecencyData` and: 
- Sort your data list by calling `sortByFrecency(query: string, yourList: T[], localStorageKey: string)`
  - This returns your list sorted based on frecency data in localStorage

- Call `updateFrecency(query: string, selectedMatchId: string, localStorageKey: string)` when your user selects an item in the list of data
  - This updates local storage to store the information that the user chose that selected match (with id `selectedMatchId`) after searching for `query`

