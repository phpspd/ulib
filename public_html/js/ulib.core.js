;(function() {
    "use strict";
    const _defaults = {
        containers : {
            items : ".items"
        },
        forms : {
            add: {
                container: ".form-add-container",
                name: "addBook",
                event: "uLib.addItem",
                class: "form add",
                title: "Настройки",
                validate: 1,
                inputs: [
                    {
                        name: "id",
                        type: "hidden"
                    },
                    {
                        title: "Название",
                        name: "title",
                        type: "text",
                        dataType: "text",
                        require: 1
                    }, {
                        title: "Автор",
                        name: "author",
                        type: "text",
                        dataType: "text",
                        require: 1
                    }, {
                        title: "Год издания",
                        name: "year",
                        type: "text",
                        dataType: "year",
                        require: 1
                    }, {
                        title: "Кол-во страниц",
                        name: "pages",
                        type: "text",
                        dataType: "number",
                        require: 1
                    }, {
                        type: "submit",
                        value: "Сохранить"
                    }
                ]
            },
            sort : {
                container: ".form-sort-container",
                name: "sortBooks",
                event: "sortBooks",
                class: "form sort",
                title: "Сортировочка",
                inputs: [
                    {
                        inlineTitle: "По автору",
                        name: "sortBy",
                        type: "radio",
                        value: "author",
                        checked: 1
                    }, {
                        inlineTitle: "По названию",
                        name: "sortBy",
                        type: "radio",
                        value: "title"
                    }
                ]
            },
            search : {
                container: ".form-search-container",
                name: "searchBooks",
                event: "searchBooks",
                class: "form search",
                title: "Поиск",
                inputs: [
                    {
                        name: "query",
                        type: "text",
                        dataType: "text"
                    }, {
                        type: "submit",
                        value: "Найти"
                    }
                ]
            }
        },
        sort: {
            input: "form[data-name='sortBooks'] input"
        },
        tpl: {
            items: "#uLibBooksTpl",
            forms: "#uLibFormTpl"
        }
    };
    
    var Library = (function() {
        var version = "0.1b",
            document = window.document,
            modules = {},
            items = {},
            options;
        
        var core = function() {
            
        };
        
        core.version = version;
        core.events = {
            initComplete: "uLib.initComplete"
        }
        
        function init(opts) {
            if (typeof opts != 'object') {
                options = _defaults;
            } else {
                options = opts;
                try {
                    for (let a in _defaults) {
                        if (typeof _defaults[a] == "object") {
                            for (let b in _defaults[a]) {
                                if (opts[a][b] == undefined) {
                                    options[a][b] = _defaults[a][b];
                                }
                            }
                        } else if (opts[a] == undefined) {
                            options[a] = _defaults[a];
                        }
                    }
                } catch(e) {

                }
            }
            
            for (let i in modules) {
                if (typeof modules[i].init == "function")
                    modules[i].init(options);
            }
            
            render();
            
            $(document).trigger(core.events.initComplete);
        };
        core.init = init;
        
        function addModule(name, module) {
            modules[name] = module;
        };
        core.addModule = addModule;
        
        function module(name) {
            return modules[name];
        }
        core.module = module;
        
        function render() {
            
        }
        
        return core;
    })();
    
    //export
    window.uLib = Library;
    
    
})();