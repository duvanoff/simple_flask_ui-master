define(['jquery',
        'handlebars',
        'text!application/html/templates.hbs',
        'i18n!application/nls/translate',
        'swal',
        'domReady!'], function($, Handlebars, templates, translate) {

    'use strict';

    function APP() {

        this.CONFIG = {
            lang: 'en',
            placeholder_id: 'placeholder',
            url_simple_flask: 'http://localhost:5000/',
            sel: $('#user_name')
        }

    }

    APP.prototype.init = function(config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Say hallo for the first time. */
        this.say_hallo(false);

    };

    APP.prototype.say_hallo = function(use_blueprint, user_name) {

        /* Initiate url. */
        var url;

        /* Check blueprint. */
        if (use_blueprint) {

            /* Create URL. */
            url = this.CONFIG.url_simple_flask + 'blueprint/' + (user_name != undefined ? user_name : '');

            /* Invoke Simple Flask. */
            $.ajax({
                type: 'GET',
                url: url,
                context: this,
                success: this.process_response
            });

        } else {

            /* Create URL. */
            url = this.CONFIG.url_simple_flask + (user_name != undefined ? user_name : '');

            /* Invoke Simple Flask. */
            $.ajax({
                type: 'GET',
                url: url,
                context: this,
                success: this.process_response,
                error: this.process_error
            });

        }

    };

    APP.prototype.process_error = function(e) {
        swal({
            title: translate.error,
            text: e.statusText,
            type: 'error',
            confirmButtonColor: '#379BCE'
        });
    };

    APP.prototype.process_response = function(response) {

        /* Load Handlebars template. */
        var source = $(templates).filter('#structure').html();
        var template = Handlebars.compile(source);
        var dynamic_data = {
            title: response,
            label: translate.label,
            button_label: translate.button_label,
            label_placeholder: translate.label_placeholder,
            blueprint_button_label: translate.blueprint_button_label
        };
        var html = template(dynamic_data);
        $('#' + this.CONFIG.placeholder_id).empty().html(html);

        /* Bind button. */
        $('#say_hallo_button').click({host: this}, function(e) {
            e.data.host.say_hallo(false, $('#user_name').val());
        });

        /* Bind blueprint button. */
        $('#say_blueprint_hallo_button').click({host: this}, function(e) {
            e.data.host.say_hallo(true, $('#user_name').val());
        });

    };

    return APP;

});