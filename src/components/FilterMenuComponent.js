import React, {useState} from 'react';
import SimpleBar from 'simplebar';
import 'simplebar/dist/simplebar.min.css';

const FilterMenuComponent = ({groupName, data, dispatch}) => {
    const [inputText, setInputText] = useState('');


    const searchFilters = (e, groupName) => {
        setInputText(e.target.value);
        dispatch({type: 'searchFilters', groupName: groupName, value: e.target.value});
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
                            /*onClick={ (e) => {
                                e.target.tagName === 'SPAN'
                                    ? e.target.parentElement.parentElement.querySelector('.dropdown-menu').classList.toggle('show')
                                    : e.target.parentElement.querySelector('.dropdown-menu').classList.toggle('show');
                            }}*/
                        >
                            <span className="menu-title" >{groupName}</span>
                        </button>
                    </div>
                    <div id={groupName} className="collapse" aria-labelledby="headingCOne" >
                        <div className="row">
                            <div className="col-6 text-center">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary round btn-sm"
                                    onClick={ e => dispatch({type: 'forAllInGroup', groupName: groupName, value: 1})}
                                >
                                    All <i className="ft-check-square"/>
                                </button>
                            </div>
                            <div className="col-6 text-center">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary round btn-sm"
                                    onClick={ e => dispatch({type: 'forAllInGroup', groupName: groupName, value: 0})}
                                >
                                    All <i className="ft-square"/>
                                </button>
                            </div>
                        </div>
                        <div className="form-group p-1">
                            <input
                                className="form-control"
                                placeholder="search"
                                value={inputText}
                                onChange={e => searchFilters(e, groupName)}
                            />
                        </div>
                        <div className="list-holder" data-simplebar>
                            <div>
                                {
                                    data.map( item => {
                                        return  !!item.searched && !!item.available && (
                                            <div className="custom-control custom-checkbox" key={item.id}>
                                                <input
                                                    type="checkbox"
                                                    id={groupName+item.id}
                                                    checked={parseInt(item.selected)}
                                                    className="custom-control-input bg-primary"
                                                    onChange={e => {
                                                        dispatch({type: 'toggleFilter', groupName: groupName, item: item});
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
            {/*<div className="btn-group full-width">
                <button
                    className="btn btn-bg-gradient-x-purple-blue dropdown-toggle full-width"
                    type="button"
                    id="dropdownMenuButton"
                    aria-haspopup="true"
                    aria-expanded="false"
                    onClick={ (e) => {
                        e.target.tagName === 'SPAN'
                            ? e.target.parentElement.parentElement.querySelector('.dropdown-menu').classList.toggle('show')
                            : e.target.parentElement.querySelector('.dropdown-menu').classList.toggle('show');
                    }}
                >
                    <span className="menu-title" data-i18n="">{groupName}</span>
                </button>
                <div className="dropdown-menu " aria-labelledby="dropdownMenuButton"  x-placement="bottom-end">
                    <div className="form-group p-1">
                        <input
                            className="form-control"
                            placeholder="search"
                            value={inputText}
                            onChange={e => searchFilters(e, groupName)}
                        />
                    </div>
                    <div className="list-holder" data-simplebar>
                        <div>
                            {
                                data.map( item => {
                                    return  !!item.searched && !!item.available && (
                                        <div className="custom-control custom-checkbox" key={item.id}>
                                            <input
                                                type="checkbox"
                                                id={groupName+item.id}
                                                checked={parseInt(item.selected)}
                                                className="custom-control-input bg-primary"
                                                onChange={e => {
                                                    dispatch({type: 'toggleFilter', groupName: groupName, item: item});
                                                }}/>
                                            <label htmlFor={groupName+item.id} className="custom-control-label">{item.caption}</label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>*/}
        </li>
    );
};

export default FilterMenuComponent;