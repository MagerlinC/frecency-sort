# Frecency Sort

[![NPM](https://nodei.co/npm/frecency-sort.png)](https://npmjs.org/package/frecency-sort)

Generic frecency sorting solution using localStorage based on the [popular blog post by Slack](https://slack.engineering/a-faster-smarter-quick-switcher/).


## Table of Contents
- [What is frecency?](#what-is-frecency?)
- [Installation](#installation)
- [Using this library](#using-this-library)
  - [A note on text searching](#a-note-on-text-searching)
  - [Implementation example](#implementation-example)
  - [Storing frecency data](#storing-frecency-data)
    - [Shouldn't frecency calculations happen in the API, and be stored in a DB?](#shouldnt-frecency-calculations-happen-in-the-api-and-be-stored-in-a-db)

## What is frecency?
"Frecency" is a term which combines "recency" and "frequency". While I can recommend the above post for a more in-depth explanation, essentially this algorithm sorts options in a list based on a mix of how much they are used, and how frequently they are used.

The aim of this approach is to offer the user a selection of items which seems to learn from their behaviour, shortening the user's time to find what they need.

## Installation
To get started, install by running 
```bash
npm i frecency-sort
``` 
(replace with package manager of your choice).

## Using this library
This library will sort a given list of options by the frecency with which each option has been picked for a given search query.

As an example, if a user searches for "John" and initially sees the following options:
- John Cena
- John Doe

They might be frustrated if they always want "John Doe" and have to click/scroll to the 2nd option.

Frecency allows us to "remember" that the search for "John" resulted in the user selecting "John Doe", 
letting us prioritize "John Doe" the next time "John" is searched for.

### A note on text searching
Frecency does not perform filtering/searching of options, only ordering. 

As such, for most common use cases, you will probably want to filter your list of options before passing them to `sortByFrecency`, 
usually based on some (potentially fuzzy) text matching. 

In the example above, the part where searching for "John" results in the two options of "John Cena" and "John Doe" should be part of your own business logic.

### Implementation example 

A generic implementation, including basic searching, could look something like this:

```typescript
const myLocalStorageKey = "my-frecency-data"
const users = [{matchingId: "some-guid", name: "John Cena"},{matchingId: "some-other-guid", name: "John Doe"}]  
const searchQuery = "John"
const matchingUsers = users.filter(u => u.name.includes(searchQuery))
const sortedUsers = sortByFrecency(searchQuery, matchingUsers, myLocalStorageKey)
```

Note that the above code will always return the same (original) order until you start storing frecency data:

### Storing frecency data
Frecency sorting only makes sense if we have some data about the user's behaviour. Therefore, this library exposes `updateFrecencyData()`, 
which you are expected to call whenever a user selects an option.

To continue the above code example, when redering `sortedUsers`, you would most likely do something like this:
```typescript
sortedUsers.map(user => 
    <div 
        key={user.id}
        onClick={() => {
            updateFrecencyData(searchQuery, user.id, myLocalStorageKey) // Update frecency data for future searches
            selectUser(user) // Whatever business logic you need when an option is clicked
        }}
    >
        {user.name}
    </div>
)
```

#### Shouldn't frecency calculations happen in the API, and be stored in a DB?

This library simply uses localStorage in the user's browser to store frecency information. This is easy to use and works especially well for cases where the data set is always known in full on the frontend.
Examples include:
- Navigation options (pages)
- Any smaller set of data which isn't paginated (user favourites, team members etc.)

If you want to get the most frecent sub-set of a larger dataset, you're better off implementing frecency in your API directly, and storing frecency data in a DB.
