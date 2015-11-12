/*!
 * jQuery.tipsy
 * Copyright (c) 2014 CreativeDream
 * Website: http://creativedream.net/plugins/
 * Version: 1.0 (18-11-2014)
 * Requires: jQuery v1.7.1 or later
 */
(function(e) {
    e.fn.tipsy = function(t){
        if(typeof(t) == "string" && ["show","hide"].indexOf(t)>-1){
            switch(t){
                case "show":
                    $(this).trigger('tipsy.show');
                break;
                case "hide":
                    $(this).trigger('tipsy.hide');
                break;
            }
            return this;
        }
        var n = e.extend({
            arrowWidth: 10,
            attr: 'data-tipsy',
            cls: null,
            duration: 150,
            offset: 7,
            position: 'top-center',
            trigger: 'hover',
            onShow: null,
            onHide: null
        }, t);
        return this.each(function(t, r) {
            var s = e(r),
                b = '.tipsy',
                o = e('<div class="tipsy"></div>'),
                p = ["top-left","top-center","top-right","bottom-left","bottom-center","bottom-right","left","right"],
                f = {
                    init: function(){
                        var d = {};
                        switch(n.trigger){
                            case 'hover':
                                d = {
                                    mouseenter: f._show,
                                    mouseleave: f._hide
                                }
                            break;
                            case 'focus':
                                d = {
                                    focus: f._show,
                                    blur: f._hide
                                }
                            break;
                            case 'click':
                                d = {
                                    click: function(e){
                                        if(!f._clSe){
                                            f._clSe = true;
                                            f._show(e);
                                        }else{
                                            f._clSe = false;
                                            f._hide(e);
                                        }
                                    },
                                }
                            break;
                            case 'manual':
                                f._unbindOptions();
                                d = {
                                    "tipsy.show": function(e){
                                        f._clSe = true;
                                        f._show(e);
                                    },
                                    "tipsy.hide": function(e){
                                        f._clSe = false;
                                        f._hide(e);
                                    }
                                }
                            break;
                        }
                        s.on(d);
                        o.hide();
                    },
                    _show: function(e){
                        $(b).remove();
                        f._clear();
                        if(f.hasAttr(n.attr+'-disabled')){return false}
                        f._createBox();
                        if(n.trigger!='manual'){f._bindOptions()}
                    },
                    _hide: function(e){
                        f._fixTitle(true);
                        o.stop(true,true).fadeOut(n.duration, function(){
                            n.onHide != null && typeof n.onHide == "function" ? n.onHide(o, s) : null
                            f._clear();
                            $(this).remove();
                        })
                    },
                    _showIn: function(){
                        o.stop(true,true).fadeIn(n.duration, function(){
                            n.onShow != null && typeof n.onShow == "function" ? n.onShow(o, s) : null
                        })
                    },
                    _bindOptions: function(){
                        e(window).bind("contextmenu", function() {
                            f._hide()
                        }).bind("blur",function() {
                            f._hide()
                        }).bind("resize", function() {
                            f._hide()
                        }).bind("scroll", function() {
                            f._hide()
                        })
                    },
                    _unbindOptions: function(){
                        e(window).unbind("contextmenu", function() {
                            f._hide()
                        }).unbind("blur", function() {
                            f._hide()
                        }).unbind("resize", function() {
                            f._hide()
                        }).unbind("scroll", function() {
                            f._hide()
                        })
                    },
                    _clear: function(){
                        o.attr("class","tipsy").empty();
                        f._lsWpI = [];
                        f._lsWtI = [];
                    },
                    hasAttr: function(e){
                        e=s.attr(e);return typeof e!==typeof undefined&&e!==false
                    },
                    _fixTitle: function(a){
                        if(a){
                            if (f.hasAttr('data-title') && !f.hasAttr('title') && f._lsWtI[0] == true) {
                                s.attr('title', f._lsWtI[1] || '').removeAttr('data-title');
                            }
                        }else{
                            if (f.hasAttr('title') || !f.hasAttr('data-title')) {
                                f._lsWtI = [true, s.attr('title')]
                                s.attr('data-title', s.attr('title') || '').removeAttr('title');
                            }
                        }
                    },
                    _getTitle: function(){
                        f._fixTitle();
                        var title = s.attr('data-title');
                        title = '' + title;

                        return title;
                    },
                    _position: function(a){
                        var css = {top: 0, left: 0},
                            position = (a ? a : (f.hasAttr(n.attr+'-position') ? s.attr(n.attr+'-position') : n.position)),
                            arrow = position.split('-'),
                            offset = (f.hasAttr(n.attr+'-offset') ? s.attr(n.attr+'-offset') : n.offset),
                            style = {
                                offsetTop:  s.offset().top,
                                offsetLeft: s.offset().left,
                                width: s.outerWidth(),
                                height: s.outerHeight()
                            },
                            tStyle = {
                                width: o.outerWidth(),
                                height: o.outerHeight()
                            },
                            wStyle = {
                                width: $(window).outerWidth(),
                                height: $(window).outerHeight(),
                                scrollTop: $(window).scrollTop(),
                                scrollLeft: $(window).scrollLeft(),
                            };

                        if($.inArray(position, p)==-1 || $.inArray(position, f._lsWpI)!==-1){ f._hide(); return css }else{ f._lsWpI.push(position) }

                        switch(arrow[0]){
                            case 'bottom':
                                css.top = style.offsetTop + style.height + offset;
                                if(css.top >= wStyle.height + wStyle.scrollTop){
                                    return f._position('top' + '-' + arrow[1])
                                }
                                o.addClass('arrow-top');
                            break;
                            case 'top':
                                css.top = style.offsetTop - tStyle.height - offset;
                                if(css.top - wStyle.scrollTop <= 0){
                                    return f._position('bottom' + '-' + arrow[1])
                                }
                                o.addClass('arrow-bottom');
                            break;
                            case 'left':
                                css.top = style.offsetTop + style.height / 2 - tStyle.height / 2;
                                css.left =  style.offsetLeft - tStyle.width - offset;
                                if(css.left <= 0){
                                    return f._position('right')
                                }
                                o.addClass('arrow-side-right');
                                return css;
                            break;
                            case 'right':
                                css.top = style.offsetTop + style.height / 2 - tStyle.height / 2;
                                css.left =  style.offsetLeft + style.width + offset;
                                if(css.left + tStyle.width > wStyle.width){
                                    return f._position('left')
                                }
                                o.addClass('arrow-side-left');
                                return css;
                            break;
                        }
                        switch(arrow[1]){
                            case 'left':
                                css.left = style.offsetLeft + style.width / 2 - tStyle.width + n.arrowWidth;
                                if(css.left <= 0){
                                    return f._position(arrow[0] + '-' + 'right')
                                }
                                o.addClass('arrow-right');
                            break;
                            case 'center':
                                css.left = style.offsetLeft + style.width / 2 - tStyle.width / 2;
                                if(css.left + tStyle.width > wStyle.width){
                                    return f._position(arrow[0] + '-' + 'left')
                                }
                                if(css.left <= 0){
                                    return f._position(arrow[0] + '-' + 'right')
                                }
                                o.addClass('arrow-center');
                            break;
                            case 'right':
                                css.left = style.offsetLeft + style.width / 2 - n.arrowWidth;
                                if(css.left + tStyle.width > wStyle.width){
                                    return f._position(arrow[0] + '-' + 'left')
                                }
                                o.addClass('arrow-left');
                            break;
                        }

                        return css;
                    },
                    _createBox: function(){
                        o.html(f._getTitle()).appendTo('body');
                        if((n.cls!=null && typeof(n.cls)=="string") || f.hasAttr(n.attr+'-cls')){
                            o.addClass((f.hasAttr(n.attr+'-cls') ? s.attr(n.attr+'-cls') : n.cls));
                        }
                        o.css(f._position());
                        f._showIn();
                    },
                    _lsWtI: [],
                    _lsWpI: []
                }
            f.init();
            return this;
        });
    }
})(jQuery);
