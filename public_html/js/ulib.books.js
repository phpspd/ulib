;(function() {
    "use strict";
    var Books = (function() {
        if (!window.uLib) {
            throw new Error( "uLib not loaded" );
        }
        var document = window.document,
            core = window.uLib,
            options,
            module = function() {},
            lastId = 0,
            items = [],
            filters = {};
        
        module.modName = "Books";
        
        function init(opts) {
            options = opts;
            load();
            render();
            listen();
        };
        module.init = init;
        
        function save() {
            let items_str = JSON.stringify(items);
            window.localStorage.setItem("books", items_str);
        }
        
        function load() {
            let items_str = window.localStorage.getItem("books");
            items = JSON.parse(items_str) || [];
            if (items.length > 0)
                lastId = items[items.length - 1].id;
        }
        
        function filter(name, callback) {
            if (typeof callback == 'function') {
                filters[name] = callback;
                render();
            }
        }
        module.filter = filter;
        
        function removeFilter(name) {
            if (filters[name]) {
                delete filters[name];
                render();
            }
        }
        module.removeFilter = removeFilter;
        
        function getItemByID(id) {
            for (let i = 0; i < items.length; ++i)
                if (items[i].id == id)
                    return items[i];
            
            return false;
        }
        
        function getItemIndexByID(id) {
            for (let i = 0; i < items.length; ++i)
                if (items[i].id == id)
                    return i;
            
            return -1;
        }
        
        function listen() {
            $(document).on("uLib.addItem", function(event, data) {
                let item = data.item;
                if (item.id > 0) {
                    $(event.target).trigger("uLib.editItem", data);
                    return ;
                }
                item.id = ++lastId;
                items.push(item);
                save();
                render();
                
                $(event.target).trigger("uLib.formSubmitted." + data.formName);
            });
            
            $(document).on("uLib.editItem", function(event, data) {
                let item = data.item;
                if (item) {
                    let index = getItemIndexByID(item.id);
                    if (index != -1) {
                        items[index] = item;
                        save();
                        render();

                        $(event.target).trigger("uLib.formSubmitted." + data.formName);
                        return ;
                    }
                }
                
                $(event.target).trigger("uLib.itemError", {message: "Item not found"});
            });
            
            $(document).on("uLib.removeItem", function(event, data) {
                let item = data.item;
                if (item) {
                    items.splice(getItemIndexByID(item.id), 1);
                    save();
                    render();
                    
                    $(event.target).trigger("uLib.itemRemoved");
                    return ;
                }
                
                $(event.target).trigger("uLib.itemError", {message: "Item not found"});
            });
            
            $(document).on("click", ".item-edit", function(e) {
                e.preventDefault();
                let formName = $(this).data("form-name"),
                    item_id = $(this).data("item-id"),
                    data = {};
                data.item = getItemByID(item_id);
                if (data.item)
                    $(event.target).trigger("uLib.fillForm." + formName, data);
            });
            
            $(document).on("click", ".item-remove", function(e) {
                e.preventDefault();
                if (!confirm("Вы уверены, что хотите удалить книгу?"))
                    return false;
                let item_id = $(this).data("item-id"),
                    data = {};
                data.item = getItemByID(item_id);
                if (data.item)
                    $(event.target).trigger("uLib.removeItem", data);
            });
        }
        
        function render(item_id) {
            let filterItems = items;
            for (let name in filters) {
                filterItems = filters[name](filterItems);
            }
            
            let html = $(options.tpl.items).tmpl( {items: filterItems} );
            $(options.containers.items).html(html);
        }
        
        //export
        window.uLib.addModule(module.modName, module);
    })();
    
})();