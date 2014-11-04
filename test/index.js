var should = require('chai').should(),
    moniker = require('../lib/index'),
    reSeparator = /,/,
    reAnnexers = /\s(?:&|and|or)\s/gi,
    reAugmenters = /(?:\s(?:&|and|or)\s)|,/gi,
    parse = moniker.parse;

describe('#pattern - symbol pattern matcher', function(){
    it('should identify "finite" patterns', function(){
        moniker.util.pattern({ actual : [ ",", " & " ], goal : [ reSeparator, reAnnexers ] }).should.equal(true);
    });
    it('should identify "repeating/all" patterns', function(){
        moniker.util.pattern({ actual : [ ",", " & ", ",", " & ", ",", " & " ], goal : [ reSeparator, reAnnexers ], repeat : "all" }).should.equal(true);
    });
    it('should identify "repeating/last" patterns', function(){
        moniker.util.pattern({ actual : [ ",", " & ", ","], goal : [ /,/,  /\s(?:&|and|or)\s/gi ], repeat : "last" }).should.equal(false);
        moniker.util.pattern({ actual : [ ",", " & ", " or ", " and ", " & " ], goal : [ reSeparator, reAnnexers ], repeat : "last" }).should.equal(true);
    });
    it('should identify "lasttwo" patterns', function(){
        moniker.util.pattern({actual: [ ",", " and ", ",", " & ", ",", " & ", "," ], goal: [/,/,  /\s(?:&|and|or)\s/gi, /,/], repeat:'lasttwo' })
    });
});

describe('#parse - standard name => "john doe"', function() {

    it('should extract basic parts of name', function() {
        var output1 = parse('dennis porter'),
            output2 = parse('john doe'),
            output3 = parse('jane fitzgerald');

        output1.should.deep.equal({ firstname : 'dennis', lastname : 'porter' });
        output2.should.deep.equal({ firstname : 'john', lastname : 'doe' });
        output3.should.deep.equal({ firstname : 'jane', lastname : 'fitzgerald' });
    });

    it('should extract suffixes', function() {
        var output1 = parse('dennis porter jr'),
            output2 = parse('Dennis Porter Sr'),
            output3 = parse('dennis js');

        output1.should.deep.equal({ firstname : 'dennis', lastname : 'porter jr', surname: 'porter', suffix : 'jr' });
        output2.should.deep.equal({ firstname : 'Dennis', lastname : 'Porter Sr', surname: 'Porter', suffix : 'Sr' });
        output3.should.deep.equal({ firstname : 'dennis', lastname : 'js'  });
    });

    it('should extract middlenames', function() {
        var output1 = parse('dennis gene porter'),
            output2 = parse('Dennis Gene Porter Sr'),
            output3 = parse('dennis node js');

        output1.should.deep.equal({ firstname : 'dennis', middlename : 'gene', lastname : 'porter' });
        output2.should.deep.equal({ firstname : 'Dennis', middlename : 'Gene', lastname : 'Porter Sr', surname: 'Porter', suffix : 'Sr' });
        output3.should.deep.equal({ firstname : 'dennis', middlename : 'node', lastname : 'js'  });
    });

});

describe('#parse - comma separated, surname first => "doe, john"', function() {

    it('should extract basic parts of name', function() {
        var output1 = parse('porter, dennis'),
            output2 = parse('doe, john'),
            output3 = parse('fitzgerald, jane');

        output1.should.deep.equal({ firstname : 'dennis', lastname : 'porter' });
        output2.should.deep.equal({ firstname : 'john', lastname : 'doe' });
        output3.should.deep.equal({ firstname : 'jane', lastname : 'fitzgerald' });
    });

    it('should extract suffixes', function() {
        var output1 = parse('porter jr, dennis'),
            output2 = parse('Porter Sr, Dennis'),
            output3 = parse('js, dennis');

        output1.should.deep.equal({ firstname : 'dennis', lastname : 'porter jr', surname: 'porter', suffix : 'jr' });
        output2.should.deep.equal({ firstname : 'Dennis', lastname : 'Porter Sr', surname: 'Porter', suffix : 'Sr' });
        output3.should.deep.equal({ firstname : 'dennis', lastname : 'js'  });
    });

    it('should extract middlenames', function() {
        var output1 = parse('porter, dennis gene'),
            output2 = parse('Porter Sr, Dennis Gene'),
            output3 = parse('js, dennis node');

        output1.should.deep.equal({ firstname : 'dennis', middlename : 'gene', lastname : 'porter' });
        output2.should.deep.equal({ firstname : 'Dennis', middlename : 'Gene', lastname : 'Porter Sr', surname: 'Porter', suffix : 'Sr' });
        output3.should.deep.equal({ firstname : 'dennis', middlename : 'node', lastname : 'js'  });
    });

});

