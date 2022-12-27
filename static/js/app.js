!function(g) {
    "use strict";
    let gTube = function() {};

    gTube.prototype.init = function() {
        let page = g('#result');
        let resultPage = g(page).html();
        g(page).html(null);
        function manageFrame(meta){
            g('#ready').find('source:first-child').detach();
            const ext = meta['resolution'] !== 'Audio' ? 'video/' + meta['extension'] : 'audio/' + meta['extension']
            let source = document.createElement('source');
            g(source).attr({'src':meta['url'],'type':ext});
            g('#ready').append(source);
            source.parentElement.load();
        }
        function autoVal (o){
            g(o).find('option').each(function (e,a){
                if (g(a).is(':selected')){
                    g(page).find('#vSize').text(g(a).data('g-size'));
                    g(page).find('#vRes').text(g(a).data('g-resolution'));
                    g(page).find('#download').attr('href',g(a).data('g-url'));
                    const meta = {'url':a.getAttribute('data-g-url'),'extension':a.getAttribute('data-g-ext'),'resolution':a.getAttribute('data-g-resolution')};
                }
            })
        }
        function success(e){
            console.log(e);
            g(page).html(null).removeClass('collapse');
            g(page).html(resultPage);
            g(page).find('#vThumbnail').attr({'src':e['thumb'],'alt':e['title']});
            g(page).find('#vTitle').text(e['title']);
            g(page).find('#vDuration').text(`${e['duration']} min`)
            g(page).find('#vView').text(e['views']);
            g(page).find('#vRating').text(e['likes']);
            g(page).find('#vDesc').text(e['description']);
            g(page).find('#vAut').text(e['author']);
            g(e.streams).each(function (p,s){
                if (this['file_size'] !== null){
                    let element = g(`<option value="${p}" data-g-ext="${this['extension']}" data-g-url="${this['video_url']}" data-g-resolution="${this['resolution']}" data-g-size="${this['file_size']}">${this['resolution']} | ${this['extension']} | ${this['file_size']}</option>`);
                    g('#vidWeight').append(element);
                }
            });
            g('#vidWeight').change(function (){this.value.length > 0 ? autoVal(this) : null;});
            !e ? g(page).html("<h5 class='text-danger text-center fw-bold p-2'> url non valide, verifiez bien l'orthographe</h5>") : null;
            autoVal(g("select"));
        }
        gTube.prototype.init.main = function (){
            g('#vidForm').on({
                'submit': function(e) {
                    e.preventDefault();
                    let loader = g('#searchPreloader'), url = this.action, data = g(this).serialize();
                    g.ajax({
                        url: url, data: data, type: 'POST', success: function (e) {
                            success(e)
                        }, beforeSend: function () {
                            g(loader).removeClass('collapse')
                        }, complete() {
                            g(loader).addClass('collapse')
                        }
                    })
                },
            });
            g('#vidForm').find('input').on({
                'change': function (){
                    g(this).parent().submit();
                }
            })
            return 0;
        }();
    },
    gTube.prototype.init()
}(window.jQuery)