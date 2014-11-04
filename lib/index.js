var noopArr = function() { return []; },
    stringify = function( val ) { console.log( JSON.stringify( val, null, "    " ) ); },
    log = function( val ) { console.log( val ); },
    reSeparator = /,/,
    reAnnexers = /\s(?:&|and|or)\s/gi,
    reAugmenters = /(?:\s(?:&|and|or)\s)|,/gi,
    moniker = {};

// utility functions
moniker.util = {
    pattern : function( o ) {
        var actuals = o.actual || false,
            goals   = o.goal || false,
            alen    = actuals.length || 0,
            glen    = goals.length || 0,
            repeat  = o.repeat || false,
            i = 0, g = 0;

        if( alen !== glen && repeat === false ) return false;

        // the actual pattern can't be smaller than the goal pattern...
        if( repeat && glen > alen ) {
            return false;
        }

        for(; i < alen; i++ ) {
                // repeating pattern...?
            g = repeat ? 
                    // do we need to evaluate how to repeat?
                    i > glen - 1 ?
                        // if repeat all.. 
                        repeat === "all" ? 
                            // use modulo to continue looping through goal...
                            i % glen  
                        // if repeating "lasttwo" and we flip between the last and second to last goal pattern...
                        : repeat === 'lasttwo' ? 
                            glen - 1 - ( Math.abs( ( i - glen - 1 ) % 2 ) ) 
                        // otherwise we're repeating "last" and we can stick with the last goal pattern...
                        : glen - 1
                    : i
                : i;

            if( actuals[i].match( goals[g] ) === null ) {
                return false;
            } 
        }

        // the goal iterater needs to end on it's last index so we know
        // that the actual pattern fit the goal pattern perfectly...
        return g == glen - 1 ? true : false;
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
    },
    popAndJoin : function( arr, num ) {
        var ret = [];
        for( var i = 0; i < num || 0; i++ ) {
            ret = ret.concat( arr.pop() );
        }
        return  ret.reverse().join(" ");
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
                last = moniker.util.popAndJoin( names, 2 );
            } else { 
                last = names.pop();
            }
            first = first || names.join(" ");
          
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
    byLastMultiFirst : function( messy ) {
        var people = messy.split(","),
            firsts = people.length === 2 ? people[1].trim().split( reAnnexers ) : false, 
            flen = firsts ? firsts.length : 0,
            names = flen > 0 ? new Array( flen ) : false;  

        if( !firsts || !names ) return false;

        for( var i = 0; i < flen; i++ ) {
            names[i] = {};
            moniker.util.lastSuffix( names[i], people[0] );
            moniker.util.firstMiddle( names[i], firsts[i] );
        }

        return names;
    },
    // doe, john & day, jane
    multiByLast : function( messy ) {
        var people = messy.split(reAnnexers), peoplelen = people.length, 
            names = peoplelen > 0 ? new Array( peoplelen ) : false,
            stems;
        for( var i = 0; i < peoplelen; i++ ) {
            names[i] = {};
            stems = people[i].split(",");
            moniker.util.firstMiddle( names[i], stems[1] );
            moniker.util.lastSuffix( names[i], stems[0] );
        }

        return names;
    },
    // john or jane doe
    multiFirstStandard : function( messy ) {
        var parts = messy.split(" "), 
            last = moniker.util.isSuffix( parts.slice(-1)[0] ) ? moniker.util.popAndJoin( parts, 2 ) : parts.pop(),
            firsts = parts.join(" ").split( reAnnexers ),
            names = new Array( firsts.length );
            
        for( var i = 0, len = names.length; i < len; i++ ) {
            names[i] = {};
            moniker.util.firstMiddle( names[i], firsts[i] );
            moniker.util.lastSuffix( names[i], last );
        }

        return names;
    }
};

moniker.type = function( str ) {
    var hasAnnexer    = str.match( reAnnexers ) !== null ? true : false,
        hasSeparator  = str.match( reSeparator ) !== null ? true : false,
        augmenters    = str.match( reAugmenters ) || [],
        numAugmenters = augmenters.length;

    if( str == "" && str.split(" ") < 2 ) {
        return 'NON-STANDARD';
    }

    // standard
    if( numAugmenters == 0 ) {
        return 'STANDARD';
    }

    // doe, john
    if ( numAugmenters === 1 && moniker.util.pattern({ actual : augmenters, goal : [ reSeparator ] }) ) {
        return 'BY-LAST';
    }

    // doe, john & jane
    if ( moniker.util.pattern( { actual : augmenters, goal : [ reSeparator, reAnnexers ], repeat : 'last' } ) ) {
        return 'BY-LAST-MULTI-FIRST';
    }

    // doe, john & day, jane
    if ( moniker.util.pattern({ actual : augmenters, goal : [ reSeparator, reAnnexers, reSeparator ], repeat : 'lasttwo' }) ) {
        return 'MULTI-BY-LAST';
    }

    // john or/and/& jane doe
    if ( moniker.util.pattern({ actual : augmenters, goal : [ reAnnexers ], repeat : 'all' }) ) {
        return 'MULTI-FIRST-STANDARD';
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
