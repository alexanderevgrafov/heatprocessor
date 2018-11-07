define(function (require, exports, module) {

    var config = require('config.json'),
        io = require("io");

module.exports.browserController = function () {
    var self = this,
        enabled = true,
        currentArticle = 0,
        lampsOn = [],
        currentTitles = null,
        blockShow = false,
        overdrag_right = false,
        overdrag_left = false,
        drag_xpos,
        canvas = {
            leftBound: -4344 + 1920,
            rightBound: 0,
            wHeight: $(window).height(),
            wWidth: $(window).width()
        },
        titler = {};
    /*-- Timer --------*/
    var nowMoving = false, 
        inactiveTime = 0,
        movingSpeed = config.timer.movingSpeed;
    
    var socket = io.connect('http://' + config.node.host + ':' + config.node.port);


    function onFingerScroll(container, body, scroll) {
        var of1 = body.offset(),
            of2 = container.offset(),
            bar = scroll.find('.bar'),
            s = scroll.height() / body.height();

        bar.css({
            top: s * (of2.top - of1.top),
            height: scroll.height() - s * (body.height() - container.height())
        });


    }

    function onBarScroll(e, ui, container, body, scroll) {
        var bar = scroll.find('.bar'),
            s = scroll.height() / body.height();

        body.css({
            top: (-parseInt(bar.css('top'))) / s
        });


    }


    /*----------------------------------------------------------------*/
    function toggleEnable(switch_on) {
        switch_on = ( $.type(switch_on) != 'boolean') ? enabled : switch_on;
        var aaction = switch_on ? 'hide' : 'show', action = switch_on ? 'show' : 'hide';
        inactiveTime = 0;
        $('#canvas').stop();
        $('#article_box').hide('fade');
        $('#list').hide('fade');

        $('#navigation')[action]('fade');
        $('#about_butt')[action]('fade');

        $('#bground')[aaction]('fade');
        $('#titles_box')[aaction]().css('visibility', 'visible');
        $(document.body).toggleClass('disabled', !switch_on);
        enabled = switch_on;
        if(!switch_on){
                $('.mark.item.active')
                .removeClass('active')
                .find('.mega')
                .hide('fade', 300);
        }
    }
    /*----------------------------------------------------------------*/
    function OpenArticle(id) {

        if (currentArticle == id) return;

        blockShow = true;
        if (currentArticle) {
            HideArticle(true, isOneGroup(currentArticle, id), function () {
                OpenArticle(id)
            });
            return;
        }

        $('#bground').finish().show('fade');
        $('#article_box').load(config.articlesPath + id,
            function () {
                $('#list').find('.item[xid="' + id + '"]').switchClass('normal', 'selected');
                $('#article_box').finish().show('fade',
                    function () {
                        var container = $('#article_box').css('opacity', 1).find('.scrollable'),
                            body = container.find('.content'),
                            scroll = $('#article_box').find('.scrollrail'),
                            h1 = container.height(),
                            h2 = body.height(),
                            off = container.offset();
 
                        if (h2 > h1) {
                            scroll.show();
                            $('#article_box').find('.content').draggableXYE({
                                containment: [0, off.top + h1 - h2, 0, off.top],
                                dynamic: true,
                                axis: 'y',
                                drag: function (e, ui) {
                                    onFingerScroll.call(self, container, body, scroll)
                                }
                            });
                            scroll.find('.bar').draggable({
                                containment: "parent",
                                dynamic: true,
                                axis: 'y',
                                drag: function (e, ui) {
                                    onBarScroll.call(self, e, ui, container, body, scroll)
                                }
                            });

                            onFingerScroll.call(self, container, body, scroll);
                        }
                        blockShow = false;
                    });
            });
            
        lampCmd(id, 'on');

        currentArticle = id;
        
        canvasCenter(id);

    }
    /*----------------------------------------------------------------*/
    function isOneGroup(a,b) {
      if (typeof config.light_groups != 'object') return false;
      for (var i in config.light_groups){
         if (_.contains(config.light_groups[i], a) 
          && _.contains(config.light_groups[i], b))
            return true;
      };
      return false;
    }

     /*----------------------------------------------------------------*/
    function HideArticle(keep_bg, skip_cmd, onHide) {

        var box = $('#article_box');
        if (typeof keep_bg != 'undefined' && keep_bg) {  }
        else
            $('#bground').hide('fade');

        box.finish();

        if (!skip_cmd && currentArticle) 
           lampCmd(currentArticle, 'off');

        currentArticle = 0;

        $('#list .item.selected').switchClass('selected','normal');

        box.hide('fade', function(){
            if (typeof onHide == 'function') onHide()
        });

    }
    /*----------------------------------------------------------------*/
    function lampCmd(id, state) {
          if (state=='off') {
            lampsOn = _.without(lampsOn, id);
            for (var i=0; i<lampsOn.length; i++) {
                if (isOneGroup(lampsOn[i], id)) {
                    lampsOn = _.without(lampsOn, lampsOn[i]);
                }
            }

          } else {
            if (_.contains(lampsOn, id)) 
                return;
            for (var i=0; i<lampsOn.length; i++) {
                if (isOneGroup(lampsOn[i], id)) {
                    return;
                }
            }
            lampsOn.push(id);
          }
          setTimeout(function(){
              socket.emit('lamp', {cmd: state, id: id});
          },state=='on'?150:0);       
          
            
          console.log('Lamps ', state, lampsOn);

    }

    /*----------------------------------------------------------------*/
    function onInternalLink(e) {
        OpenArticle($(e.currentTarget).attr('xid'));
    }
    /*----------------------------------------------------------------*/
    function onBgClick(e) {
        if (!enabled) return;
        if (currentArticle)
            HideArticle();
    }
    /*----------------------------------------------------------------*/
    $('#picover .proxy').load(function () {
        var marx = mary = 100,
            $this = $(this),
            text = $(this).data('descr'),
            descr = $('#picover .content').html(text).toggle(text != ""),
            maxh = canvas.wHeight - (text ? descr.height() : 0),
            maxw = canvas.wWidth,
            w = $this.width(),
            h = $this.height(), w2, h2;
        if (w / h < maxw / maxh) {
            h2 = maxh - mary * 2;
            w2 = h2 * w / h;
        } else {
            w2 = maxw - marx * 2;
            h2 = w2 * h / w;
        }
        $('#picover .imgbox')
            .css({
                backgroundImage: 'url("' + $this.attr('src') + '")',
                width: w2,
                height: h2,
                top: (maxh - h2) / 3,
                left: (maxw - w2) / 2
            });
    });


    function imageToggle(href, text) {

        if ($('#picover').toggle('fade').is(':visible')) {

            $('#picover .proxy').attr('src', href).data('descr', text);
        }
    }
    /*----------------------------------------------------------------*/
    function listToggle(set) {
        var curState = $('#list').is(':visible');
        if ((curState && set) || (!curState && !set))
            return;
        if (set) {
            $('#list').finish().show('fade', {direction: 'up'});
            $('#article_box').switchClass('no_list', 'is_list');
        } else {
            $('#list').finish().hide('fade', {direction: 'up'});
            $('#article_box').switchClass('is_list', 'no_list');
        }
        $('#list_butt').toggle('fade', set);
    }
    /*----------------------------------------------------------------*/
    function activateMark(id, mark) {

        typeof mark == 'object' || (mark = $(".mark[xid=" + id + "]"));
        var is_active = mark.is('.active');
/*
        var prev = $('.mark.item.active').attr('xid');

        $('.mark.item.active')
            .removeClass('active')
            .find('.mega')
            .hide('fade', 300);
*/  
        disactivateMarks(id);

        if (id) {
            if (is_active) {
                OpenArticle(id)
            } else {
                var mega = mark.find('.mega');
                mega.show('fade', 300);
                mark.addClass('active');
/*                
                if (prev) {
                    if (!isOneGroup(prev, id)) {
                        setTimeout(function(){lampCmd(prev, 'off');},200);       
                    } else {
                        return;
                    }
                }
*/
                lampCmd(id, 'on');  
            }
        }
    }
    /*----------------------------------------------------------------*/
    function disactivateMarks(for_id) { /*  do not use it for switching off previosly-active mark for new one*/
        var cur = $('.mark.item.active').attr('xid');
        if (cur && (for_id != cur) && (!isOneGroup(cur, for_id))) 
           lampCmd(cur, 'off');

        $('.mark.item.active')
            .removeClass('active')
            .find('.mega')
            .hide('fade', 300);

    }

    /*----------------------------------------------------------------*/
    function canvasCenter(id) {
        var pos = $(".mark[xid='" + id + "']");
        if (!pos.length) return; /* no mark on table*/
        pos = pos.position().left;
        pos = -(pos - canvas.wWidth / 2);
        if (pos > canvas.rightBound) pos = canvas.rightBound;
        if (pos < canvas.leftBound) pos = canvas.leftBound;
        $('#canvas').stop().animate({left: pos}, 1000);
    }

    /*----------------------------------------------------------------*/
    function onListButton(e) {
        var show = !$('#list').is(':visible');
        listToggle(show);
        e.stopPropagation();
    }
    /*----------------------------------------------------------------*/
    function onListItem(e) {
        var id = $(e.currentTarget).attr('xid');
        disactivateMarks(id);
        OpenArticle(id);
        e.stopPropagation();
    }
    /*----------------------------------------------------------------*/
    function onMarkClick(e) {
        var mark = $(e.currentTarget);
        activateMark(mark.attr('xid'), mark);
        e.stopPropagation();
    }                                                                    

    /*----------------------------------------------------------------*/
    /*----------------------------------------------------------------*/
    /*----------------------------------------------------------------*/

    socket.on('table', function (data) {
        console.log('Recieved IO data', data);
        switch (data.cmd) {
            case 'stop':
                toggleEnable(true);
                currentTitles && titler[currentTitles] && titler[currentTitles].finish();
                currentTitles = null;
                break;
            case 'start':
                toggleEnable(false);
                currentTitles && titler[currentTitles] && titler[currentTitles].finish();
                currentTitles = null;
                if (titler[data.program]) {
                    currentTitles = data.program;
                    titler[currentTitles].start();
                } else {
                    addMessage('Bad titles ID = ' + data.program, 'red');
                }
                break;
        }
    });

    socket.on('titles', function (data) {
        titler[data.id] = new module.exports.titlesController(data)
    });

    
    $('#canvas').draggableXYE({containment: [canvas.leftBound, 0, canvas.rightBound, 0], dynamic: true, axis: 'x',
       start: function (e, ui) {
          drag_xpos = e.clientX;
       },
       stop: function (e, ui) {
          if (overdrag_left ) {$('.overdrag.left' ).hide('fade',500); overdrag_left=false; }
          if (overdrag_right) {$('.overdrag.right').hide('fade',500); overdrag_right=false; }
       },
       drag: function (e, ui) {
         if (($(e.target).offset().left > canvas.rightBound - 5) && (e.clientX - drag_xpos > 0) && !overdrag_left) {
           $('.overdrag.left').show('fade',500); overdrag_left = true;
         }
         if (($(e.target).offset().left < canvas.leftBound + 5) && (e.clientX - drag_xpos < 0) && !overdrag_right) {
           $('.overdrag.right').show('fade',500); overdrag_right = true;
         }
       }
    });

    $('#panorama').click(function (e) {
        activateMark.call(self, 0);
    });

    $('#bground').click(function (e) {
        if (blockShow) return;
        onBgClick.call(self, e);
    });
    $('#list_butt').click(function (e) {
        onListButton.call(self, e);
    });
    $('#about_butt').click(function (e) {
        if (blockShow) return;
        OpenArticle($(e.currentTarget).attr('xid'));
    });

    $(document).on('click', '#list .item', function (e) {
        if (blockShow) return;
        onListItem.call(self, e);
    });

    $(document).on('click', '.mark.item', function (e) {
        if (blockShow) {return;}
        onMarkClick.call(self, e);
    });
    $(document).on('click', '.article.close', function (e) {
        if (blockShow) return;
        HideArticle.call(self);
    });
    $(document).on('click', '.list.close', function (e) {
        listToggle(false);
    });
    $(document).on('click', '.internal_link', function (e) {
        if (blockShow) return;
        onInternalLink.call(self, e);
    });
    $(document).on('click', '.enlarge', function (e) {
        var obj = $(e.currentTarget);
        imageToggle(obj.attr('xhref'), obj.attr('xdescr'));
        return false;
    });

    $(document).on('click', '.no_enlarge', function (e) {
        var obj = $(e.currentTarget),
            box = obj.closest('.media');
        box.css({width:box.width(), height:box.height()});
        obj.effect('shake');
        return false;
    });

    $(document).on('click', '#picover', function (e) {
        imageToggle();
    });

    {
//    $('#list').show();
 
    var container = $('#list').find('.scrollable'),
        body = container.find('.content'),
        scroll = $('#list').find('.scrollrail').show(),
        h1 = container.height(),
        h2 = body.outerHeight(),
        off = container.offset();


        body.draggableXYE({
            containment: [0, off.top + h1 - h2, 0, off.top],
            dynamic: true,
            axis: 'y',
            drag: function (e, ui) {
                onFingerScroll.call(self, container, body, scroll)
            }
        });

                            scroll.find('.bar').draggable({
                                containment: "parent",
                                dynamic: true,
                                axis: 'y',
                                drag: function (e, ui) {
                                    onBarScroll.call(self, e, ui, container, body, scroll)
                                }
                            });

                            onFingerScroll.call(self, container, body, scroll);

    $('#list').hide();
    }

//    $('.mark.item .mega').show();

    $('.mark.item').each(function (indx, o) {
        var obj = $(o), half,
            mega = obj.find('.mega');

        while (mega.offset().top < 10) {
          mega.css({width: (mega.width() + 50) + 'px'});
          if (mega.outerWidth() > 800) break;
        }

        half = mega.outerWidth() / 2;
        
        if (!obj.is('.rs')&& !obj.is('.ls')) {
          mega.css('left', -half + 37);
          obj.find('.after').css('left', half);
        }

        mega.hide();
    });



    /*-- Timer --------*/
    function onTimer() {
    
        if (enabled)  /* in disabled mode timer is not counting */
            inactiveTime += config.timer.frequency;
        if (!nowMoving && inactiveTime > config.timer.movingTimeout) {
            var pos = $('#canvas').position().left,
                goto = (movingSpeed > 0) ? canvas.leftBound : canvas.rightBound;


            $('#canvas').animate({left: goto}, Math.abs((goto - pos) * 1000 / movingSpeed),
                function () {
                    if (inactiveTime > config.timer.reloadTimeout && movingSpeed < 0)
                        document.location = document.location.href;
                    movingSpeed *= -1;
                    nowMoving = false;
                }
            );

            nowMoving = true;
            blockShow = false;
            HideArticle();
            listToggle(false);
            activateMark();
        }
    }

    setInterval(onTimer, config.timer.frequency * 1000);
    $(window).on('mousedown',
        function () {
            if (nowMoving) {
                $('#canvas').stop();
            }
            nowMoving = false;
            inactiveTime = 0;
        });


    /*---------Administrative --------------*/
    if (config.admin) {
    if (document.location.href.indexOf('admin=') > 0) {
        function Ajax(data, success) {
            var obj = {
                url: config.admin.ajaxServer, data: data, dataType: "json", cache: false, success: function (dt) {
                    if (dt.__out) console.log("Server said: " + dt.__out);
                    if (typeof success == 'function') self.call(success, dt);
                }
            };
            $.ajax(obj);
        }

        $('#marks .item').draggable({
            stop: function (e, ui) {
                var obj = ui.helper;
                Ajax({fn: 'setmark', id: obj.attr('xid'), x: ui.position.left, y: ui.position.top});
            }
        });
        $('.mark.item').each(function (indx, o) {
            var obj = $(o);
            obj.append($('<div class="admin_name">').text(obj.find('.title').text()));
        });
        
        $(window).on('mousedown', function (e) {  // click dblclick
            addMessage(e.type + ((e.clientX) ? (' at ' + e.clientX + ' x ' + e.clientY) : "" ));
        });

    }
    }

    /*--------- of Administrative --------------*/

    /*-------- --------------*/
    function addMessage(text, color) {
        var msg = $('<div class=msg>').html(text).appendTo( $('#messageBar') ).show(500);
        if (color) {
            msg.css('background-color', color);
        }
        setTimeout(function () {
            msg.hide(500, function () {
                this.remove();
            })
        }, 5000);
    }

/*-------  Remove cursor ---*/
    $('.full_wrapper').toggleClass('no-cur', !config.showCursor);
/*-------   Prevent right click ---*/
    config.preventRightClick && (function () {  var b = function (e) {e.preventDefault();}; window.addEventListener('contextmenu', b); })();

    $('.onloading').hide().removeClass('onloading');
 
};

});


