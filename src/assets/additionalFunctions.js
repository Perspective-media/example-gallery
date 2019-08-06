// import $ from 'jquery';

export const isEmpty = (obj) => {
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

export const sortBy = (arr, field) => {
    arr.sort( (next, prev) =>
        next[field] > prev[field]
            ? 1
            : -1
    );
    return arr;
};


export const apiConnetcion = (apiKey) => {
    function get(route) {
        return fetch(`${route}?key=${apiKey}`);
    }
    function post(route, params) {
        return fetch(route, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
    }
    return { get, post };
};

const isDescendant = (parent, child) => {
    let node = child.parentNode;
    while (node !== null) {
        if (node === parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
};

export const closeDropDownOnClick = () => {
    document.body.onclick = (e) => {
        document.querySelector('.dropdown-menu.show') &&
        !isDescendant(document.querySelector('.dropdown-menu.show').parentElement, e.target) &&
        document.querySelector('.dropdown-menu.show') !== e.target &&
        document.querySelector('.dropdown-menu.show').parentElement.firstElementChild.click();
        };
};

export const isEqual = (value, other) => {

    // Get the value type
    let type = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) return false;

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

    // Compare the length of the length of the two items
    let valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    let otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;

    // Compare two items
    let compare = function (item1, item2) {

        // Get the object type
        let itemType = Object.prototype.toString.call(item1);

        // If an object or array, compare recursively
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2)) return false;
        }

        // Otherwise, do a simple comparison
        else {

            // If the two items are not the same type, return false
            if (itemType !== Object.prototype.toString.call(item2)) return false;

            // Else if it's a function, convert to a string and compare
            // Otherwise, just compare
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else {
                if (item1 !== item2) return false;
            }

        }
    };

    // Compare properties
    if (type === '[object Array]') {
        for (let i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) return false;
        }
    } else {
        for (let key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false) return false;
            }
        }
    }

    // If nothing failed, return true
    return true;

};

export const virtualFiltering = (excludeFilterGroup, filterList, prevExamples, callback) => {
    let filteredObjectList = [];
    //checking if some filter is exist
    let listOfFilters = Object.keys(filterList);
    let isSomeFilterChecked = listOfFilters.some( item => {
        return filterList[item].some( filter => parseInt(filter.selected) );
    });
    filteredObjectList = prevExamples.map( obj => {
        // obj = example object
        //creating empty array for holding multifilters boolean values from different types of filtering
        let multifilters = [];
        return {
            ...obj,
            filtered: !isSomeFilterChecked || (() => {listOfFilters.some( item => {
                    //item = filter group name(products/event...)
                    // val - value of item property in example object
                    let val = typeof obj[item] === 'string' ? obj[item].toLowerCase() : obj[item];
                    // filters - array with only selected filters
                    let filters = item === excludeFilterGroup
                        ? [...filterList[item]]
                        : filterList[item].filter( filter => !!parseInt(filter.selected) );
                    // if selected filters in current type exist - checking if at least some of them is equal to our variable 'val' from object
                    //and pushing this returning boolean true or false to multifilters array
                    filters.length > 0 && multifilters.push(
                        filters.some( filter => typeof val === 'string'
                            ? filter.id == val
                            : val.some( elemId => filter.id == elemId )
                        ));
                });
                    //returning boolean value true or false if all pushed condition in our multifilter is true
                    return multifilters.every( val => val )}
            )() ? 1 : 0
        };
    });
    callback && callback({type: 'showExisting', examples: filteredObjectList});
    return filteredObjectList;
};

export const listOfAvailableFunc = (example, filter, listOfAvailable) => {
    !!parseInt(example.filtered) && (
        typeof example[filter] === 'string'
            ? !listOfAvailable[filter].includes(example[filter]) &&
            listOfAvailable[filter].push(example[filter])
            : example[filter].map(elemId => {
                !listOfAvailable[filter].includes(elemId) &&
                listOfAvailable[filter].push(elemId)
            })
    )
};

