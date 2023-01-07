!function ($) {
    "use strict";

    let GTube = function () { };

    GTube.prototype.init = function () {
        let page = $('#result');
        let resultPage = $(page).html();
        $(page).html(null);

        function autoVal(select) {
            $(select).find('option').each(function (index, option) {
                if ($(option).is(':selected')) {
                    $(page).find('#vSize').text($(option).data('g-size'));
                    $(page).find('#vRes').text($(option).data('g-resolution'));
                    $(page).find('#download').attr('href', `${$(option).data('g-url')}`);
                }
            });
        }

        function success(data) {
            console.log(data);
            $(page).html(null).removeClass('collapse');
            $(page).html(resultPage);
            $(page).find('#vThumbnail').attr({ 'src': data['thumb'], 'alt': data['title'] });
            $(page).find('#vTitle').text(data['title']);
            $(page).find('#vDuration').text(`${data['duration']} min`)
            $(page).find('#vView').text(data['views']);
            $(page).find('#vRating').text(data['likes']);
            $(page).find('#vDesc').text(data['description']);
            $(page).find('#vAut').text(data['author']);
            $(data.streams).each(function (index, stream) {
                if (this['file_size'] !== null) {
                    let element = $(`<option selected="${this['extension'] == 'mp4'? true: false}" value="${index}" data-g-ext="${this['extension']}" data-g-url="${this['video_url']}" data-g-resolution="${this['resolution']}" data-g-size="${this['file_size']}">${this['resolution']} | ${this['extension']} | ${this['file_size']}</option>`);
                    $('#vidWeight').append(element);
                }
            });
            $('#vidWeight').change(function () { this.value.length > 0 ? autoVal(this) : null; });
            data.error ? $(page).html(`<h5 class='text-danger text-center fw-bold p2'> ${data.error} </h5>`) : null;
            autoVal($("select"));
        }

        GTube.prototype.init.main = function () {
            $('#vidForm').on({
                'submit': function (event) {
                    event.preventDefault();
                    let loader = $('#searchPreloader'), url = this.action, data = $(this).serialize();
                    $.ajax({
                        url: url, data: data, type: 'POST', success: function (data) {
                            success(data)
                        }, beforeSend: function () {
                            $(loader).removeClass('collapse')
                        }, complete() {
                            $(loader).addClass('collapse')
                        }
                    })
                },
            });
            $('#vidForm').find('input').on({
                'change': function () {
                    $(this).parent().submit();
                }
            })
            return 0;
        }();
    },
        GTube.prototype.init()
}(jQuery);

