;(function() {
    "use strict";
    var Sort = (function() {
        if (!window.uLib) {
            throw new Error( "uLib not loaded" );
        }
        var document = window.document,
            core = window.uLib,
            options,
            module = function(){};
        
        module.modName = "Sort";
        
        function init(opts) {
            options = opts;
            render();
            listen();
        };
        module.init = init;
        
        function initComplete() {
            $(options.sort.input + ":checked").trigger("change");
        }
        
        function render() {
            
        }
        
        function listen() {
            $(document).on(core.events.initComplete, initComplete);
            $(document).on("change", options.sort.input, function(event) {
                let field = $(this).attr('value'),
                    books = core.module("Books");
                
                if (books) {
                    core.module("Books").filter(module.modName, function(items) {
                        for (let i = 0; i < items.length-1; ++i) {
                            if (items[i][field] < items[i+1][field]) {
                                let tmp = items[i];
                                items[i] = items[i+1];
                                items[i+1] = tmp;
                                i = -1;
                            }
                        }
                        return items;
                    });
                }
            });
        }
        
        //export
        window.uLib.addModule(module.modName, module);
    })();
})();