import React,{useState, useMemo, useEffect, useReducer} from 'react';
import axios from 'axios';

const useProjectLog = (userID) => {

    //reducer functions
    const projObjReducer = (prevState, action) => {
        switch (action.type){
            case 'messageWasMount':
                return [...prevState].map(
                    proj => proj.id === curProj.id
                        ? {
                            ...proj,
                            log: [...proj.log].map( item =>
                                    item.id === action.id
                                    ? {
                                        ...item,
                                        readBy: [...item.readBy, curProj.userId]
                                    }
                                    : item
                            )
                        }
                        : proj
                );
            case 'newMessage':
                return [...prevState].map(
                    proj => proj.id === curProj.id
                        ? {
                            ...proj,
                            log: [
                                ...proj.log,
                                action.newMessageObj
                            ],
                            content: action.value,
                            date: action.dateProp,
                            readed: true
                        }
                        : proj
                );
            case 'fetchedData':
                return [...action.data];
            case 'logMemo':
                return [...prevState].map(
                    obj => obj.id === curProj.id ? {...obj, readed: action.readed} : obj
                );
            case 'feedbackMarks':
                return [...prevState].map(
                    obj => obj.id === curProj.id ? {...obj, [action.markType]: action.index} : obj
                );
            case 'searching':
                return [...prevState].map(
                    obj => obj.id === action.item.id ? {...obj, searched: action.bool} : obj
                );
            case 'filtering':
                let filteredObjectList = [];
                //checking if some filter is exist
                let isSomeFilterChecked = action.filters.some( item => {
                    return item.values.some( filter => filter.selected);
                });
                filteredObjectList = prevState.map( obj => {
                    //creating empty array for holding multifilters boolean values from different types of filtering
                    let multifilters = [];
                    return {
                        ...obj,
                        //setting filtered value if filters is not exist its set true for all, if not - returning function with...
                        //function part - doing loop through all filters and checking if at least some of returning condition is true
                        filtered: !isSomeFilterChecked || (() => {action.filters.some( item => {
                                // val - value property of filtering info(now we are filtering by type-property which is equal to property in obj)
                                let val = obj[item.type.toLowerCase()];
                                // filters - array with only selected filters
                                let filters = item.values.filter( filter => filter.selected);
                                // if selected filters in current type exist - checking if at least some of them is equal to our variable 'val' from object
                                //and pushing this returning boolean true or false to multifilters array
                                filters.length > 0 && multifilters.push( filters.some( filter => filter.field === val ));
                            });
                            //returning boolean value true or false if all pushed condition in our multifilter is true
                            return multifilters.every( val => val )}
                        )()
                    };
                });
                return filteredObjectList;
            case 'sorting':
                let newState = [...prevState];
                newState.sort( (next, prev) =>
                    next[action.sorted.toLowerCase()] > prev[action.sorted.toLowerCase()]
                        ? 1
                        : next[action.sorted.toLowerCase()] === prev[action.sorted.toLowerCase()]
                            ? 0 : -1
                );
                console.log(newState);
                return newState;
            default: return prevState;
        }
    };

    //current selected project - obj with userid and curNum of project
    const [curProj, setCurProj] = useState({userId: userID});
    //all projects array with main info for thumbnails - array with objects with necessary info
    const [projObjList, dispatchObjList] = useReducer(projObjReducer,[]);
    //input message string
    const [inputText, setInputText] = useState('');
    //loading state
    const [loading, setLoading] = useState(true);

    //fucntion for changing current selected project
    const handleChangeProjNum = (id, i) => {
        setCurProj({id: id, userId: userID, index: parseInt(i)});
    };


    //function for inserting new message in log
    const newMessage = (value) => {
        if (!value.match(/^ *$/)) {
            let dateProp = new Date().toISOString().split('.')[0].replace('T',' ');
            let newMessageObj = {
                "id" : Date.now(),
                "userId" : userID,
                "userImage" : "app_assets/ltr/app-assets/images/portrait/small/avatar-s-3.jpg",
                "date" : dateProp,
                "content" : value,
                "readBy" : [userID],
                "type": ""
            };
            setInputText('');
            dispatchObjList({type: 'newMessage', newMessageObj: newMessageObj, value: value, dateProp:  dateProp})
        }
    };

    // here is doing whatever you want when project unmounting
    useEffect( () => {
        return () => {
            curProj.id ?  console.log('-----------here is unmount project '+ curProj.id) : console.log('no unmount cos curpro jempty');
        }
    },[curProj.id]);

    //loading current projects of user
    useEffect( () => {
        const getFetch = async () => {
            let res = await axios.get('jsons/projectLog.json');
            let objList = res.data.map( obj => {
                let lastLogElem = obj.log[obj.log.length-1];
                let readed = lastLogElem.readBy.includes(userID) || lastLogElem.userId == userID ? true : false;
                return {
                    ...obj,
                    date: lastLogElem.date,
                    content: lastLogElem.content,
                    readed: readed,
                    filtered: true,
                    searched: true
                }
            });
            dispatchObjList({type: 'fetchedData', data: objList});
            !curProj.id && setCurProj({ id: objList[0].id, userId: userID , index: 0});
            console.log('+++++++++++++here is mount project with fetched data ' + curProj.id);
            setLoading(false);
        };
        getFetch();
    },[]);

    useMemo( () => {
        console.log('+++++++++++++here is updated cur num but not fetcehd new data ' + curProj.id);
        let readed = curProj.index && projObjList[curProj.index].log.length > 0 && (projObjList[curProj.index].log[0].readBy.includes(userID) || projObjList[curProj.index].log[0].userId === userID);
        readed && projObjList[curProj.index].log.length > 0 ? dispatchObjList({type: 'logMemo', readed: readed}) : console.log('empty array');
    },[curProj.index && projObjList[curProj.index].log]);


    return [loading, curProj, projObjList, inputText, setInputText, dispatchObjList, handleChangeProjNum, newMessage];
};

export default useProjectLog;