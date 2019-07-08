import React from 'react';

const MenuSlideComponent = ({item}) => {
    return (
        <li className="nav-item">
            <a href="#">
                <i className={item.icon}/>
                <span className="menu-title" data-i18n="">{item.name}</span>
            </a>
        </li>
    );
};

export default MenuSlideComponent;
