;(function() {
    "use strict";
    var Search = (function() {
        if (!window.uLib) {
            throw new Error( "uLib not loaded" );
        }
        var document = window.document,
            core = window.uLib,
            options,
            module = function(){};
        
        module.modName = "Search";
        
        function init(opts) {
            options = opts;
            render();
            listen();
        };
        module.init = init;
        
        function render() {
            
        }
        
        function listen() {
            $(document).on("submit", "form[data-name='searchBooks']", function(event) {
                event.preventDefault();
                let query = $(this).find("input[name='query']").val().toLowerCase();
                
                if (query != "") {
                    core.module("Books").filter(module.modName, function(items) {
                        let filterItems = [];
                        for (let i = 0; i < items.length; ++i) {
                            if (items[i]["title"].toLowerCase().indexOf(query) >= 0) {
                                filterItems.push(items[i]);
                            }
                        }
                        return filterItems;
                    });
                } else {
                    core.module("Books").removeFilter(module.modName);
                }
            });
        }
        
        //export
        window.uLib.addModule(module.modName, module);
    })();
})();