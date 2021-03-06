import React, {useState, useEffect, useReducer, useRef} from 'react';
import StackGrid from "react-stack-grid";
import MyVerticallyCenteredModal from './modalElement';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {toggleMenu} from '../assets/additionalFunctions';
import 'react-lazy-load-image-component/src/effects/opacity.css';

// ------------ ELEMENT --------------

const GridElem = ({example, myGrid, dispatchExamples}) => {
    const [modalShow, setModalShow] = useState(false);
    const [posted, setPosted] = useState({});
    const [infoStatus, setInfoStatus] = useState(false);
    const imageRef = useRef();
    // const [heightStyle, setStyleHeight] = useState({});
    // useEffect(() => myGrid.updateLayout(), [infoStatus]);

    useEffect(() => {
        setTimeout( () => {
            myGrid.updateLayout();
        },1000);
    },[]);

    const toggleInfoStatus = () => {
        let cardPosition = parseInt(imageRef.current.parentElement.style.transform.split('translateY(')[1].split('px)')[0]);
        let cardHeight = imageRef.current.firstElementChild.offsetHeight;
        let cardContainer = imageRef.current.parentElement.parentElement;
        !infoStatus && parseInt(cardContainer.style.height) < (cardPosition + cardHeight + 300)
                ? cardContainer.style.height = cardPosition + cardHeight + 300 + 'px'
                : null;
        setInfoStatus(prev => {
            imageRef.current.parentElement.style.zIndex = prev ? 2 : 999;
            imageRef.current.firstElementChild.style.boxShadow = prev ? '' : '0px 10px 20px 1px rgba(57, 57, 57, .9)';
            return !prev;
        });
    };

    const modalClose = () => {
        setModalShow(false);
        toggleMenu(document.body.classList.contains('menu-collapsed'));
    };

    const checkPost = () => {
        toggleMenu(window.innerWidth > 992 ? document.body.classList.contains('menu-expanded') : document.body.classList.contains('menu-open') );
        let test = ["17695-01.jpg", "17695-02.jpg", "17695-03.jpg", "17695-04.jpg", "17695-05.jpg", "17695-06.jpg", "17695-07.jpg", "17695-08.jpg", "17695-09.jpg", "17695-10.jpg", "17695-11.jpg", "17695-12.jpg", "17695-13.jpg", "17695-14.jpg", "17695-15.jpg", "17695-16.jpg", "17695-17.jpg", "17695-18.jpg", "17695-19.jpg", "17695-20.jpg", "17695-21.jpg", "17695-22.jpg", "17695-23.jpg", "17695-24.jpg"];
        setPosted({
            list: test,
            num: example.number
        });
        setModalShow(true);
        // let postData = {
        //     path: 'D:/TEMP/examples_galleries/',
        //     number: example.number,
        // };
        // jQuery.post("http://localhost:69/gallery.php", postData, function(data, status) {
        //     if(status === 'success'){
        //         toggleMenu(document.body.classList.contains('menu-expanded'));
        //         let postRes = JSON.parse(data);
        //         setPosted({
        //             list: postRes,
        //             num: example.number
        //         });
        //         setModalShow(true);
        //     } else {
        //         console.log('all is shit');
        //     }
        // });
    };

    return(
        <>
            <div className="col-12 example-elem" ref={imageRef}>
                <div className="card">
                    <div className="full-width image-cover-box">
                        <i
                            className={`${example.collected ? 'ft-check-circle blue' : 'ft-circle'} font-large-1 position-absolute zindex-4 collectionIcon`}
                            onClick={() => dispatchExamples({type: 'collected', id: example.id})}
                        />
                        <img
                            onClick={() => checkPost()}
                            className="card-img-top img-fluid"
                            src={`https://galleries.perspective-media.me/examples_galleries/${example.number}/${example.CoverImgUrl}`} alt=""
                        />
                        {/*<LazyLoadImage
                            className="card-img-top img-fluid"
                            onClick={() => checkPost()}
                            afterLoad={myGrid.updateLayout()}
                            src={`https://galleries.perspective-media.me/examples_galleries/${example.number}/${example.CoverImgUrl}`}
                            alt="Card image cap"
                            effect="opacity"
                        />*/}
                    </div>
                    <div className={`${example.collected && 'collected-card-border'} card-body`}
                         onMouseEnter={(e) => {
                             window.innerWidth >= 768 ? toggleInfoStatus() : null;
                         }}
                         onMouseLeave={ () => {
                             window.innerWidth >= 768 ? toggleInfoStatus() : null;
                         }}
                    >
                        <div className="card-title">
                            <h4 className="text-bold-700">
                                {example.products_caption}
                                <span className="float-right">
                                    {example.files} pages
                                </span>
                            </h4>
                        </div>
                        <p className="card-text">
                            {example.event_caption}
                        </p>
                        {
                            infoStatus
                            ? <>
                                <hr/>
                                <div className="card-text">
                                    <p>WOWOW</p>
                                    <p>NICE</p>
                                    Here is a lot of new info
                                    <p>WOWOW</p>
                                    <p>NICE</p>
                                    Here is a lot of new info
                                    <p>WOWOW</p>
                                    <p>NICE</p>
                                </div>
                            </>
                            : null
                        }
                        <hr/>
                        <p className="card-text text-center text-uppercase">
                            <small
                                className="text-muted cursor-pointer blue"
                                onClick={() => toggleInfoStatus()}
                            >
                                {infoStatus ? 'less info' :'more info'}
                            </small>
                        </p>
                    </div>
                </div>
            </div>
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={modalClose}
                data={posted}
            />
        </>
    )
};



