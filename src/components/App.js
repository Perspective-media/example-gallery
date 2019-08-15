import React,{useState, useMemo, useEffect, useReducer} from 'react';
import FilterMenuComponent from './FilterMenuComponent';
import GridContainer from './gridComponent';
import {isEqual, virtualFiltering, listOfAvailableFunc, createAndLoadScript, handleToggleMenu} from '../assets/additionalFunctions';
import '../assets/style.css';
require('babel-polyfill');
import axios from 'axios';

const App = () => {

    const [lastFilterGroup, setLastFilterGroup] = useState([]);
    const [fetchedExamples, setFetchedExamples] = useState([]);

    const [picsValue, setPicsValue] = useState('');

    //function of react-grid
    const [myGrid, setMyGrid] = useState();

    const recurerFilters = (prevFilters, action) => {
        switch (action.type){
            case 'fetched':
                return action.state;

            case 'toggleFilter':
                //way of copying nested object, i`m not sure if this is the best way
                let newStateString = JSON.stringify(prevFilters);
                let newState = JSON.parse(newStateString);
                // end of copying

                if(action.groupName === 'pics') {

                } else {
                    let itemIndex = prevFilters[action.groupName].findIndex( item => item.id === action.item.id);
                    let selectedNew = !!parseInt(action.item.selected) ? 0 : 1;
                    newState[action.groupName][itemIndex].selected = selectedNew;
                }

                setLastFilterGroup( prevstate => {
                    let newStateGroup = [...prevstate];
                    let curIndex = newStateGroup.indexOf( action.groupName);
                    let isSomeChecked = newState[action.groupName].some( filter => !!parseInt(filter.selected));
                    curIndex < 0
                        ? newStateGroup.push(action.groupName)
                        : newStateGroup.splice(curIndex, 1) && isSomeChecked && newStateGroup.push(action.groupName);
                    return newStateGroup;
                });
                return newState;

            case 'searchFilters':
                let newSearchedState = {
                    ...prevFilters,
                    [action.groupName]: [...prevFilters[action.groupName]].map(
                        filter => filter.caption.toLowerCase().indexOf(action.value.toLowerCase()) >= 0
                        ? {
                            ...filter,
                            searched: 1
                        }
                        : {
                            ...filter,
                            searched: 0
                        }
                    )
                };
                return newSearchedState;

            case 'showExisting':
                let lisOfFilters = Object.keys(prevFilters);
                let listOfAvailable = {};
                let lastELemFilter = lastFilterGroup[lastFilterGroup.length-1];
                lisOfFilters.map( filter => {
                    listOfAvailable[filter] = [];
                    fetchedExamples.length !== 0 && !lastFilterGroup.includes(filter)
                        ? action.examples.map( example => {
                            listOfAvailableFunc(example, filter, listOfAvailable);
                        })
                        : virtualFiltering(filter, prevFilters, fetchedExamples).map( example => {
                            listOfAvailableFunc(example, filter, listOfAvailable);
                        })
                });
                //deep copy obj
                let newFiltersString = JSON.stringify(prevFilters);
                let newFilters = JSON.parse(newFiltersString);
                //end deep copy
                let isSomeChecked = lastFilterGroup.length > 0 && newFilters[lastELemFilter].some( filter => !!parseInt(filter.selected) );
                lisOfFilters.map( filterGroup => {
                    newFilters[filterGroup] = prevFilters[filterGroup].map( filter => {
                        return listOfAvailable[filterGroup].includes(filter.id)
                            ? {
                                ...filter,
                                available: 1
                            }
                            : {
                                ...filter,
                                selected: 0,
                                available: 0
                            };
                    })
                });
                return isEqual(prevFilters, newFilters) ? prevFilters : newFilters;

            case 'forAllInGroup':
                return {
                    ...prevFilters,
                    [action.groupName]: [...prevFilters[action.groupName]].map( filter => {
                        return filter.available && filter.searched ? {
                            ...filter,
                            selected: action.value
                        } : filter
                    })
                };

            case 'clearAll':
                let newClearFilters = {...prevFilters};
                for (let groupName in newClearFilters) {
                    newClearFilters[groupName].map( filter => filter.selected = 0)
                }
                return newClearFilters;
            default: return prevFilters;
        }
    };

    const reducerExamples = (prevExamples, action) => {
        switch (action.type){
            case 'fetched':
                setFetchedExamples(action.state);
                return action.state;
            case 'collected':
                let indexOfCollected = prevExamples.map( example => example.id).indexOf(action.id);
                let collectedExamples = [...prevExamples];
                let newCollcetedValue = !parseInt([...prevExamples][indexOfCollected].collected)
                    ? 1 : 0;
                collectedExamples[indexOfCollected] = {
                    ...collectedExamples[indexOfCollected],
                    collected: newCollcetedValue
                };
                return collectedExamples;
            case 'filtering':
                return virtualFiltering('nothing here to exclude', action.filters, prevExamples, action.callback, action.picNumber);
        }
    };

    const [filters, dispatchFilters] = useReducer(recurerFilters, {});
    const [examples, dispatchExamples] = useReducer(reducerExamples, []);

    let filterNameList = Object.keys(filters);

    useEffect( () => {
        const getFetch = async () => {
            let res = await axios.get('http://localhost:8080/data.json');
            dispatchFilters({type: 'fetched', state: res.data.menuFilters});
            dispatchExamples({type: 'fetched', state: res.data.examples})
        };
        getFetch();
    },[]);

    useEffect( () => {
        dispatchExamples({
                type: 'filtering',
                filters: filters,
                callback: dispatchFilters,
                picNumber: picsValue,
            });
    },[filters, picsValue]);

    useEffect( () => {
        let promise = new Promise(function(resolve, reject) {
            resolve('Success');
        });
        promise.then((resolveMessage) => {
            handleToggleMenu();/*
            createAndLoadScript('app_assets/ltr/app-assets/js/core/app-menu.js');
            createAndLoadScript('app_assets/ltr/app-assets/js/core/app.js');*/
        });
        myGrid && myGrid.updateLayout();
    },[]);


    return (
        <>
            <nav className="header-navbar navbar-expand-md navbar navbar-with-menu navbar-without-dd-arrow fixed-top navbar-semi-light">
                <div className="navbar-wrapper">
                    <div className="navbar-container content">
                        <div className="collapse navbar-collapse show" id="navbar-mobile">
                            <ul className="nav navbar-nav mr-auto float-left">
                                <li className="nav-item mobile-menu d-md-none mr-auto">
                                    <a className="nav-link nav-menu-main menu-toggle-handle hidden-xs" href="#">
                                        <i className="ft-menu font-large-1">
                                        </i>
                                    </a>
                                </li>
                                <li className="nav-item d-none d-md-block">
                                    <a className="nav-link nav-menu-main menu-toggle-handle hidden-xs" href="#">
                                        <i className="ft-menu">
                                        </i>
                                    </a>
                                </li>
                            </ul>
                            <ul className="nav navbar-nav float-right">
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="main-menu menu-fixed menu-light menu-accordion menu-shadow " data-scroll-to-active="true" data-img="app_assets/ltr/app-assets/images/backgrounds/02.jpg">
                <div className="navbar-header">
                    <ul className="nav navbar-nav flex-row">
                        <li className="nav-item mr-auto">
                            <a className="navbar-brand" href="index.html">
                                <img className="brand-logo" alt="Chameleon admin logo" src="app_assets/ltr/app-assets/images/logo/logo.png"/>
                                <h3 className="brand-text">Filters</h3>
                            </a>
                        </li>
                        <li className="nav-item d-md-none">
                            <a className="nav-link close-navbar">
                                <i className="ft-x"></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="main-menu-content ps ps--active-y" data-scroll-to-active="true">
                    <ul className="navigation navigation-main" data-menu="menu-navigation" >
                        {
                            filterNameList.map( item => {
                                return (
                                    <FilterMenuComponent
                                        groupName={item}
                                        key={item}
                                        {...{examples, dispatchFilters, dispatchExamples, filters}}
                                    />
                                )
                            })
                        }
                        <li className="nav-item">
                            <div className="card-accordion">
                                <div className="card accordion-icon-rotate">
                                    <div className="card-header2">
                                        <button
                                            className="btn btn-bg-gradient-x-purple-blue full-width collapse-icon"
                                            type="button"
                                            data-toggle="collapse"
                                            data-target={`#pics`}
                                            aria-expanded="false"
                                        >
                                            <span className="menu-title" >Pics</span>
                                        </button>
                                    </div>
                                    <div id='pics' className="collapse" aria-labelledby="headingCOne">
                                        <div className="input-group p-1">
                                            <input
                                                className="form-control border-bottom-blue-grey border-top-0 border-left-0 border-right-0 rounded-0"
                                                type="search"
                                                value={picsValue}
                                                placeholder="quantity of your pics"
                                                onChange={e => {
                                                    let curVal = e.target.value;
                                                    !isNaN(curVal) && setPicsValue(curVal);
                                                }}
                                            />
                                            {
                                                picsValue !== '' &&
                                                <div className="input-group-append">
                                                    <button
                                                        className="btn btn-cancel-search btn-sm border-bottom-blue-grey border-top-0 border-left-0 border-right-0 rounded-0"
                                                        type="button"
                                                        onClick={() => {
                                                            setPicsValue('');
                                                        }}
                                                    >
                                                        <i className="ft-x"/>
                                                    </button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="navigation-background"></div>
            </div>
            <GridContainer {...{examples, filters, dispatchExamples, dispatchFilters, myGrid, setMyGrid}}/>
        </>
    )
};

export default App;