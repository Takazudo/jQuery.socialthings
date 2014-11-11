do ($ = jQuery) ->

  ns = {}

  # ============================================================
  # facebook

  ns.facebook = {}

  ns.facebook.options = 
    locale: 'en_US' # if japanese, ja_JP
    appId: null # specify your appId to track

  ns.facebook.loadJS = do ->

    loaded = false

    init = ->
      $('body').append '<div id="fb-root"></div>'
      o = ns.facebook.options
      src = "//connect.facebook.net/#{o.locale}/sdk.js#xfbml=1&version=v2.0"
      if o.appId
        src += "&appId=#{o.appId}"
      do (d = document, s = 'script', id = 'facebook-jssdk') ->
        fjs = d.getElementsByTagName(s)[0]
        return if d.getElementById(id)
        js = d.createElement(s)
        js.id = id
        js.src = src
        fjs.parentNode.insertBefore js, fjs
      loaded = true
      return

    return ->
      return false if loaded
      init()
      return true
  
  # to run like button initialization, we need to wait for
  # FB object which will be prepared via facebook JavaScript.
  
  ns.facebook.waitForPreparation = do ->
  
    interval = 250
    promise = null
    
    runCheck = ->
      promise = $.Deferred (defer) ->
        check = ->
          if window.FB?.XFBML?
            defer.resolve()
          else
            setTimeout check, interval
        check()
      .promise()
    
    return ->
      unless promise
        runCheck()
      return promise
      
  # bridge to plugin

  $.fn.initFacebookThings = (options) ->
    return @each (i, el) ->
      unless ns.facebook.loadJS()
        ns.facebook.waitForPreparation().done ->
          window.FB.XFBML.parse el

  # ============================================================
  # facebook share button

  ns.facebookShareButton = {}

  class ns.facebookShareButton.Button

    @defaults =
      windowname: 'facebook-share-dialog'
      width: null
      height: null
      url: null
      html: null
      tweakHref: true

    constructor: (@$el, options) ->
      @options = $.extend {}, ns.facebookShareButton.Button.defaults, options
      @_tweakInsideHtml()
      @_handleDataAttrs()
      @_prepareUrl()
      @_eventify()

    open: ->
      o = @options
      name = o.windowname
      args = [@_url, name]
      if o.width? and o.height?
        args.push "width=#{o.width},height=#{o.height}"
      window.open.apply window, args

    _tweakInsideHtml: ->
      return unless @options.html?
      @$el.html @options.html

    _prepareUrl: ->
      o = @options
      shareUrl = o.url or location.href
      @_url = "https://www.facebook.com/sharer/sharer.php?u=#{encodeURIComponent(shareUrl)}"
      if o.tweakHref
        @$el.attr 'href', @_url

    _handleAttr: (key) ->
      prop = key.replace /^data-facebookshare-/, ''
      val = @$el.attr key
      return unless val
      @options[prop] = val

    _handleDataAttrs: ->
      @_handleAttr 'data-facebookshare-windowname'
      @_handleAttr 'data-facebookshare-width'
      @_handleAttr 'data-facebookshare-height'
      @_handleAttr 'data-facebookshare-url'

    _eventify: ->
      @$el.click (e) =>
        e.preventDefault()
        @open()

  $.fn.facebookShareButton = (options) ->
    key = 'facebooksharebutton'
    return @each (i, el) ->
      $el = $(el)
      instance = new ns.facebookShareButton.Button $el, options
      if $el.data key
        return
      $el.data key, instance

  # ============================================================
  # twitter
  
  ns.twitter = {}

  ns.twitter.loadJS = do ->
    
    loaded = false

    init = ->
      do (d = document, s = "script", id = "twitter-wjs") ->
        fjs = d.getElementsByTagName(s)[0]
        p = (if /^http:/.test(d.location) then "http" else "https")
        unless d.getElementById(id)
          js = d.createElement(s)
          js.id = id
          js.src = p + "://platform.twitter.com/widgets.js"
          fjs.parentNode.insertBefore js, fjs
      loaded = true
      return

    return ->
      return false if loaded
      init()
      return true
      
  # to run twitter button initialization, we need to wait for
  # twttr object which will be prepared via twitter JavaScript.
  
  ns.twitter.waitForPreparation = do ->
  
    interval = 250
    promise = null
    
    runCheck = ->
      promise = $.Deferred (defer) ->
        check = ->
          if window.twttr?.widgets?.load?
            defer.resolve()
          else
            setTimeout check, interval
        check()
      .promise()
    
    return ->
      unless promise
        runCheck()
      return promise
      
  # API
  
  ns.twitter.applyWidgets = ->
    unless ns.twitter.loadJS()
      # https://dev.twitter.com/discussions/6860
      ns.twitter.waitForPreparation().done ->
        window.twttr.widgets.load()
    return

  # ============================================================
  # twitter custom button

  ns.twitterShareButton = {}

  class ns.twitterShareButton.Button

    @defaults =
      windowname: 'twitter-tweet-dialog'
      width: null
      height: null
      url: null
      html: null
      text: null
      via: null
      related: null
      tweakHref: true

    constructor: (@$el, options) ->
      @options = $.extend {}, ns.twitterShareButton.Button.defaults, options
      @_tweakInsideHtml()
      @_handleDataAttrs()
      @_prepareUrl()
      @_eventify()

    open: ->
      o = @options
      name = o.windowname
      args = [@_url, name]
      if o.width? and o.height?
        args.push "width=#{o.width},height=#{o.height}"
      window.open.apply window, args

    _tweakInsideHtml: ->
      return unless @options.html?
      @$el.html @options.html

    _prepareUrl: ->
      o = @options
      shareUrl = o.url or location.href
      tweetText = o.text or document.title
      via = o.via
      related = o.related
      params = []
      params.push "url=#{encodeURIComponent(shareUrl)}" if shareUrl
      params.push "text=#{encodeURIComponent(tweetText)}" if tweetText
      params.push "via=#{encodeURIComponent(via)}" if via
      params.push "related=#{encodeURIComponent(related)}" if related
      @_url = "https://twitter.com/share?" + params.join "&"
      if o.tweakHref
        @$el.attr 'href', @_url

    _handleAttr: (key) ->
      prop = key.replace /^data-twittershare-/, ''
      val = @$el.attr key
      return unless val
      @options[prop] = val

    _handleDataAttrs: ->
      @_handleAttr 'data-twittershare-windowname'
      @_handleAttr 'data-twittershare-width'
      @_handleAttr 'data-twittershare-height'
      @_handleAttr 'data-twittershare-text'
      @_handleAttr 'data-twittershare-url'
      @_handleAttr 'data-twittershare-via'
      @_handleAttr 'data-twittershare-related'

    _eventify: ->
      @$el.click (e) =>
        e.preventDefault()
        @open()

  $.fn.twitterShareButton = (options) ->
    key = 'twittersharebutton'
    return @each (i, el) ->
      $el = $(el)
      instance = new ns.twitterShareButton.Button $el, options
      if $el.data key
        return
      $el.data key, instance


  # ============================================================
  # gplus
  # https://developers.google.com/+/web/+1button/?hl=en
  
  ns.gplus = {}
  ns.gplus.options = 
    lang: 'en' # if japanese, 'ja'

  ns.gplus.loadJS = do ->

    loaded = false

    init = ->
      window.___gcfg = lang: ns.gplus.options.lang
      $.getScript('https://apis.google.com/js/plusone.js')
      loaded = true
      return

    return ->
      return false if loaded
      init()
      return true

  ns.gplus.applyWidgets = ->
    unless ns.gplus.loadJS()
      if window.gapi
        window.gapi.plusone.go()
    return


  # ============================================================
  # hatebu

  ns.hatebu = {}
  ns.hatebu.disabled = false

  ns.hatebu.loadJS = do ->
    
    loaded = false

    shouldDisable = ->
      return true if document.location.protocol is 'https:'
      return false

    init = ->

      loaded = true

      if shouldDisable()
        ns.hatebu.disabled = true
        return

      do (d = document, s = "script", id = "hatebu-wjs") ->
        fjs = d.getElementsByTagName(s)[0]
        unless d.getElementById(id)
          js = d.createElement(s)
          js.id = id
          js.charset = 'utf-8'
          js.async = true
          js.src = 'http://b.st-hatena.com/js/bookmark_button.js'
          fjs.parentNode.insertBefore js, fjs

    return ->
      return false if loaded
      init()
      return true

  ns.hatebu.applyWidgets = ->
    unless ns.hatebu.loadJS()
      return if ns.hatebu.disabled
      Hatena.Bookmark.BookmarkButton.setup()
    return

  # ============================================================
  # line
  # http://media.line.naver.jp/ja/

  ns.line = {}

  ns.line.loadJS = do ->
    
    loaded = false

    init = ->
      p = (if /^http:/.test(document.location) then "http" else "https")
      src = p + '://media.line.naver.jp/js/line-button.js?v=20130508'
      document.write "<script src='#{src}'></" + "script>"
      loaded = true
      return

    return ->
      return false if loaded
      init()
      return true

  # ============================================================
  # manualLine
  # custom version of line button
  # http://media.line.naver.jp/howto/ja/

  ns.manualLine = {}
  ns.manualLine.config =
    data_key: 'socialthingsManuallinebutton'

  ns.manualLine.isSmartphone = ->
    return navigator.userAgent.match /(iPhone|iPod|iPad|Android)/i

  class ns.manualLine.Button
    
    @defaults =
      url: -> location.href
      title: -> document.title
      href_creater: (title, url) ->
        "http://line.naver.jp/R/msg/text/?#{title}%0D%0A#{url}"
      hide_when_pc: false
      html: """
        <a href="#"><img src="http://media.line.naver.jp/img/button/ja/88x20.png" alt="Lineで送る" width="88" height="20"></a>
      """
      prop_key_url: 'data-manualline-url'
      prop_key_title: 'data-manualline-title'

    constructor: (@$el, options) ->
      @options = $.extend {}, ns.manualLine.Button.defaults, options
      if @options.hide_when_pc and (not ns.manualLine.isSmartphone())
        return
      @render()
    
    render: ->
      @$el.html @options.html
      href = @_createHref()
      $('a', @$el).attr 'href', href

    _createHref: ->
      title = @_createTitle()
      url = @_createUrl()
      href = @options.href_creater title, url
      return href

    _createTitle: ->
      title = @_getValFromDataProp @options.prop_key_title
      return title if title?
      return @_handleOptionVal @options.title

    _createUrl: ->
      url = @_getValFromDataProp @options.prop_key_url
      return url if url?
      return @_handleOptionVal @options.url

    _getValFromDataProp: (propName) ->
      val = @$el.attr propName
      if val?
        return val
      return null

    _handleOptionVal: (val) ->
      switch $.type val
        when 'function'
          return val()
        else
          return val


  $.fn.manualLineButton = (options) ->
    return @each (i, el) ->
      $el = $(el)
      data_key = ns.manualLine.config.data_key
      instance = $el.data data_key
      unless instance?
        instance = new ns.manualLine.Button $el, options
      $el.data data_key, instance
      return

  # ============================================================
  # pocket
  # http://getpocket.com/publisher/button
  
  ns.pocket = {}

  ns.pocket.loadJS = ->
    $.getScript('https://widgets.getpocket.com/v1/j/btn.js?v=1')

  ns.pocket.applyWidgets = ->
    ns.pocket.loadJS()
    return

  # ============================================================
  # mixi_check
  # http://developer.mixi.co.jp/connect/mixi_plugin/mixi_check/

  ns.mixi = {}

  ns.mixi.loadJS = do ->

    init = (d = document, s = "script") ->
      fjs = d.getElementsByTagName(s)[0]
      p = (if /^http:/.test(d.location) then "http" else "https")
      js = d.createElement(s)
      js.src = p + "://static.mixi.jp/js/share.js"
      fjs.parentNode.insertBefore js, fjs
      return

    return ->
      init()
      return true

  ns.mixi.applyWidgets = ->
    # mixi check button does not have API for new buttons;
    # so, load js again.
    ns.mixi.loadJS()
    return

  # ============================================================
  # Sumally
  # http://sumally.com/about/buttons

  ns.sumally = {}

  ns.sumally.loadJS = do ->

    loaded = false

    init = ->

      do (d = document, s = "script", id = "sumally-bjs") ->
        fjs = d.getElementsByTagName(s)[0]
        p = (if /^http:/.test(d.location) then "http" else "https")
        js = d.createElement(s)
        js.id = id # without this, widgets do not work.
        js.src = p + '://platform.sumally.com/buttons.min.js'
        fjs.parentNode.insertBefore(js, fjs)
        loaded = true
        return

    return ->
      return false if loaded
      init()
      return true

  ns.sumally.applyWidgets = ->
    unless ns.sumally.loadJS()
      window.sumally.buttons.load()
    return

  # ============================================================
  # globalify

  $.socialthings = ns

