# Frecency Sort

[![NPM](https://nodei.co/npm/frecency-sort.png)](https://npmjs.org/package/frecency-sort)

Generic frecency sorting solution using localStorage based on the [popular blog post by Slack](https://slack.engineering/a-faster-smarter-quick-switcher/).

## What is frecency?

"Frecency" is a term which combines "recency" and "frequency". While I can recommend the above post for a more in-depth explanation, essentially this algorithm sorts options in a list based on a mix of how much they are used, and how frequently they are used.

The aim of this approach is to offer the user a selection of items which seems to learn from their behaviour, shortening searching time.

## Using this library

First, install by running 
```bash npm i frecency-sort``` (replace with package manager of your choice).

Then simply import `sortByFrecency` and `updateFrecencyData` and: 
- Sort your data list by calling `sortByFrecency(query: string, yourList: T[], localStorageKey: string)`
  - This returns your list sorted based on frecency data in localStorage. If no data exists, the original order will be preserved.

- Call `updateFrecency(query: string, selectedMatchId: string, localStorageKey: string)` when your user selects an item in the list of data
  - This updates local storage to store the information that the user chose that selected match (with id `selectedMatchId`) after searching for `query`