export const createAndLoadScript = (src) => {
    const script = document.createElement("script");
    script.src = src;
    script.type = 'text/javascript';
    script.async = false;
    document.body.appendChild(script);
};

export const handleToggleMenu = () => {
    const toOverlayMenu = (screen) => {
        var menu = $('body').data('menu');
        if(screen < 992){
            if($('body').hasClass(menu)){
                $('body').removeClass(menu).addClass('vertical-overlay-menu');
            }
        }
        else{
            if($('body').hasClass('vertical-overlay-menu')){
                $('body').removeClass('vertical-overlay-menu').addClass(menu);
            }
        }
    };

    const toCollapseMenu = (screen)  => {
        if(screen > 991) {
            if (document.body.classList.contains('menu-expanded')) {
                document.body.classList.remove('menu-expanded');
                document.body.classList.add('menu-collapsed');
            } else {
                document.body.classList.remove('menu-collapsed');
                document.body.classList.add('menu-expanded')
            }
        } else {
            if (document.body.classList.contains('menu-hide')) {
                document.body.classList.remove('menu-hide');
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
                document.body.classList.add('menu-hide')
            }
        }

    };

    toOverlayMenu(window.innerWidth);
    document.addEventListener('resize', toOverlayMenu(window.innerWidth));
    document.querySelectorAll('.menu-toggle-handle').forEach( item => item.addEventListener('click', () => {
        toCollapseMenu(window.innerWidth);
    }));
};

const Page = function() {

    var config = {
            $bookBlock : $( '#bb-bookblock' ),
            $navNext : $( '#bb-nav-next' ),
            $navPrev : $( '#bb-nav-prev' ),
            $navFirst : $( '#bb-nav-first' ),
            $navLast : $( '#bb-nav-last' )
        },
        init = function() {
            config.$bookBlock.bookblock( {
                speed : 800,
                shadowSides : 0.8,
                shadowFlip : 0.7
            } );
            initEvents();
        },
        initEvents = function() {

            var $slides = config.$bookBlock.children();

            // add navigation events
            config.$navNext.on( 'click touchstart', function() {
                config.$bookBlock.bookblock( 'next' );
                return false;
            } );

            config.$navPrev.on( 'click touchstart', function() {
                config.$bookBlock.bookblock( 'prev' );
                return false;
            } );

            config.$navFirst.on( 'click touchstart', function() {
                config.$bookBlock.bookblock( 'first' );
                return false;
            } );

            config.$navLast.on( 'click touchstart', function() {
                config.$bookBlock.bookblock( 'last' );
                return false;
            } );

            // add swipe events
            $slides.on( {
                'swipeleft' : function( event ) {
                    config.$bookBlock.bookblock( 'next' );
                    return false;
                },
                'swiperight' : function( event ) {
                    config.$bookBlock.bookblock( 'prev' );
                    return false;
                }
            } );

            // add keyboard events
            $( document ).keydown( function(e) {
                var keyCode = e.keyCode || e.which,
                    arrow = {
                        left : 37,
                        up : 38,
                        right : 39,
                        down : 40
                    };

                switch (keyCode) {
                    case arrow.left:
                        config.$bookBlock.bookblock( 'prev' );
                        break;
                    case arrow.right:
                        config.$bookBlock.bookblock( 'next' );
                        break;
                }
            } );
        };

    return { init : init };

};


export const bookView = (ind, refBook, refGrid) => {
    if (refBook.current.classList.contains('hidden')) {
        refBook.current.classList.remove('hidden');
        refGrid.current.classList.add('hidden');
        let book = new Page();
        book.init();
        let myHeight = document.body.querySelector(".bb-item img").getBoundingClientRect().height;
        let bookContainer = document.getElementById('bb-bookblock');
        bookContainer.style.height = myHeight + 'px';
    }
    // $('.modal').animate({ scrollTop: 0 }, 'slow');
    $('#bb-bookblock').bookblock('jump', ind+1 );
};