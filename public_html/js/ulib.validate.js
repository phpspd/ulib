;(function() {
    "use strict";
    var Validate = (function() {
        if (!window.uLib) {
            throw new Error( "uLib not loaded" );
        }
        var document = window.document,
            core = window.uLib,
            options,
            module = function(){},
            date = new Date();
        
        module.modName = "Validate";
        
        function init(opts) {
            options = opts;
            render();
            listen();
        };
        module.init = init;
        
        function render() {
            
        }
        
        function listen() {
            for (let i in options.forms) {
                let form = options.forms[i];
                if (!form.validate)
                    continue;
                $("body").on(form.event, function(event, data) {
                    let formErr = false;
                    for (let i = 0; i < form.inputs.length; ++i) {
                        let input = form.inputs[i];
                        if (input.require) {
                            let inputErr = false;
                            if (input.name in data.item) {
                                let val = data.item[input.name].trim();
                                switch(input.dataType) {
                                    case "text":
                                        inputErr = !(val != "");
                                        break;
                                    case "number":
                                        inputErr = !(/^[0-9]+$/.test(val));
                                        break;
                                    case "year":
                                        inputErr = !(/^[1-9][0-9]{0,3}$/.test(val) && +val <= date.getFullYear());
                                        break;
                                }
                            } else {
                                inputErr = true;
                            }
                            if (inputErr) {
                                formErr = true;
                                $(event.target)
                                        .find("input[name='" + input.name + "'], textarea[name='" + input.name + "']")
                                        .addClass("error");
                            } else {
                                $(event.target)
                                        .find("input[name='" + input.name + "'], textarea[name='" + input.name + "']")
                                        .removeClass("error");
                            }
                        }
                    }
                    if (formErr)
                        event.stopPropagation();
                });
            }
        }
        
        //export
        window.uLib.addModule(module.modName, module);
    })();
})();