# Frecency Sort

[![NPM](https://nodei.co/npm/frecency-sort.png)](https://npmjs.org/package/frecency-sort)

Generic frecency sorting solution using localStorage based on the [popular blog post by Slack](https://slack.engineering/a-faster-smarter-quick-switcher/).

To use this library, simply import updateFrecencyData and sortedByFrecency and:
-gmSort your data list by calling `sortedByFrecency(<your_list>)`
- Call `updateFrecency(<selected_item>)`when your user selects an item in the list of data

