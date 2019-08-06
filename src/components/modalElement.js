import React, {useRef} from 'react';
import {Modal, Button, ButtonToolbar} from 'react-bootstrap';
import {bookView} from '../assets/additionalFunctions';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';


const MyVerticallyCenteredModal = (props) => {
        let bookContainer = useRef();
        let gridContainer = useRef();

        const {list, num} = props.data;

        return (
            <Modal
                {...props}
                size="xl"
                centered
                container={document.doby}
                aria-labelledby="contained-modal-title-vcenter"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {num}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="main clearfix hidden" ref={bookContainer}>
                        <div className="book-header">
                            <div></div>
                            <button
                               className="round border-0 cursor-pointer bg"
                               onClick={ (e) => {
                                   bookContainer.current.classList.add('hidden');
                                   gridContainer.current.classList.remove('hidden');
                               }}
                            >
                                Close book-view
                            </button>
                        </div>
                        <div className="bb-custom-wrapper">
                            <div id="bb-bookblock" className="bb-bookblock">
                                {
                                    list && list.map(image => {
                                        return (
                                            <div className="bb-item" key={image}>
                                                <img src={`https://galleries.perspective-media.me/examples_galleries/${num}/${image}`} />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <nav>
                                <a id="bb-nav-first" href="#" className="btn btn-bg-gradient-x-purple-blue"><i className="ft-chevrons-left"/></a>
                                <a id="bb-nav-prev" href="#" className="btn btn-bg-gradient-x-purple-blue"><i className="ft-chevron-left"/></a>
                                <a id="bb-nav-next" href="#" className="btn btn-bg-gradient-x-purple-blue"><i className="ft-chevron-right"/></a>
                                <a id="bb-nav-last" href="#" className="btn btn-bg-gradient-x-purple-blue"><i className="ft-chevrons-right"/></a>
                            </nav>
                        </div>
                        <div className="book-footer">
                            {list && list.map((image, ind) => {
                                return (
                                    <img
                                        src={`https://galleries.perspective-media.me/examples_galleries/${num}/${image}`}
                                        alt="Card image cap"
                                        onClick={ (e) => bookView(ind, bookContainer, gridContainer)}
                                        key={image}
                                    />
                                )
                            })}
                        </div>
                    </div>
                    <div className="row" ref={gridContainer}>
                        {list && list.map((image, ind) => {
                            return (
                                <div
                                    className="col-xs-12 col-sm-12 col-md-4 col-lg-3"
                                    onClick={ (e) => bookView(ind, bookContainer, gridContainer)}
                                    key={image}>
                                    <div className="card border-0 box-shadow-0">
                                        <div className="card-content">
                                            <LazyLoadImage
                                                src={`https://galleries.perspective-media.me/examples_galleries/${num}/${image}`}
                                                className="card-img img-fluid image-ov"
                                                effect="opacity"
                                                alt="Card image cap"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Modal.Body>
            </Modal>
        );
};


export default MyVerticallyCenteredModal;