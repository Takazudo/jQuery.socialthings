/*! jQuery.socialthings (https://github.com/Takazudo/jQuery.socialthings)
 * lastupdate: 2013-05-13
 * version: 0.0.0
 * author: 'Takazudo' Takeshi Takatsudo <takazudo@gmail.com>
 * License: MIT */
(function() {

  (function($, window, document) {
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
    $.fn.initFacebookThings = function(options) {
      return this.each(function(i, el) {
        if (!ns.facebook.loadJS()) {
          return window.FB.XFBML.parse(el);
        }
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
    ns.twitter.applyWidgets = function() {
      if (!ns.twitter.loadJS()) {
        window.twttr.widgets.load();
      }
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
        document.write("<script src='" + src + "'></script>");
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
    return $.socialthings = ns;
  })(jQuery, window, document);

}).call(this);
