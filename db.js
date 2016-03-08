(function ($) {
    var DBFactory = {
        setPre: function (value) {
            this.preUrl = value;
        },
        newInstance: function (name, obj) {
            obj.preUrl = this.preUrl;
            var db = new DB(obj);
            this.context[name] = db;
        },
        context: {}
    };

    var DB = function (obj) {
        this.url = obj.url;
        this.type = obj.type || 'get';
        this.dataType = obj.dataType || 'json';
        this.preUrl = obj.preUrl;
        this.get = function (data) {
            return request(this, data);
        }
    };


    function request(db, data) {
        var url = db.preUrl + db.url;
        var promise = $.ajax({
            type: db.type,
            url: url,
            dataType: db.dataType,
            data: data
        });
        return promise;
    }

    window.DBFactory = DBFactory;

})(jQuery);



