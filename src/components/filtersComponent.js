import React, {useState, useReducer, useEffect, useRef} from 'react';

const FiltersComponent = ({curProj, projObjList, projArray, dispatchObjList, filters, dispatchFilters}) => {
    const [inputText, setInputText] = useState('');
    const refValue = useRef();

    const setHeight = () => {
        let curHeight = refValue.current.offsetHeight;
        document.querySelector('.content-wrapper-before').style.height = window.innerWidth < 768
            ? curHeight+130+'px'
            : curHeight+40+'px';
    };

    useEffect( () => {
        setHeight();
        window.addEventListener('resize', setHeight);
        return () => {
            window.removeEventListener('resize', setHeight);
        }
    },[filters]);

    const searchButtonResults = useRef();
    const searchInput = useRef();

    const searchFilters = (e, filtertype) => {
        setInputText(e.target.value);
        dispatchFilters({type: 'searchFilters', filterType: filtertype, value: e.target.value});
        let curButtonState = searchButtonResults.current.getAttribute('aria-expanded') === 'false';
        curButtonState
            ? (() => {
                searchButtonResults.current.click();
                searchInput.current.focus();
            })()
            : e.target.value === '' && searchButtonResults.current.click() && searchInput.current.focus();
    };


    return(
        <div className="content-header-right col-md-9 col-sm-12 col-12 mb-2 row" ref={refValue}>
            <ul className="nav col-md col-12">
                {
                    filters.map( item => {
                        let isChecked = item.values.filter( value => value.selected);
                        return isChecked.length > 0
                            ? (
                                <div  className="nav-link cursor-pointer" key={item.type}>
                                    {item.type}:
                                    {item.values.map( filter => {
                                        return filter.selected &&
                                            <React.Fragment key={filter.field}>
                                                <span className="ml-1 text-white">{filter.field} </span>
                                                <i
                                                    className="ft-x-circle"
                                                    onClick={e => dispatchFilters({
                                                        type: 'toggleFilter',
                                                        prodType: item.type,
                                                        filterField: filter.field,
                                                        bool: false
                                                    })}
                                                />
                                            </React.Fragment>
                                    })}
                                </div>
                            )
                            : null;
                    })
                }
            </ul>
            <ul className="nav col-md col-12 justify-content-start justify-content-md-end">
                {
                    filters.map( item => {
                        let isChecked = item.values.filter( value => !value.selected);
                        return isChecked.length > 0
                            ? (
                                <div className="nav-link p-0" key={item.type}>
                                    <div className="btn-group mr-1 mb-1">
                                        {item.type.toLowerCase() === 'user' &&
                                            <input
                                                type="text"
                                                className="input-sm filter-input"
                                                id="basicInput"
                                                value={inputText}
                                                onChange={e => searchFilters(e, item.type)}
                                                ref={searchInput}
                                            />}
                                        <button ref={item.type.toLowerCase() === 'user' ? searchButtonResults : null} className="btn btn-outline-primary btn-sm dropdown-toggle round" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            {item.type}
                                        </button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            {item.values.map( filter => {
                                                return !filter.selected && filter.searched &&
                                                    <div
                                                        className="dropdown-item cursor-pointer"
                                                        key={filter.field}
                                                        onClick={e => dispatchFilters({
                                                            type: 'toggleFilter',
                                                            prodType: item.type,
                                                            filterField: filter.field,
                                                            bool: true
                                                        })}>
                                                        {filter.field}
                                                    </div>
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )
                            : null;
                    })
                }
            </ul>
        </div>

    )
};

export default FiltersComponent;