/******************************************************************************/
/*********************************** PARSE RSS ********************************/
/******************************************************************************/
(function($) {
    if (!$.jQRSS) { 
        $.extend({  
            jQRSS: function(rss, options, func) {
                if (arguments.length <= 0) return false;

                var str, obj, fun;
                for (i=0;i<arguments.length;i++) {
                    switch(typeof arguments[i]) {
                        case "string":
                            str = arguments[i];
                            break;
                        case "object":
                            obj = arguments[i];
                            break;
                        case "function":
                            fun = arguments[i];
                            break;
                    }
                }

                if (str == null || str == "") {
                    if (!obj['rss']) return false;
                    if (obj.rss == null || obj.rss == "") return false;
                }

                var o = $.extend(true, {}, $.jQRSS.defaults);

                if (typeof obj == "object") {
                    if ($.jQRSS.methods.getObjLength(obj) > 0) {
                        o = $.extend(true, o, obj);
                    }
                }

                if (str != "" && !o.rss) o.rss = str;
                o.rss = escape(o.rss);

                var gURL = $.jQRSS.props.gURL 
                    + $.jQRSS.props.type 
                    + "?v=" + $.jQRSS.props.ver
                    + "&q=" + o.rss
                    + "&callback=" + $.jQRSS.props.callback;

                var ajaxData = {
                        num: o.count,
                        output: o.output,
                    };

                if (o.historical) ajaxData.scoring = $.jQRSS.props.scoring;
                if (o.userip != null) ajaxData.scoring = o.userip;

                $.ajax({
                    url: gURL,
                    beforeSend: function (jqXHR, settings) {
                    
                      console.log(new Array(30).join('-'), "REQUESTING RSS XML", new Array(30).join('-'));
                      console.log({ ajaxData: ajaxData, ajaxRequest: settings.url, jqXHR: jqXHR, settings: settings, options: o }); 
                      console.log(new Array(80).join('-')); 
                      
                      },
                    dataType: o.output != "xml" ? "json" : "xml",
                    data: ajaxData,
                    type: "GET",
                    xhrFields: { withCredentials: true },
                    error: function (jqXHR, textStatus, errorThrown) { return new Array("ERROR", { jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown } ); },
                    success: function (data, textStatus, jqXHR) {  
                        var f = data['responseData'] ? data.responseData['feed'] ? data.responseData.feed : null : null,
                            e = data['responseData'] ? data.responseData['feed'] ? data.responseData.feed['entries'] ? data.responseData.feed.entries : null : null : null
                        console.log(new Array(30).join('-'), "SUCCESS", new Array(30).join('-'));
                        console.log({ data: data, textStatus: textStatus, jqXHR: jqXHR, feed: f, entries: e });
                        console.log(new Array(70).join('-'));

                        if (fun) {
                            return fun.call(this, data['responseData'] ? data.responseData['feed'] ? data.responseData.feed : data.responseData : null);
                        }
                        else {
                            return { data: data, textStatus: textStatus, jqXHR: jqXHR, feed: f, entries: e };
                        }
                    }
                });
            }
        });
        $.jQRSS.props = {
            callback: "?",
            gURL: "http://ajax.googleapis.com/ajax/services/feed/",
            scoring: "h",
            type: "load",
            ver: "1.0"
        };
        $.jQRSS.methods = {
            getObjLength: function(obj) {
                if (typeof obj != "object") return -1;
                var objLength = 0;
                $.each(obj, function(k, v) { objLength++; })
                return objLength;
            }
        };
        $.jQRSS.defaults = {
            count: "10", // max 100, -1 defaults 100
            historical: false,
            output: "json", // json, json_xml, xml
            rss: null,  //  url OR search term like "Official Google Blog"
            userip: null
        };
    }
})(jQuery);

