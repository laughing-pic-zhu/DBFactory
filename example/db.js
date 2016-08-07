(function (DBF) {


var isOnline = false;

// 设置全局的`url`前缀
    var urlPrefixForLocal = location.protocol + '//' + location.host+'/';
    if (!isOnline) {
        DBF.set('urlPrefix', urlPrefixForLocal);
    } else {
        DBF.set('urlPrefix', '/trs');
    }

// MockProxy mock 数据服务器(node/php代理)代理，以跨过同源检测
    DBF.set('mockProxy', function (mockUrl) {
        return '/mock?url=' + mockUrl
    });

// 测试用, 可以扩展多个方法
    DBF.create('Test', {
        get: {
            type: 'GET',
            // jsonp: true,
            url: 'dbTest/example/ajax-data/data.json'
            // mockUrl: urlPrefixForLocal + '/ajax-data/data.json',
            //once: true
        }
    });

    DBF.create('GetPersonInfo', {
        get: {
            type: 'GET',
            url: 'getMySimpleInfo.json',
            once: true
        }
    });


    window.DB = DBF.context;
})(window.DBFactory);
