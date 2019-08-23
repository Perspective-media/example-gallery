import React, {useState} from 'react';
import {Dropdown, Card, Button, ListGroup} from 'react-bootstrap';

const CollectionComponent = ({examples, dispatchExamples, setShowCollected}) => {
    let someCollected = examples.length > 0 ? true : false;
    return (
        <Dropdown>
            <Dropdown.Toggle className="btn btn-outline-primary btn-sm">
                Collection
            </Dropdown.Toggle>
            <Dropdown.Menu>

                    <Card.Body>
                        <Card.Title>YOUR COLLECTION</Card.Title>
                        <Card.Text>
                            Here is your collection. You can send it or delete all items from there with next buttons
                        </Card.Text>
                        <Button
                            className="btn-outline-primary btn"
                            onClick={() => dispatchExamples({type: 'addAll'})}>
                            ADD ALL
                        </Button>
                        {
                            someCollected &&
                            <>
                                <Button
                                    className="btn-outline-primary btn"
                                    onClick={() => dispatchExamples({type: 'clearAll'})}>
                                        DELETE ALL
                                </Button>
                                <Button
                                    className="btn-outline-primary btn"
                                    onClick={() => setShowCollected((prev) => !prev)}>
                                    Show collected
                                </Button>
                            </>
                        }
                        <ListGroup variant="flush" className="m-1">
                            {
                                examples.map( example => {
                                    return <ListGroup.Item key={example.id}>{example.number}</ListGroup.Item>
                                })
                            }
                        </ListGroup>
                    </Card.Body>

            </Dropdown.Menu>
        </Dropdown>
    )
};

export default CollectionComponent;