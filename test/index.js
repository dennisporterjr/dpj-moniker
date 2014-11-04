var should = require('chai').should(),
    moniker = require('../lib/index'),
    parse = moniker.parse;

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
describe('#parse - two names comma separated, surname first => "doe, john & jane"', function() {

    it('should extract two names', function() {
        var output1 = parse('Ali, Kevin & Lisa'),
            output2 = parse('Porter, Dennis and Deborah');

        output1.length.should.equal( 2 );
        output1[0].should.deep.equal({ firstname : 'Kevin', lastname : 'Ali' });
        output1[1].should.deep.equal({ firstname : 'Lisa', lastname : 'Ali' });
        output2.length.should.equal( 2 );
        output2[0].should.deep.equal({ firstname : 'Dennis', lastname : 'Porter' });
        output2[1].should.deep.equal({ firstname : 'Deborah', lastname : 'Porter' });
    });
    it('should extract two names with middlename', function() {
        var output1 = parse('Aduku, Christina M. & Peter'),
            output2 = parse('Alexandr, Camille L. & Sheldon D.');

        output1.length.should.equal( 2 );
        output1[0].should.deep.equal({ firstname : 'Christina', middlename : 'M', lastname : 'Aduku' });
        output1[1].should.deep.equal({ firstname : 'Peter', lastname : 'Aduku' });
        output2.length.should.equal( 2 );
        output2[0].should.deep.equal({ firstname : 'Camille', middlename : 'L', lastname : 'Alexandr' });
        output2[1].should.deep.equal({ firstname : 'Sheldon', middlename : 'D', lastname : 'Alexandr' });
    })
})
