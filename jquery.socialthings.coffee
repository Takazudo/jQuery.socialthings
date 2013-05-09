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

  # ============================================================
  # globalify

  $.socialthings = ns