describe('#parse - several names comma separated, surname first => "doe, john & jane"', function() {

    it('should extract names', function() {
        var output1 = parse('Ali, Kevin & Lisa'),
            output2 = parse('Porter, Dennis and Deborah'),
            output3 = parse('Porter, Dennis and Deborah & John');

        output1.length.should.equal( 2 );
        output1[0].should.deep.equal({ firstname : 'Kevin', lastname : 'Ali' });
        output1[1].should.deep.equal({ firstname : 'Lisa', lastname : 'Ali' });
        output2.length.should.equal( 2 );
        output2[0].should.deep.equal({ firstname : 'Dennis', lastname : 'Porter' });
        output2[1].should.deep.equal({ firstname : 'Deborah', lastname : 'Porter' });
        output3.length.should.equal( 3 );
        output3[0].should.deep.equal({ firstname : 'Dennis', lastname : 'Porter' });
        output3[1].should.deep.equal({ firstname : 'Deborah', lastname : 'Porter' });
        output3[2].should.deep.equal({ firstname : 'John', lastname : 'Porter' });
    });

    it('should extract names with middlename', function() {
        var output1 = parse('Aduku, Christina M. & Peter'),
            output2 = parse('Alexandr, Camille L. & Sheldon D.');

        output1.length.should.equal( 2 );
        output1[0].should.deep.equal({ firstname : 'Christina', middlename : 'M', lastname : 'Aduku' });
        output1[1].should.deep.equal({ firstname : 'Peter', lastname : 'Aduku' });
        output2.length.should.equal( 2 );
        output2[0].should.deep.equal({ firstname : 'Camille', middlename : 'L', lastname : 'Alexandr' });
        output2[1].should.deep.equal({ firstname : 'Sheldon', middlename : 'D', lastname : 'Alexandr' });
    });

})

describe('#parse - several names separated by and/&/or, surnames first => "doe, john & dae, jane"', function() {

    it('should extract all names', function() {
        var output1 = parse('Ali, Kevin & Doe, Lisa'),
            output2 = parse('Porter, Dennis and Dae, Deborah'),
            output3 = parse('Jones, Indiana and Skywalker, Luke & Kenobi, Obi Wan');

            output1.length.should.equal( 2 );
            output1[0].should.deep.equal({ firstname : 'Kevin', lastname : 'Ali' });
            output1[1].should.deep.equal({ firstname : 'Lisa', lastname : 'Doe' });
            output2.length.should.equal( 2 );
            output2[0].should.deep.equal({ firstname : 'Dennis', lastname : 'Porter' });
            output2[1].should.deep.equal({ firstname : 'Deborah', lastname : 'Dae' });
            output3.length.should.equal( 3 );
            output3[0].should.deep.equal({ firstname : 'Indiana', lastname : 'Jones' });
            output3[1].should.deep.equal({ firstname : 'Luke', lastname : 'Skywalker' });
            output3[2].should.deep.equal({ firstname : 'Obi', middlename : 'Wan', lastname : 'Kenobi' });
    });

    it('should extract two names with middlename', function() {
        var output1 = parse('Aduku, Christina M. & Dae, Peter'),
            output2 = parse('Alexandr, Camille L. & Doe, Sheldon D.');

        output1.length.should.equal( 2 );
        output1[0].should.deep.equal({ firstname : 'Christina', middlename : 'M', lastname : 'Aduku' });
        output1[1].should.deep.equal({ firstname : 'Peter', lastname : 'Dae' });
        output2.length.should.equal( 2 );
        output2[0].should.deep.equal({ firstname : 'Camille', middlename : 'L', lastname : 'Alexandr' });
        output2[1].should.deep.equal({ firstname : 'Sheldon', middlename : 'D', lastname : 'Doe' });
    });

});

describe('#parse - several names standard, two first names separated by "or|and|&" => "john or jane doe"', function() {

    it('should extract all names', function() {
        var output1 = parse('Jeanette or Whirlington Anderson'),
            output2 = parse('Jeanette and Whirlington Anderson'),
            output3 = parse('Jeanette & John and Whirlington Anderson');

        output1.length.should.equal( 2 );
        output1[0].should.deep.equal({ firstname : 'Jeanette', lastname : 'Anderson' });
        output1[1].should.deep.equal({ firstname : 'Whirlington', lastname : 'Anderson' });

        output2.length.should.equal( 2 );
        output2[0].should.deep.equal({ firstname : 'Jeanette', lastname : 'Anderson' });
        output2[1].should.deep.equal({ firstname : 'Whirlington', lastname : 'Anderson' });

        output3.length.should.equal( 3 );
        output3[0].should.deep.equal({ firstname : 'Jeanette', lastname : 'Anderson' });
        output3[1].should.deep.equal({ firstname : 'John', lastname : 'Anderson' });
        output3[2].should.deep.equal({ firstname : 'Whirlington', lastname : 'Anderson' });

    });

});
describe('#parse - general', function(){
    it('should work', function(){
        var output1 = parse([
                'Potts, Pepper',
                'Storm, Sue & Johnny',
                'Mario or Luigi Mario'
            ]), 
            output2 = parse('Tony Edward Stark');

        output1[0].should.deep.equal({ firstname : 'Pepper', lastname : 'Potts' });
        output1[1].should.deep.equal({ firstname : 'Sue', lastname : 'Storm' });
        output1[2].should.deep.equal({ firstname : 'Johnny', lastname : 'Storm' });
        output1[3].should.deep.equal({ firstname : 'Mario', lastname : 'Mario' });
        output1[4].should.deep.equal({ firstname : 'Luigi', lastname : 'Mario' });
        output2.should.deep.equal({ firstname : 'Tony', middlename : 'Edward', lastname : 'Stark' });
    });
});
