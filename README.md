dpj-moniker
=======
### overview
what is this?
--------------------------------------
this is a utility that helps with english name/salutation/suffix parsing. this library will parse names in the following formats :
- "john doe" (standard) 
- "doe, john" (surname first, separated by comma) 
- "doe, john & jane" (surname first, multiple firstnames separated by 'and|&|or') 
- "doe, john & dae, jane" (multiple names in BYLAST format separated by 'and|&|or')
- "john or jane doe" (multiple firstnames separated by '&/and/or', more or less in STANDARD format) 

why?
--------------------------------------
i needed to convert a long list of names with no firstname/lastname fields (~3000) into a normalized database with first, middle and last names all needed (middlename optional of course), each one of the primary entries had 0, 1, 2, or 3 emergency contacts that also needed to placed in the database as regular entries but linked to the original entries. i noticed a few patterns apparent in most of the ~10k entries and automated the process. it's served it's purpose, and hopefully this can become more thorough and useful to others in the future. 

you can read more the background the project that required moniker and my approach [at this blog post](http://dennisporterjr.com/moniker/)

### getting started
installation
--------------------------------------
you can install moniker by running this command..
```shell
npm install dpj-moniker
```

use
--------------------------------------
```js
var moniker = require('dpj-moniker');

// parse a single name...
moniker.parse('Tony Edward Stark'); 
// => { firstname : 'Tony', middlename : 'Edward', lastname : 'Stark' }

// parse several names...
moniker.parse([
    'Potts, Pepper',
    'Storm, Sue & Johnny',
    'Mario or Luigi Mario'
]);
/*
=> [
    { firstname : 'Pepper', lastname : 'Potts' },
    { firstname : 'Sue', lastname : 'Storm' },
    { firstname : 'Johnny', lastname : 'Storm' },
    { firstname : 'Mario', lastname : 'Mario' },
    { firstname : 'Luigi', lastname : 'Mario' }
  ]
*/
```
## contributing
i don't know what to put here.
