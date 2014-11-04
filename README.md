dpj-moniker
=======
### overview
what is this?
--------------------------------------
this is a utility that helps with english name/salutation/suffix parsing. this library will parse names in the following formats :
- "john doe" (standard) //STANDARD
- "doe, john" (surname first, separated by comma) // BYLAST
- "doe, john & jane" (surname first, multiple firstnames separated by '&') // TWO-BY-LAST
- "doe, john & dae, jane" (multiple names in BYLAST format separated by '&') // BY-LAST-TWO
- "john or jane doe" (multiple firstnames separated by '&/and/or', more or less in STANDARD format) // TWO-STANDARD-AND-OR

why?
--------------------------------------
i needed to convert a long list of names with no firstname/lastname fields (~3000) into a normalized database with first, middle and last names all preferred. beyond the 3000 entries, each one of the primary entries had emergency contacts that also needed to placed in the database. i noticed a few patterns and automated the process. hopefully this can become more thorough and useful others in the future. 

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