//----------- CONTAINER ---------------

const GridContainer = ({examples, filters, dispatchFilters, dispatchExamples, myGrid, setMyGrid, showCollected, setShowCollected}) => {
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
    },[filters, examples]);

    useEffect( () => {
        myGrid && myGrid.updateLayout();
    },[]);

    let filtersList = Object.keys(filters);
    let someChecked = filtersList.some( groupName => filters[groupName].some( filter => !!parseInt(filter.selected)));
    return(
        <div className="app-content content">
            <div className="content-wrapper">
                <div className="content-wrapper-before">
                </div>
                <div className="content-header row justify-content-end">
                    <div className="content-header-left col-md-3 col-12 mb-2 flex-row-baseline">
                        {
                            someChecked &&
                            <button
                                type="button"
                                className="btn btn-sm btn-primary round btn-min-width mr-1 mb-1"
                                onClick={() => dispatchFilters({type: 'clearAll'})}
                            >
                                Clear all
                            </button>
                        }
                    </div>
                    <div className="content-headers-right col-md-9 col-sm-12 col-12 mb-2 row" ref={refValue}>
                        <ul className="nav col-12">
                            {
                                filtersList.map( groupName => {
                                    let isChecked = filters[groupName].filter( value => !!parseInt(value.selected));
                                    return isChecked.length > 0
                                        ? (
                                            <div  className="nav-link cursor-pointer" key={groupName}>
                                                {groupName}:
                                                {filters[groupName].map( filter => {
                                                    return !!parseInt(filter.selected) &&
                                                        <React.Fragment key={filter.id}>
                                                            <span className="msl-1 text-white">{filter.caption} </span>
                                                            <i
                                                                className="ft-x-circle"
                                                                onClick={() => {
                                                                    dispatchFilters({type: 'toggleFilter', groupName: groupName, item: filter});
                                                                }}
                                                            />
                                                        </React.Fragment>
                                                })}
                                            </div>
                                        )
                                        : null;
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div className="content-body">
                    <div className="row">
                        <div className="col-12">
                            <StackGrid
                                columnWidth={window.innerWidth <= 768 ? '100%' : '33.33%'}
                                duration={300}
                                gridRef={grid => {
                                    setMyGrid(grid);
                                }}
                            >
                                {
                                    examples.map( example => {
                                        return (
                                            showCollected
                                                ? !!parseInt(example.filtered)
                                                : !!parseInt(example.collected) || !!parseInt(example.filtered)
                                        )
                                        && <GridElem {...{example, myGrid, dispatchExamples}} key={example.id}/>
                                    })
                                }
                            </StackGrid>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GridContainer;