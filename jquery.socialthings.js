/*! jQuery.socialthings (https://github.com/Takazudo/jQuery.socialthings)
 * lastupdate: 2014-10-30
 * version: 0.1.9
 * author: 'Takazudo' Takeshi Takatsudo <takazudo@gmail.com>
 * License: MIT */
(function() {

  (function($) {
    var ns;
    ns = {};
    ns.facebook = {};
    ns.facebook.options = {
      locale: 'en_US',
      appId: null
    };
    ns.facebook.loadJS = (function() {
      var init, loaded;
      loaded = false;
      init = function() {
        var o, src;
        $('body').append('<div id="fb-root"></div>');
        o = ns.facebook.options;
        src = "//connect.facebook.net/" + o.locale + "/all.js#xfbml=1";
        if (o.appId) {
          src += "&appId=" + o.appId;
        }
        (function(d, s, id) {
          var fjs, js;
          fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {
            return;
          }
          js = d.createElement(s);
          js.id = id;
          js.src = src;
          return fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
        loaded = true;
      };
      return function() {
        if (loaded) {
          return false;
        }
        init();
        return true;
      };
    })();
    ns.facebook.waitForPreparation = (function() {
      var interval, promise, runCheck;
      interval = 250;
      promise = null;
      runCheck = function() {
        return promise = $.Deferred(function(defer) {
          var check;
          check = function() {
            var _ref;
            if (((_ref = window.FB) != null ? _ref.XFBML : void 0) != null) {
              return defer.resolve();
            } else {
              return setTimeout(check, interval);
            }
          };
          return check();
        }).promise();
      };
      return function() {
        if (!promise) {
          runCheck();
        }
        return promise;
      };
    })();
    $.fn.initFacebookThings = function(options) {
      return this.each(function(i, el) {
        if (!ns.facebook.loadJS()) {
          return ns.facebook.waitForPreparation().done(function() {
            return window.FB.XFBML.parse(el);
          });
        }
      });
    };
    ns.facebookShareButton = {};
    ns.facebookShareButton.Button = (function() {

      Button.defaults = {
        windowname: 'facebook-share-dialog',
        width: null,
        height: null,
        url: null,
        html: null,
        tweakHref: true
      };

      function Button($el, options) {
        this.$el = $el;
        this.options = $.extend({}, ns.facebookShareButton.Button.defaults, options);
        this._tweakInsideHtml();
        this._handleDataAttrs();
        this._prepareUrl();
        this._eventify();
      }

      Button.prototype.open = function() {
        var args, name, o;
        o = this.options;
        name = o.windowname;
        args = [this._url, name];
        if ((o.width != null) && (o.height != null)) {
          args.push("width=" + o.width + ",height=" + o.height);
        }
        return window.open.apply(window, args);
      };

      Button.prototype._tweakInsideHtml = function() {
        if (this.options.html == null) {
          return;
        }
        return this.$el.html(this.options.html);
      };

      Button.prototype._prepareUrl = function() {
        var o, shareUrl;
        o = this.options;
        shareUrl = o.url || location.href;
        this._url = "https://www.facebook.com/sharer/sharer.php?u=" + (encodeURIComponent(shareUrl));
        if (o.tweakHref) {
          return this.$el.attr('href', this._url);
        }
      };

      Button.prototype._handleAttr = function(key) {
        var prop, val;
        prop = key.replace(/^data-facebookshare-/, '');
        val = this.$el.attr(key);
        if (!val) {
          return;
        }
        return this.options[prop] = val;
      };

      Button.prototype._handleDataAttrs = function() {
        this._handleAttr('data-facebookshare-windowname');
        this._handleAttr('data-facebookshare-width');
        this._handleAttr('data-facebookshare-height');
        return this._handleAttr('data-facebookshare-url');
      };

      Button.prototype._eventify = function() {
        var _this = this;
        return this.$el.click(function(e) {
          e.preventDefault();
          return _this.open();
        });
      };

      return Button;

    })();
    $.fn.facebookShareButton = function(options) {
      var key;
      key = 'facebooksharebutton';
      return this.each(function(i, el) {
        var $el, instance;
        $el = $(el);
        instance = new ns.facebookShareButton.Button($el, options);
        if ($el.data(key)) {
          return;
        }
        return $el.data(key, instance);
      });
    };
    ns.twitter = {};
    ns.twitter.loadJS = (function() {
      var init, loaded;
      loaded = false;
      init = function() {
        (function(d, s, id) {
          var fjs, js, p;
          fjs = d.getElementsByTagName(s)[0];
          p = (/^http:/.test(d.location) ? "http" : "https");
          if (!d.getElementById(id)) {
            js = d.createElement(s);
            js.id = id;
            js.src = p + "://platform.twitter.com/widgets.js";
            return fjs.parentNode.insertBefore(js, fjs);
          }
        })(document, "script", "twitter-wjs");
        loaded = true;
      };
      return function() {
        if (loaded) {
          return false;
        }
        init();
        return true;
      };
    })();
    ns.twitter.waitForPreparation = (function() {
      var interval, promise, runCheck;
      interval = 250;
      promise = null;
      runCheck = function() {
        return promise = $.Deferred(function(defer) {
          var check;
          check = function() {
            var _ref, _ref1;
            if (((_ref = window.twttr) != null ? (_ref1 = _ref.widgets) != null ? _ref1.load : void 0 : void 0) != null) {
              return defer.resolve();
            } else {
              return setTimeout(check, interval);
            }
          };
          return check();
        }).promise();
      };
      return function() {
        if (!promise) {
          runCheck();
        }
        return promise;
      };
    })();
    ns.twitter.applyWidgets = function() {
      if (!ns.twitter.loadJS()) {
        ns.twitter.waitForPreparation().done(function() {
          return window.twttr.widgets.load();
        });
      }
    };
    ns.twitterShareButton = {};
    ns.twitterShareButton.Button = (function() {

      Button.defaults = {
        windowname: 'twitter-tweet-dialog',
        width: null,
        height: null,
        url: null,
        html: null,
        text: null,
        via: null,
        related: null,
        tweakHref: true
      };

      function Button($el, options) {
        this.$el = $el;
        this.options = $.extend({}, ns.twitterShareButton.Button.defaults, options);
        this._tweakInsideHtml();
        this._handleDataAttrs();
        this._prepareUrl();
        this._eventify();
      }

      Button.prototype.open = function() {
        var args, name, o;
        o = this.options;
        name = o.windowname;
        args = [this._url, name];
        if ((o.width != null) && (o.height != null)) {
          args.push("width=" + o.width + ",height=" + o.height);
        }
        return window.open.apply(window, args);
      };

      Button.prototype._tweakInsideHtml = function() {
        if (this.options.html == null) {
          return;
        }
        return this.$el.html(this.options.html);
      };

      Button.prototype._prepareUrl = function() {
        var o, params, related, shareUrl, tweetText, via;
        o = this.options;
        shareUrl = o.url || location.href;
        tweetText = o.text || document.title;
        via = o.via;
        related = o.related;
        params = [];
        if (shareUrl) {
          params.push("url=" + (encodeURIComponent(shareUrl)));
        }
        if (tweetText) {
          params.push("text=" + (encodeURIComponent(tweetText)));
        }
        if (via) {
          params.push("via=" + (encodeURIComponent(via)));
        }
        if (related) {
          params.push("related=" + (encodeURIComponent(related)));
        }
        this._url = "https://twitter.com/share?" + params.join("&");
        if (o.tweakHref) {
          return this.$el.attr('href', this._url);
        }
      };

      Button.prototype._handleAttr = function(key) {
        var prop, val;
        prop = key.replace(/^data-twittershare-/, '');
        val = this.$el.attr(key);
        if (!val) {
          return;
        }
        return this.options[prop] = val;
      };

      Button.prototype._handleDataAttrs = function() {
        this._handleAttr('data-twittershare-windowname');
        this._handleAttr('data-twittershare-width');
        this._handleAttr('data-twittershare-height');
        this._handleAttr('data-twittershare-text');
        this._handleAttr('data-twittershare-url');
        this._handleAttr('data-twittershare-via');
        return this._handleAttr('data-twittershare-related');
      };

      Button.prototype._eventify = function() {
        var _this = this;
        return this.$el.click(function(e) {
          e.preventDefault();
          return _this.open();
        });
      };

      return Button;

    })();
    $.fn.twitterShareButton = function(options) {
      var key;
      key = 'twittersharebutton';
      return this.each(function(i, el) {
        var $el, instance;
        $el = $(el);
        instance = new ns.twitterShareButton.Button($el, options);
        if ($el.data(key)) {
          return;
        }
        return $el.data(key, instance);
      });
    };
    ns.gplus = {};
    ns.gplus.options = {
      lang: 'en'
    };
    ns.gplus.loadJS = (function() {
      var init, loaded;
      loaded = false;
      init = function() {
        window.___gcfg = {
          lang: ns.gplus.options.lang
        };
        $.getScript('https://apis.google.com/js/plusone.js');
        loaded = true;
      };
      return function() {
        if (loaded) {
          return false;
        }
        init();
        return true;
      };
    })();
    ns.gplus.applyWidgets = function() {
      if (!ns.gplus.loadJS()) {
        if (window.gapi) {
          window.gapi.plusone.go();
        }
      }
    };
    ns.hatebu = {};
    ns.hatebu.disabled = false;
    ns.hatebu.loadJS = (function() {
      var init, loaded, shouldDisable;
      loaded = false;
      shouldDisable = function() {
        if (document.location.protocol === 'https:') {
          return true;
        }
        return false;
      };
      init = function() {
        loaded = true;
        if (shouldDisable()) {
          ns.hatebu.disabled = true;
          return;
        }
        return (function(d, s, id) {
          var fjs, js;
          fjs = d.getElementsByTagName(s)[0];
          if (!d.getElementById(id)) {
            js = d.createElement(s);
            js.id = id;
            js.charset = 'utf-8';
            js.async = true;
            js.src = 'http://b.st-hatena.com/js/bookmark_button.js';
            return fjs.parentNode.insertBefore(js, fjs);
          }
        })(document, "script", "hatebu-wjs");
      };
      return function() {
        if (loaded) {
          return false;
        }
        init();
        return true;
      };
    })();
    ns.hatebu.applyWidgets = function() {
      if (!ns.hatebu.loadJS()) {
        if (ns.hatebu.disabled) {
          return;
        }
        Hatena.Bookmark.BookmarkButton.setup();
      }
    };
    ns.line = {};
    ns.line.loadJS = (function() {
      var init, loaded;
      loaded = false;
      init = function() {
        var p, src;
        p = (/^http:/.test(document.location) ? "http" : "https");
        src = p + '://media.line.naver.jp/js/line-button.js?v=20130508';
        document.write(("<script src='" + src + "'></") + "script>");
        loaded = true;
      };
      return function() {
        if (loaded) {
          return false;
        }
        init();
        return true;
      };
    })();
    ns.manualLine = {};
    ns.manualLine.config = {
      data_key: 'socialthingsManuallinebutton'
    };
    ns.manualLine.isSmartphone = function() {
      return navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/i);
    };
    ns.manualLine.Button = (function() {

      Button.defaults = {
        url: function() {
          return location.href;
        },
        title: function() {
          return document.title;
        },
        href_creater: function(title, url) {
          return "http://line.naver.jp/R/msg/text/?" + title + "%0D%0A" + url;
        },
        hide_when_pc: false,
        html: "<a href=\"#\"><img src=\"http://media.line.naver.jp/img/button/ja/88x20.png\" alt=\"Lineで送る\" width=\"88\" height=\"20\"></a>",
        prop_key_url: 'data-manualline-url',
        prop_key_title: 'data-manualline-title'
      };

      function Button($el, options) {
        this.$el = $el;
        this.options = $.extend({}, ns.manualLine.Button.defaults, options);
        if (this.options.hide_when_pc && (!ns.manualLine.isSmartphone())) {
          return;
        }
        this.render();
      }

      Button.prototype.render = function() {
        var href;
        this.$el.html(this.options.html);
        href = this._createHref();
        return $('a', this.$el).attr('href', href);
      };

      Button.prototype._createHref = function() {
        var href, title, url;
        title = this._createTitle();
        url = this._createUrl();
        href = this.options.href_creater(title, url);
        return href;
      };

      Button.prototype._createTitle = function() {
        var title;
        title = this._getValFromDataProp(this.options.prop_key_title);
        if (title != null) {
          return title;
        }
        return this._handleOptionVal(this.options.title);
      };

      Button.prototype._createUrl = function() {
        var url;
        url = this._getValFromDataProp(this.options.prop_key_url);
        if (url != null) {
          return url;
        }
        return this._handleOptionVal(this.options.url);
      };

      Button.prototype._getValFromDataProp = function(propName) {
        var val;
        val = this.$el.attr(propName);
        if (val != null) {
          return val;
        }
        return null;
      };

      Button.prototype._handleOptionVal = function(val) {
        switch ($.type(val)) {
          case 'function':
            return val();
          default:
            return val;
        }
      };

      return Button;

    })();
    $.fn.manualLineButton = function(options) {
      return this.each(function(i, el) {
        var $el, data_key, instance;
        $el = $(el);
        data_key = ns.manualLine.config.data_key;
        instance = $el.data(data_key);
        if (instance == null) {
          instance = new ns.manualLine.Button($el, options);
        }
        $el.data(data_key, instance);
      });
    };
    ns.pocket = {};
    ns.pocket.loadJS = function() {
      return $.getScript('https://widgets.getpocket.com/v1/j/btn.js?v=1');
    };
    ns.pocket.applyWidgets = function() {
      ns.pocket.loadJS();
    };
    ns.mixi = {};
    ns.mixi.loadJS = (function() {
      var init;
      init = function(d, s) {
        var fjs, js, p;
        if (d == null) {
          d = document;
        }
        if (s == null) {
          s = "script";
        }
        fjs = d.getElementsByTagName(s)[0];
        p = (/^http:/.test(d.location) ? "http" : "https");
        js = d.createElement(s);
        js.src = p + "://static.mixi.jp/js/share.js";
        fjs.parentNode.insertBefore(js, fjs);
      };
      return function() {
        init();
        return true;
      };
    })();
    ns.mixi.applyWidgets = function() {
      ns.mixi.loadJS();
    };
    ns.sumally = {};
    ns.sumally.loadJS = (function() {
      var init, loaded;
      loaded = false;
      init = function() {
        return (function(d, s, id) {
          var fjs, js, p;
          fjs = d.getElementsByTagName(s)[0];
          p = (/^http:/.test(d.location) ? "http" : "https");
          js = d.createElement(s);
          js.id = id;
          js.src = p + '://platform.sumally.com/buttons.min.js';
          fjs.parentNode.insertBefore(js, fjs);
          loaded = true;
        })(document, "script", "sumally-bjs");
      };
      return function() {
        if (loaded) {
          return false;
        }
        init();
        return true;
      };
    })();
    ns.sumally.applyWidgets = function() {
      if (!ns.sumally.loadJS()) {
        window.sumally.buttons.load();
      }
    };
    return $.socialthings = ns;
  })(jQuery);

}).call(this);
