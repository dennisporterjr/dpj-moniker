var should = require('chai').should(),
    moniker = require('../lib/index'),
    parse = moniker.parse;

describe('#parse - single name', function() {

    it('extract parts of name', function() {
        var output1 = parse('dennis porter');
        output1.should.deep.equal({ firstname : 'dennis', lastname : 'porter' });
    });

    it('recognize middlenames', function() {
        var output1 = parse('dennis gene porter'),
            output2 = parse('Dennis Gene Porter Sr'),
            output3 = parse('dennis node js');

        output1.should.deep.equal({ firstname : 'dennis', middlename : 'gene', lastname : 'porter' });
        output2.should.deep.equal({ firstname : 'Dennis', middlename : 'Gene', lastname : 'Porter Sr', surname: 'Porter', suffix : 'Sr' });
        output3.should.deep.equal({ firstname : 'dennis', middlename : 'node', lastname : 'js'  });
    });

    it('recognize suffixes', function() {
        var output1 = parse('dennis porter jr'),
            output2 = parse('Dennis Porter Sr'),
            output3 = parse('dennis js');

        output1.should.deep.equal({ firstname : 'dennis', lastname : 'porter jr', surname: 'porter', suffix : 'jr' });
        output2.should.deep.equal({ firstname : 'Dennis', lastname : 'Porter Sr', surname: 'Porter', suffix : 'Sr' });
        output3.should.deep.equal({ firstname : 'dennis', lastname : 'js'  });
    });

});
