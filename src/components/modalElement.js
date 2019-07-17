import React, {Component, render, useState} from 'react';
import {Modal, Button, ButtonToolbar} from 'react-bootstrap';
import {bookView} from '../assets/additionalFunctions';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';


const MyVerticallyCenteredModal = (props) => {
        const {list, num} = props.data;

        let testStyle = {
            backgroundImage: 'url(http://ive.com.ua/static/wallpapers/7408824a.JPG)'
        };
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
                    <div className="main clearfix">
                        <div className="bb-custom-wrapper">
                            <div id="bb-bookblock" className="bb-bookblock">
                                <div className="bb-item">
                                    <img src="https://galleries.perspective-media.me/examples_galleries/0001/17695-01.jpg" alt="image01"/>
                                </div>
                                <div className="bb-item">
                                    <img src="https://galleries.perspective-media.me/examples_galleries/0001/17695-01.jpg" alt="image02"/>
                                </div>
                                <div className="bb-item">
                                    <img src="https://galleries.perspective-media.me/examples_galleries/0001/17695-01.jpg" alt="image03"/>
                                </div>
                                <div className="bb-item">
                                    <img src="https://galleries.perspective-media.me/examples_galleries/0001/17695-01.jpg" alt="image04"/>
                                </div>
                                <div className="bb-item">
                                    <img src="https://galleries.perspective-media.me/examples_galleries/0001/17695-01.jpg" alt="image05"/>
                                </div>
                            </div>
                            <nav>
                                <a id="bb-nav-first" href="#" className="">First page</a>
                                <a id="bb-nav-prev" href="#" className="">Previous</a>
                                <a id="bb-nav-next" href="#" className="">Next</a>
                                <a id="bb-nav-last" href="#" className="">Last page</a>
                            </nav>
                        </div>
                    </div>
                    <div className="row">
                        {list && list.map(image => {
                            return (
                                <div
                                    className="col-xs-12 col-sm-12 col-md-4 col-lg-3"
                                    onClick={ (e) => bookView(e, 'https://galleries.perspective-media.me/examples_galleries/', list, num)}
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
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
};


export default MyVerticallyCenteredModal;