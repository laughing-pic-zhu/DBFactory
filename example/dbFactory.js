/**
 DBF.create('Foo', {
    get: {
        type: 'POST', //当`type`为`POST`或`GET`时，`dataType`默认为`json`
        ...
    }
 });
 */

(function ($) {
    //简单工厂生成项目统一的ajax参数对象
    var DBFactory = {
        __: {},
        //可有业务代码设置mockUrl,prefixUrl等
        set: function (key, value) {
            this.__[key] = value;
        },
        get: function (key) {
            return this.__[key];
        },
        create: function (name, methods) {
            // 禁止创建重名的DB实例
            if (this.context[name]) {
                console.warn('DB: "' + name + '" is existed! ');
                return;
            }
            return this.context[name] = new DB(name, methods);
        },
        // 存储db实例
        context: {

        }
    };


    //DB构造函数 负责构造ajax参数对象
    function DB(DBName, methods) {
        var t = this;
        t.cache = {};
        $.each(methods, function (method, config) {
            if (typeof config === 'function') {
                t[method] = config;
                return;
            }

            t[method] = function (query) {
                var cfg = {};

                cfg.method = method;

                cfg.DBName = DBName;

                cfg.mockUrl = config.mockUrl;

                // 如果设置了`mock`代理
                if (cfg.mockUrl && typeof DBFactory.__.mockProxy === 'function') {
                    cfg.mockUrl = DBFactory.__.mockProxy(cfg.mockUrl);
                }
                //合并参数
                cfg.query = $.extend({}, config.query || {}, query || {});
                //判断是否mock
                cfg.isMock = config.url ? false : true;
                //url前缀供getUrl计算url
                t.urlPrefix = DBFactory.get('urlPrefix') || '';
                //url
                cfg.url = cfg.isMock ? cfg.mockUrl : (t.getUrl(config.url) || cfg.mockUrl);
                // 是否是全局只获取一次
                cfg.once = typeof config.once === 'boolean' ? config.once : false;
                // 数据缓存，如果`once`设置为true，则在第二次请求的时候直接返回改缓存数据。
                t.cache[method] = t.cache[method] || null;

                cfg.jsonp = config.jsonp || false;

                cfg.type = config.type || 'POST';
                return request(cfg, t);
            };
        });
    }

    /**
     * 获取正式接口的完整`url`
     * 如果通过`DB.set('urlPrefix', 'https://xxx')`设置了全局`url`的前缀，则执行补全
     */
    DB.prototype.getUrl=function (url) {
        if (this.urlPrefix && url.indexOf('http') !== 0 && url.indexOf('//') !== 0) {
            return this.urlPrefix + url;
        } else {
            return url;
        }
    };

    /**
     *
     * @param cfg  属性对象提供给ajax修改请求属性
     * @param db   db提供缓存
     * @returns  ajax promise
     */
    function request(cfg, db) {
        var defer = $.Deferred();
        if (cfg.once && db.cache[cfg.method]) {
            defer.resolve(db.cache[cfg.method]);
        } else {
            var ajaxOptions = {
                url: cfg.url,
                data: cfg.query,
                success: function (resp) {
                    //cfg.once && (db.cache[cfg.method] = resp);
                    defer.resolve(resp);
                },
                error: function (error) {
                    defer.reject({
                        fail:true,
                        msg:  error
                    });
                }
            };

            if (cfg.jsonp === true) {
                ajaxOptions.dataType = 'jsonp';
            } else {
                ajaxOptions.dataType = 'json';
                ajaxOptions.type = cfg.type;
            }

            $.ajax(ajaxOptions);
        }
        return defer.promise();
    };

    window.DBFactory = DBFactory;
})($);