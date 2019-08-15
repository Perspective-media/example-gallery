import React, {useState} from 'react';
import 'simplebar/dist/simplebar.min.css';

const FilterMenuComponent = ({groupName, filters, dispatchFilters}) => {
    const [inputText, setInputText] = useState('');

    let availableFilters = filters[groupName].filter( item => !!item.available);

    const searchFilters = (e, groupName) => {
        let val = e === '' ? '' : e.target.value;
        setInputText(val);
        dispatchFilters({type: 'searchFilters', groupName: groupName, value: val});
    };

    return (
        <li className="nav-item">
            <div className="card-accordion">
                <div className="card accordion-icon-rotate">
                    <div className="card-header2">
                        <button
                            className="btn btn-bg-gradient-x-purple-blue full-width collapse-icon"
                            type="button"
                            data-toggle="collapse"
                            data-target={`#${groupName}`}
                            aria-expanded="false"
                        >
                            <span className="menu-title" >{groupName}</span>
                        </button>
                    </div>
                    <div id={groupName} className="collapse" aria-labelledby="headingCOne" >
                        {availableFilters.length > 1 && <div className="custom-control custom-checkbox col-12 bg-primary bg-accent-1 rounded">
                            <input
                                type="checkbox"
                                id={groupName+'all'}
                                className="custom-control-input bg-blue"
                                onChange={ (e) => {
                                    dispatchFilters({type: 'forAllInGroup', groupName: groupName, value: e.target.checked ? 1 : 0});
                                }}/>
                            <label htmlFor={groupName+'all'} className="custom-control-label">Select all</label>
                        </div>}
                        {
                            availableFilters.length > 3 &&
                            <div className="input-group p-1">
                                <input
                                    className="form-control border-bottom-blue-grey border-top-0 border-left-0 border-right-0 rounded-0"
                                    type="search"
                                    value={inputText}
                                    placeholder="search"
                                    onChange={e => searchFilters(e, groupName)}
                                />
                                {
                                    inputText !== '' &&
                                    <div className="input-group-append">
                                        <button
                                            className="btn btn-cancel-search btn-sm border-bottom-blue-grey border-top-0 border-left-0 border-right-0 rounded-0"
                                            type="button"
                                            onClick={() => {
                                                searchFilters('', groupName)
                                            }}
                                        >
                                            <i className="ft-x"/>
                                        </button>
                                    </div>
                                }
                            </div>
                        }
                        <div className="list-holder" data-simplebar>
                            <div>
                                {
                                    availableFilters.map( item => {
                                        return  !!item.searched && (
                                            <div className="custom-control custom-checkbox" key={item.id}>
                                                <input
                                                    type="checkbox"
                                                    id={groupName+item.id}
                                                    checked={parseInt(item.selected)}
                                                    className="custom-control-input bg-primary"
                                                    onChange={ () => {
                                                        dispatchFilters({type: 'toggleFilter', groupName: groupName, item: item});
                                                    }}/>
                                                <label htmlFor={groupName+item.id} className="custom-control-label">{item.caption}</label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default FilterMenuComponent;