/*!
 * jQuery YouTube Lazy-Loader Plugin
 * http://lab.abhinayrathore.com/jquery-youtube-lazyloader/
 * https://github.com/abhinayrathore/jQuery-YouTube-Lazy-Loader-Plugin
 */
(function ($) {
    //Plugin methods
    var methods = {
        //initialize plugin
        init: function (options) {
            options = $.extend({}, $.fn.YouTubeLazyLoader.defaults, options);

            return this.each(function () {
                var obj = $(this);
                var data = obj.data('YouTube');
                if (!data) { //check if event is already assigned
                    obj.data('YouTubeLazyLoader', true);

                    var youtubeId = options.youtubeId;
                    if ($.trim(youtubeId) == '' || youtubeId === false) {
                        youtubeId = obj.attr(options.idAttribute);
                    }
                    var YouTubeURL = getYouTubeUrl(youtubeId, options);
                    var YouTubePlayerIframe = getYouTubePlayer(YouTubeURL, obj.width(), obj.height());
                    obj.html(YouTubePlayerIframe);
                    if (options.embedTitle) {
                        var position = options.titlePosition;
                        if (position != "top" || position != "bottom") {
                            position = "bottom";
                        }
                        setYouTubeTitle(youtubeId, obj, position);
                    }
                }
            });
        },
        destroy: function () {
            return this.each(function () {
                $(this).unbind(".YouTubeLazyLoader").removeData('YouTube');
            });
        }
    };

    function getYouTubeUrl(youtubeId, options) {
        var YouTubeURL = "//www.youtube.com/embed/" + youtubeId + "?rel=0&showsearch=0&autohide=" + options.autohide;
        YouTubeURL += "&autoplay=" + options.autoplay + "&controls=" + options.controls + "&fs=" + options.fs + "&loop=" + options.loop;
        YouTubeURL += "&showinfo=" + options.showinfo + "&color=" + options.color + "&theme=" + options.theme;
        YouTubeURL += "&wmode=transparent";
        return YouTubeURL;
    }

    function getYouTubePlayer(URL, width, height) {
        var YouTubePlayer = '<iframe title="YouTube video player" width="' + width + '" height="' + height + '" ';
        YouTubePlayer += 'style="margin:0; padding:0; box-sizing:border-box; border:0;" ';
        YouTubePlayer += 'src="' + URL + '" frameborder="0" allowfullscreen seamless></iframe>';
        return YouTubePlayer;
    }

    function setYouTubeTitle(youtubeId, obj, position) {
        var url = "https://gdata.youtube.com/feeds/api/videos/" + youtubeId + "?v=2&alt=json";
        $.ajax({
            url: url,
            dataType: 'jsonp',
            cache: true,
            success: function (data) {
                var titleDiv = "<div class=\"title\" style=\"text-align: center;\">" + data.entry.title.$t + "</div>";
                if (position == "top") {
                    obj.prepend(titleDiv);
                } else {
                    obj.append(titleDiv);
                }
            }
        });
    }

    $.fn.YouTubeLazyLoader = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on Bootstrap.YouTubeLazyLoader');
        }
    };

    //default configuration
    $.fn.YouTubeLazyLoader.defaults = {
        youtubeId: '',
        title: '',
        embedTitle: true,
        titlePosition: 'bottom',
        idAttribute: 'data-youtube',
        cssClass: 'YouTubeLazyLoadBox',
        autohide: 2,
        autoplay: 0,
        color: 'red',
        controls: 1,
        fs: 1,
        loop: 0,
        showinfo: 0,
        theme: 'light'
    };
})(jQuery);
