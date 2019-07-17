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

    const recurerFilters = (prevFilters, action) => {
        switch (action.type){
            case 'fetched':
                return action.state;

            case 'toggleFilter':
                let itemIndex = prevFilters[action.groupName].findIndex( item => item.id === action.item.id);
                let selectedNew = !!parseInt(action.item.selected) ? 0 : 1;
                let newState = {...prevFilters};
                newState[action.groupName][itemIndex].selected = selectedNew;
                setLastFilterGroup( prevstate => {
                    let newState = [...prevstate];
                    let curIndex = newState.indexOf( action.groupName);
                    let isSomeChecked = prevFilters[action.groupName].some( filter => !!parseInt(filter.selected));
                    curIndex < 0
                        ? newState.push(action.groupName)
                        : newState.splice(curIndex, 1) && isSomeChecked && newState.push(action.groupName);
                    return newState;
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
                let newFilters = {...prevFilters};
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
                        return filter.available ? {
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
            case 'filtering':
                return virtualFiltering('nothing here to exclude', action.filters, prevExamples, action.callback);
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
                callback: dispatchFilters
            });
    },[filters]);

    useEffect( () => {
        let promise = new Promise(function(resolve, reject) {
            resolve('Success');
        });
        promise.then((resolveMessage) => {
            handleToggleMenu();
            createAndLoadScript('app_assets/ltr/app-assets/js/core/app-menu.js');
            createAndLoadScript('app_assets/ltr/app-assets/js/core/app.js');
        });
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
                                        data={filters[item]}
                                        groupName={item}
                                        key={item}
                                        dispatch={dispatchFilters}
                                    />
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="navigation-background"></div>
            </div>
            <GridContainer {...{examples, filters}} dispatch={dispatchFilters}/>
        </>
    )
};

export default App;