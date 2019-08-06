import React, {useState} from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

const rangeElement = ({availableFilters}) => {

    let globalRange = {
        min: 0,
        max: 0
    };


    availableFilters.forEach( filter => {
        let intValue = parseInt(filter.id);
        globalRange.min === 0
            ? globalRange.min = globalRange.max = intValue
            : parseInt(globalRange.min) >= intValue
                ? globalRange.min = intValue
                : parseInt(globalRange.max) <= intValue
                    ? globalRange.max = intValue
                    : null;
    });
    const [range, setRange] = useState({ min: globalRange.min, max: globalRange.max });

    return (
        globalRange.min !== globalRange.max && <InputRange
                minValue={globalRange.min}
                maxValue={globalRange.max}
                value={range}
                onChange={
                    value => {
                        setRange(value)
                    }
                }
            />
        );
};

export default rangeElement;