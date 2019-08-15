import React, {useState} from 'react';
import {Dropdown} from 'react-bootstrap';

const CollectionComponent = ({examples}) => {
    console.log(examples);
    return (
        <Dropdown>
            <Dropdown.Toggle className="btn btn-outline-primary btn-sm">
                Collection
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {
                    examples.map( example => {
                        return <Dropdown.Item href="#/action-1" key={example.id}>{example.number}</Dropdown.Item>
                    })
                }
            </Dropdown.Menu>
        </Dropdown>
    )
};

export default CollectionComponent;