!function ($) {

  $(function(){

    var $window = $(window)
    
    var visited = $.cookie("visited")

    if (visited == null) {
      

      // Show user the search input and short link for a second. 
      setTimeout(function() {
          $("#search-form").animate({width: "50px"}, 500);
          $(".search-input").animate({width: "0px"}, 500);
          $("#pantas").toggleClass('border in'); 
      }, 1500);


        $.cookie('visited', 'yes'); 
        //alert($.cookie("visited"));         
    } else {
      $("#search-form").animate({width: "50px"}, 10);
      $(".search-input").animate({width: "0px"}, 10);
      $("#pantas").toggleClass('border in'); 
    }
    // set cookie
    $.cookie('visited', 'yes', { expires: 360, path: '/' });

    $('.navbar-wrapper').height($(".navbar").height());
    $('.navbar').affix({
        offset: $('.navbar').position()
    });
    
    /*
    var html = '';
    html += '<select>\r';
    for (var year = 2012; year >= 1970; year--) {
      //html += '<a href="#" class="btn btn-mini btn-primary" data-year="'+ year +'">'+ year +'</a>\r';
      
      html += '<option value="' + year +'">' + year + '</option>\r';
      
    }
    html += '</select>';
    console.log('HTML year link: '+html);
    $('div#btn-year').after(html);
    */
    // set required if subcribe focus
    //$("input.subscribe-email[type=email]").attr('required'); //remove and use default browser
    
    /*
    
    
    // Assign .active class to side nav
    $('#btn-pautan').click(function()
    {
      $('i').removeClass('icon-double-angle-up');
      $('i').addClass('icon-double-angle-down');
    });$('#btn-pautan').on('click', '.icon-double-angle-up', function(e){
      e.preventDefault();
      $(this).toggleClass('icon-double-angle-down');
    });
    
    $("input.search-query[type=text]").hover(function()
    {
      //alert($(this).parent().width()); 
      //$(this).parent().animate({"width": "+30%"}, "slow");
      $(this).parent().toggleClass('span4');
      return false;
    });
    
    ///
    
    
    
    ///
    */
    
    $(window).resize(function(){
       
       var width = $(window).width();
       
       console.log('resize called: '+width);
       if(width >= 500 && width <= 1200){
           $('#search-form').removeClass('pull-right').addClass('pull-left');
       }
       else{
           $('#search-form').removeClass('pull-left').addClass('pull-right');
       }
    })
    .resize();//trigger the resize event on page load.
    
    

    $(".search-button").click(function() { 
    var $_searchForm = $("#search-form");
		var $_searchInput = $(".search-input");
		var $_searchButton = $(".search-button");
    
    
		if($_searchInput.width() > 10) {
			$_searchForm.animate({width: $_searchButton.width()+"px"});

			$_searchInput.animate({width: "0px"}, function() { });
		} else { 
			$_searchForm.animate({width: (parseInt($_searchButton.width())+240)+"px"});
			$_searchInput.animate({width: "240px"}, function() { $_searchForm.toggleClass("visible"); this.focus(); });
			
		}
    });
    

    $('#btn-pautan').click(function()
    {
      $('#btn-pautan i').toggleClass('icon-double-angle-down');
      $('div#pantas').toggleClass('border', 100);    
     
    });

    
    // Assign .active class to side nav
    $('.bs-docs-sidenav li a').click(function()
    {
      $('.bs-docs-sidenav li').removeClass('active');
      $(this).parent().addClass('active');
    });

    // side bar

      $('.bs-docs-sidenav').affix()


    // make code pretty
    window.prettyPrint && prettyPrint()

    // add-ons
    $('.add-on :checkbox').on('click', function () {
      var $this = $(this)
        , method = $this.attr('checked') ? 'addClass' : 'removeClass'
      $(this).parents('.add-on')[method]('active')
    })

    // add tipsies to grid for scaffolding
    if ($('#gridSystem').length) {
      $('#gridSystem').tooltip({
          selector: '.show-grid > div:not(.tooltip)'
        , title: function () { return $(this).width() + 'px' }
      })
    }

    // tooltip demo
    $('.tooltip-demo').tooltip({
      selector: "a[rel=tooltip]"
    })

    $('.tooltip-test').tooltip()
    $('.popover-test').popover()

    // popover demo
    $("a[rel=popover]")
      .popover()
      .click(function(e) {
        e.preventDefault()
      })

    // button state demo
    $('#fat-btn')
      .click(function () {
        var btn = $(this)
        btn.button('loading')
        setTimeout(function () {
          btn.button('reset')
        }, 3000)
      })

    // carousel demo
    $('#myCarousel').carousel()

    // javascript build logic
    var inputsComponent = $("#components.download input")
      , inputsPlugin = $("#plugins.download input")
      , inputsVariables = $("#variables.download input")

    // toggle all plugin checkboxes
    $('#components.download .toggle-all').on('click', function (e) {
      e.preventDefault()
      inputsComponent.attr('checked', !inputsComponent.is(':checked'))
    })

    $('#plugins.download .toggle-all').on('click', function (e) {
      e.preventDefault()
      inputsPlugin.attr('checked', !inputsPlugin.is(':checked'))
    })

    $('#variables.download .toggle-all').on('click', function (e) {
      e.preventDefault()
      inputsVariables.val('')
    })

    // request built javascript
    $('.download-btn .btn').on('click', function () {

      var css = $("#components.download input:checked")
            .map(function () { return this.value })
            .toArray()
        , js = $("#plugins.download input:checked")
            .map(function () { return this.value })
            .toArray()
        , vars = {}
        , img = ['glyphicons-halflings.png', 'glyphicons-halflings-white.png']

    $("#variables.download input")
      .each(function () {
        $(this).val() && (vars[ $(this).prev().text() ] = $(this).val())
      })

      $.ajax({
        type: 'POST'
      , url: /\?dev/.test(window.location) ? 'http://localhost:3000' : 'http://bootstrap.herokuapp.com'
      , dataType: 'jsonpi'
      , params: {
          js: js
        , css: css
        , vars: vars
        , img: img
      }
      })
    })
  })
  

// Modified from the original jsonpi https://github.com/benvinegar/jquery-jsonpi
$.ajaxTransport('jsonpi', function(opts, originalOptions, jqXHR) {
  var url = opts.url;

  return {
    send: function(_, completeCallback) {
      var name = 'jQuery_iframe_' + jQuery.now()
        , iframe, form

      iframe = $('<iframe>')
        .attr('name', name)
        .appendTo('head')

      form = $('<form>')
        .attr('method', opts.type) // GET or POST
        .attr('action', url)
        .attr('target', name)

      $.each(opts.params, function(k, v) {

        $('<input>')
          .attr('type', 'hidden')
          .attr('name', k)
          .attr('value', typeof v == 'string' ? v : JSON.stringify(v))
          .appendTo(form)
      })

      form.appendTo('body').submit()
    }
  }
})

if (!$(".pagination")[0]){
  var current = 1;
  //console.log('Clicked: '+current);
}

$('#tabPekeliling li a').click(function() {
    var type;
    
    switch ($('#tabPekeliling li a').index(this)) {
      case 1 :
        type = "spp";
        $('form.frm-pekeliling').show();
        break;
      case 2 :  // we dont support Surat Edaran for the moment.
        type = "se";
        $('form.frm-pekeliling').hide();
        //$('tab-se-content').append('<p>Test</p>');
        break;
      default:
        type = "pp";
        $('form.frm-pekeliling').show();
    }
    console.log('data-type:'+type);
    
    $('input[name="type"]').val(type);
    doSearch(current);
  });

$(".frm-search").submit(function(e){
  //var terms = $('input[name="q"]').val();
  //console.log("Search query: " + terms);
  doSearch(current);
  return false;
});

$('select.frm-year, select.frm-cat, select.frm-core').change(function() {
  doSearch(current);
  return false;
});

function doSearch(c) {
  var type = $('input[name="type"]').val()
      , year = $('select.frm-year').val()
      , category = $('select.frm-cat').val()
      , core = $('select.frm-core').val()
      , page = c
      , term = $('input[name="q"]').val()
      , params;
      
      console.log('term: '+term);  
  
  // check if search terms exist and update params accordingly
  params = (term != '')
          ? { 'type': type
            , 'year': year
            , 'cat': category
            , 'core': core
            , 'page': page
            , 'term': term }
            
          : { 'type': type
            , 'year': year
            , 'cat': category
            , 'core': core
            , 'page': page };
            
   console.log(JSON.stringify(params));
            

  $('#tab-'+type+'-content').empty();
  
  $.ajax({
    type: "GET",
    url: "api.php",
    data: params,
    dataType: "html",
    beforeSend:function(){
      $('#ajax-load').html('<div class="pull-right loading fade in"><i class="icon-spinner icon-spin icon-2x pull-left"></i> Please wait..</div>');
    }
  }).done(function( msg ) {
    //console.log("Data Saved: " + msg);
    $('#tab-'+type+'-content').html(msg);
    $('.loading').remove();
  });
}

$(document).on('click', '.pagination a',function(e) {
   e.preventDefault();
   var current = $(this).data('page');
   //console.log('Clicked: '+current);
   doSearch(current);
});

/******************************************************************************/
/*********************************   PENERBITAN  ******************************/
/******************************************************************************/
$('#tabPenerbitan li a').click(function() {

  var type = $(this).data('type')
    , rssUrl
    , elementContent = $('#tab-penerbitan-'+type);
    
  switch (type) {
    case 'laporan' : //do nothing for static laporan
      break;
    case 'artikel' :  // get rss for category article
      rssUrl = "http://www.jpa.gov.my/index.php?option=com_content&view=category&id=141&Itemid=47&format=feed&type=rss";
      doRSS(rssUrl, elementContent, type);
      break;
    case 'akhbar' :  // get rss for category akhbar
      rssUrl = "http://www.jpa.gov.my/index.php?option=com_content&view=category&id=139&Itemid=98&lang=ms&format=feed&type=rss";
      doRSS(rssUrl, elementContent, type);
      break;
    //default:
      //rssUrl = "http://www.jpa.gov.my/index.php?option=com_content&view=category&id=141&Itemid=47&format=feed&type=rss";
      //break;
  }

  //console.log($(this).data('type'));
  console.log(rssUrl);
  console.log('#tab-penerbitan-'+type);
  
});


function doRSS(u, e, t) {
  //'http://www.jpa.gov.my/index.php?option=com_content&view=category&id=141&Itemid=47&format=feed&type=rss'
  $.jQRSS(u, function(feed) {
  
  var entries = feed.entries
              , feedTemplate = ''
              , feedHeader = ''
              , feedContent = ''
              , feedFooter = ''
              , feedList = ''
              , monthName = [ "Jan"
                             , "Feb"
                             , "Mac"
                             , "Apr"
                             , "May"
                             , "Jun"
                             , "Jul"
                             , "Aug"
                             , "Sep"
                             , "Oct"
                             , "Nov"
                             , "Dec" ];
                               
  // we need to convert publishedDate into new array: { date: { day: day, month: month, year: year}}
  for (var i = 0; i < entries.length; i++) {
  
    var feedPublishDate = entries[i].publishedDate
      , dateEntries = new Date(feedPublishDate);
    
  //console.log('Date RSS: '+feedPublishDate);
  //console.log('Date UTC: '+dateEntries.toISOString());
      
    date = {
      utc: dateEntries.toISOString(),
      year: dateEntries.getUTCFullYear(),
      month: dateEntries.getUTCMonth()+1,
      monthShort: monthName[dateEntries.getUTCMonth()],
      day: dateEntries.getUTCDate(),
      hours: dateEntries.getUTCHours(),
      minutes: dateEntries.getUTCMinutes(),
      seconds: dateEntries.getUTCSeconds(),
      offset: dateEntries.getTimezoneOffset()/60
    }
    entries[i].publishedDate = date;  
    entries[i].pageNum = i + 1;
    entries[i].type = t;    
  }
  //console.log(JSON.stringify(entries));
    

  $.Mustache.load('./vendor/templates/artikel.htm')
    .fail(function () { 
      $('#tab-penerbitan-artikel .artikel').append('Failed to load templates from <code>artikel.htm</code>');
    })
    .done(function () {
      var output = $('#artikel-test');
      e.empty().mustache('artikel-template', entries);
      //console.log(JSON.stringify($.Mustache.templates()));
    });
    
  });
}

//function notify() { alert("clicked"); }
//$('button.shareables').on("click", notify);

// Fix issue Navbar hides initial content when jumping to in-page anchor  https://github.com/twitter/bootstrap/issues/1768
var shiftWindow = function() { scrollBy(0, -60) };
if (location.hash) shiftWindow();
window.addEventListener("hashchange", shiftWindow);

}(window.jQuery)