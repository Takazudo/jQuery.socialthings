do ($ = jQuery, window = window, document = document) ->

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
      src = "//connect.facebook.net/#{o.locale}/all.js#xfbml=1"
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

  $.fn.initFacebookThings = (options) ->
    return @each (i, el) ->
      unless ns.facebook.loadJS()
        window.FB.XFBML.parse el

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

  ns.twitter.applyWidgets = ->
    unless ns.twitter.loadJS()
      # https://dev.twitter.com/discussions/6860
      window.twttr.widgets.load()
    return

  # ============================================================
  # gplus
  
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

  ns.line = {}

  ns.line.loadJS = do ->
    
    loaded = false

    init = ->
      p = (if /^http:/.test(document.location) then "http" else "https")
      src = p + '://media.line.naver.jp/js/line-button.js?v=20130508'
      document.write "<script src='#{src}'></script>"
      loaded = true
      return

    return ->
      return false if loaded
      init()
      return true
  
  # ============================================================
  # globalify

  $.socialthings = ns
