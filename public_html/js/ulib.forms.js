;(function() {
    "use strict";
    var Forms = (function() {
        if (!window.uLib) {
            throw new Error( "uLib not loaded" );
        }
        var document = window.document,
            core = window.uLib,
            options,
            module = function(){};
        
        module.modName = "Forms";
        
        function init(opts) {
            options = opts;
            render();
            listen();
        };
        module.init = init;
        
        function render() {
            for (let key in options.forms) {
                let form = options.forms[key],
                    html = $(options.tpl.forms).tmpl({form:form});
                $(form.container).html(html);
            }
        };
        
        function listen() {
            for (let key in options.forms) {
                let form = options.forms[key];
                
                //handling form submit
                $(document).on("submit", 'form[data-name="' + form.name + '"]', function(e) {
                    e.preventDefault();
                    let event = $(this).data("event"),
                        inputs = $(this).find("*[name]"),
                        data = {};
                    data.formName = form.name;
                    data.item = {};
                    $.each(inputs, function(key, value) {
                        data.item[$(value).attr("name")] = $(value).val();
                    });
                    $(this).trigger(event, data);
                });
                
                //fill form with data
                $(document).on("uLib.fillForm." + form.name, function(e, data) {
                    for (let key in data.item) {
                        let input = $('form[data-name="' + form.name + '"] *[name="' + key + '"]');
                        if (!input)
                            continue;
                        switch ($(input).attr("type")) {
                            case "text":
                            case "hidden":
                                $(input).val(data.item[key]);
                        }
                    }
                });
                
                //clear form after handling form submit
                $(document).on("uLib.formSubmitted." + form.name, function(e) {
                    $('form[data-name="' + form.name + '"] *[name!=""][type="text"]').val("");
                    $('form[data-name="' + form.name + '"] *[name!=""][type="hidden"]').val("");
                });
            }
        };
        
        //export
        window.uLib.addModule(module.modName, module);
    })();
})();