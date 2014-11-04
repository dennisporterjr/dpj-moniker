var noopArr = function() { return []; },
    stringify = function( val ) { console.log( JSON.stringify( val, null, "    " ) ); },
    log = function( val ) { console.log( val ); },
    moniker = {};

// utility functions
moniker.util = {
    syms : function( symbols, order ) {
        var sLen = symbols.length,
            oLen = order.length, actual, goal;

        if( sLen !== oLen ) return false;

        for( var i = 0; i < sLen; i++ ) {
            actual = symbols[i].trim();
            goal = order[i].trim();
            if( actual !== goal ) {
                if( actual === "and" && goal === "&" ) {
                    continue;
                } else {
                    return false;
                }
            } 
        }
        return true;
    },
    toCamelCase : function( str ) {
        return str.toLowerCase().replace(/-([a-z])/g,function(v){ return v.slice(1).toUpperCase(); } );
    },
    isSuffix : function( str ) {
        return { 
            "jr" : true, "sr" : true, "i" : true, "ii" : true, "iii" : true, "iv" : true, "v" : true, "vi" : true 
        }[ str.toLowerCase().replace(".","") ];
    },
    firstMiddle : function( obj, first ) {
        var parts = first.trim().split(" ");
        obj.firstname = parts[0];
        if( parts.length == 2 ) {
            obj.middlename = parts[1].replace(".","");
        }
    },
    lastSuffix : function( obj, last ) {
        var parts = last.trim().split(" "), suffix;
        obj.lastname = parts[0];
        if( parts.length == 2 ) {
            suffix = parts[1].replace(".",""); 
            if( moniker.util.isSuffix( suffix ) ) {
                obj.surname = parts[0];
                obj.lastname += " " + suffix;
                obj.suffix = suffix;
            }
        }
    }
};

// methods for extracting names in different formats...
moniker.types = {
    nonStandard : function( messy ) {
        return [{ 
            nonstandard : true,
            full : messy
        }];
    },
    standard : function( messy ) {
        var names = messy.split(" "), 
            namelen = names.length, 
            name = namelen > 1 ? {} : false, 
            first = false, last = false;

        if( name ) {
            if( namelen === 2 ) {
                first = names[0]; 
                last = names[1];
            }
            // if we have a suffix...
            if( moniker.util.isSuffix( names.slice(-1)[0] ) ) {
                // the last two names are a surname and suffix
                last = [].concat( names.pop(), names.pop() ).reverse().join(" ");
            } else { 
                last = names.pop();
            }
            first = first || names.join(" ");
          
            // clean up... 
            moniker.util.firstMiddle( name, first );
            moniker.util.lastSuffix( name, last );
        }
        return name;
    },
    byLast : function( messy ) {
        var parts = messy.split(","), name = parts.length > 1 ? {} : false;
        if( name ) {
            moniker.util.firstMiddle( name, parts[1] );
            moniker.util.lastSuffix( name, parts[0] );
        }
        return name;
    },
    // doe, john & jane
    twoByLast : function( messy ) {
        var parts = messy.split(","),
            firsts = parts.length === 2 ? parts[1].trim().split(/&|and/) : false, 
            names = firsts.length === 2 ? [ {}, {} ] : false, lastname;  

        if( !firsts || !names ) return false;

        // get last names for everybody...
        moniker.util.lastSuffix( names[0], parts[0] );
        moniker.util.lastSuffix( names[1], parts[0] );

        moniker.util.firstMiddle( names[0], firsts[0] );
        moniker.util.firstMiddle( names[1], firsts[1] );

        return names;
    },
    // doe, john & day, jane
    byLastTwo : function( str ) {
        var parts = str.split("&"), pLen = parts.length, 
            // first names..
            name0 = parts[0].trim().split(","), len0 = name0.length,
            name1 = parts[1].trim().split(","), len1 = name1.length,
            ret = false;

        ret = [{ lastname : parts[0] }, { lastname : parts[0] }];

        moniker.firstandmiddle( ret[0], firstparts[0] );
        moniker.firstandmiddle( ret[1], firstparts[1] );

        return ret;
    }
};

moniker.type = function( str ) {
    var hasAmp    = str.match(/\s&\s|\sand\s/g) !== null ? true : false,
        hasOr     = str.indexOf(" or ") > -1,
        hasComma  = str.indexOf(",") > -1,
        numCommas = (str.match(/,/g) || []).length,
        symbols   = str.match(/,|\s&\s|\sand\s|\sor\s/g) || [];

    if( str == "" && str.split(" ") < 2 ) {
        return 'NON-STANDARD';
    }

    // standard
    if( !hasComma && !hasOr && !hasAmp ) {
        return 'STANDARD';
    }

    // doe, john
    if ( numCommas === 1 && !hasOr && !hasAmp ) {
        return 'BY-LAST';
    }

    // doe, john & jane
    if ( numCommas === 1 && moniker.util.syms( symbols, [ ",", "&"] ) ) {
        return 'TWO-BY-LAST';
    }

    // doe, john & day, jane
    if ( numCommas === 2 && moniker.util.syms( symbols, [ ",", "&", ","] ) ) {
        return 'BY-LAST-TWO';
    }

    // john or jane doe
    if( hasOr && !hasAmp && !hasComma ) {
        return 'TWO-STANDARD-OR';
    }

    // john & jane doe
    if( hasAmp && !hasOr && !hasComma ) {
        return 'TWO-STANDARD-AMP';
    }

    // other
    return 'OTHER';
};

moniker.parse = function( names ) {
    var type, name, processed = [], processor;

    names = Object.prototype.toString.call( names ) === "[object Array]" ? names : [ names ];

    for( var i = 0, l = names.length; i < l; i++ ) {
        name = names[i]; 
        type = moniker.type( name );
        processor = moniker.types[ moniker.util.toCamelCase( type ) ] || noopArr;
        processed = processed.concat( processor( name ) );
    }

    return processed.length === 1 ? processed[0] : processed;
};


module.exports = moniker;
