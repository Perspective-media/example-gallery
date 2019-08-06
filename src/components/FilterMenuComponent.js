import React, {useState} from 'react';
import SimpleBar from 'simplebar';
import RangeElement from './rangElement';
import 'simplebar/dist/simplebar.min.css';

const FilterMenuComponent = ({groupName, data, dispatch}) => {
    const [inputText, setInputText] = useState('');

    let availableFilters = data.filter( item => !!item.available);

    const searchFilters = (e, groupName) => {
        let val = e === '' ? '' : e.target.value;
        setInputText(val);
        dispatch({type: 'searchFilters', groupName: groupName, value: val});
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
                            <div className="btn-group m-auto p-0">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary round btn-sm border-0"
                                    onClick={ e => dispatch({type: 'forAllInGroup', groupName: groupName, value: 1})}
                                >
                                    <i className="ft-check-square"/>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary round btn-sm border-0 disabled"
                                >
                                    All
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary round btn-sm border-0"
                                    onClick={ e => dispatch({type: 'forAllInGroup', groupName: groupName, value: 0})}
                                >
                                    <i className="ft-square"/>
                                </button>
                            </div>
                        </div>
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
                        {
                            groupName === 'files' &&
                            <RangeElement {...{availableFilters}}/>
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
                                                        console.log('clicked');
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
        </li>
    );
};

export default FilterMenuComponent;