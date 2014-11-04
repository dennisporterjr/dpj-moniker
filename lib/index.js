var moniker = {
    parse : function( names ) {
        var type, name, processed = [];

        names = Object.prototype.toString.call( names ) === "[object Array]" ? names : [ names ];

        for( var i = 0, l = names.length; i < l; i++ ) {

            name = names[i]; 
            type = moniker.type( name );

            if( type == "STANDARD" ) {
                processed = processed.concat( moniker.standard( name ) );
            }

            if( type == "BYLAST" ) {
                processed = processed.concat( moniker.bylast( name ) );
            }

            if( type == "BYLAST2" ) {
                processed = processed.concat( moniker.bylasttwo( name ) );
            }

            if( type == '2BYLAST' ) {
                processed = processed.concat( moniker.twobylast( name ) );
            }
            // john or jane doe
            // john & jane doe
        }

        return processed.length === 1 ? processed[0] : processed;
    },
    syms : function( symbols, order ) {
        var sLen = symbols.length,
            oLen = order.length;

        if( sLen !== oLen ) return false;

        for( var i = 0; i < sLen; i++ ) {
            if( symbols[i] !== order[i] ) {
                return false;
            } 
        }
        return true;
    },
    type : function( str ) {
        var hasAmp    = str.indexOf("&") > -1,
            hasOr     = str.indexOf(" or ") > -1,
            hasComma  = str.indexOf(",") > -1,
            numCommas = (str.match(/,/g) || []).length,
            symbols   = str.match(/,|&|\sor\s/g) || [];

        if( str == "" && str.split(" ") < 2 ) {
            return 'NONSTANDARD';
        }

        // standard
        if( !hasComma && !hasOr && !hasAmp ) {
            return 'STANDARD';
            return '"' + str + '" => STANDARD';
        }

        // doe, john
        if ( numCommas === 1 && !hasOr && !hasAmp ) {
            return 'BYLAST';
            return '"' + str + '" => BYLAST';
        }

        // doe, john & jane
        if ( numCommas === 1 && moniker.syms( symbols, [ ",", "&"] ) ) {
            return 'BYLAST2';
            return '"' + str + '" => BYLAST2';
        }

        // doe, john & day, jane
        if ( numCommas === 2 && moniker.syms( symbols, [ ",", "&", ","] ) ) {
            return '2BYLAST';
            return '"' + str + '" => 2BYLAST';
        }

        // john or jane doe
        if( hasOr && !hasAmp && !hasComma ) {
            return 'STANDARD2OR';
            return '"' + str + '" => STANDARD2OR';
        }

        // john & jane doe
        if( hasAmp && !hasOr && !hasComma ) {
            return 'STANDARD2AMP';
            return '"' + str + '" => STANDARD2AMP';
        }

        // other
        return 'OTHER';
        return '"' + str + '" => OTHER';
    },
    isSuffix : function( str ) {
        return {
            "jr" : true,
            "sr" : true,
            "i" : true,
            "ii" : true,
            "iii" : true,
            "iv" : true,
            "v" : true,
            "vi" : true,
        }[ str.toLowerCase().replace(".","") ];
    },
    standard : function( str ) {
        var parts = str.split(" "), pLen = parts.length, ret = {};
        if( pLen == 2 ) {
            return [{
                firstname : parts[0],
                lastname : parts[1]
            }];
        }

        if( pLen === 3 && moniker.isSuffix( parts[2] ) ) {
            return [{
                firstname : parts[0],
                lastname : parts[1] + " " + parts[2].replace(".",""),
                surname : parts[1],
                suffix : parts[2].replace(".","")
            }];
        }

        if( pLen === 3 ) {
            return [{
                firstname : parts[0],
                middlename : parts[1].replace(".",""),
                lastname : parts[2]
            }];
        }

        if( pLen === 4 && moniker.isSuffix( parts[3] ) ) {
            return [{
                firstname : parts[0],
                middlename : parts[1].replace(".",""),
                lastname : parts[2] + " " + parts[3].replace(".",""),
                surname : parts[2],
                suffix : parts[3].replace(".","")
            }];
        }
        return false;
    },
    bylast : function( str ) {
        var parts = str.split(","), pLen = parts.length, 
            // first name..
            firstparts = parts[1].trim().split(" "), fplen = firstparts.length,
            // last name..
            lastparts = parts[0].trim().split(" "), lplen = lastparts.length,
            ret = false;

        if( pLen !== 2 ) return ret;

        ret = {};

        ret.firstname = firstparts[0];
        if( fplen == 2 ) {
            ret.middlename = firstparts[1].replace(".","");
        }

        ret.lastname = lastparts[0];
        if( lplen == 2 ) {
            ret.lastname += lastparts[1].replace(".","");
        }

        return [ ret ];
    },
    firstMaybeMiddle : function( obj, name ) {
        var parts = name.trim().split(" ");
        if( parts.length > 0 ) {
            obj.firstname = parts[0];
            if( parts.length == 2 ) {
                obj.middlename = parts[1].replace(".","");
            }
        }
    },
    // doe, john & jane
    bylasttwo : function( str ) {
        var parts = str.split(","), pLen = parts.length, 
            // first names..
            firstparts = parts[1].trim().split("&"), fplen = firstparts.length,
            ret = false;

        if( pLen !== 2 ) return ret;
        if( fplen !== 2 ) return ret;

        ret = [{ lastname : parts[0] }, { lastname : parts[0] }];

        moniker.firstMaybeMiddle( ret[0], firstparts[0] );
        moniker.firstMaybeMiddle( ret[1], firstparts[1] );

        return ret;
    },
    // doe, john & day, jane
    bylasttwo : function( str ) {
        var parts = str.split("&"), pLen = parts.length, 
            // first names..
            name0 = parts[0].trim().split(","), len0 = name0.length,
            name1 = parts[1].trim().split(","), len1 = name1.length,
            ret = false;

        ret = [{ lastname : parts[0] }, { lastname : parts[0] }];

        moniker.firstMaybeMiddle( ret[0], firstparts[0] );
        moniker.firstMaybeMiddle( ret[1], firstparts[1] );
    }
};

module.exports = moniker;
