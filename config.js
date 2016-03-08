(function () {
    var hostname = location.hostname;
    var ifMock = hostname.indexOf('127.0.0.1') || hostname.indexOf('localhost');
    var onLinePre = 'http://xue.alibaba-inc.com/assets/';
    var mockPre = 'http://127.0.0.1:3000/assets/';
    var DBFactory = window.DBFactory;
    var preUrl;
    if (ifMock) {
        preUrl = mockPre;
    } else {
        preUrl = onLinePre;
    }

    DBFactory.setPre(preUrl);

    DBFactory.newInstance('testA', {
        url: 'testA.json',
        type: 'get',
        dataType: 'json'
    });

    DBFactory.newInstance('testB', {
        url: 'testB.json',
        type: 'get',
        dataType: 'json'
    });

    window.db = DBFactory.context;

})();

