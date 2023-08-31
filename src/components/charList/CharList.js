import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch(process) {
        case 'waiting':
            return <Spinner/>;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
        case 'confirmed':
            return <Component/>;
        case 'error': 
            return <ErrorMessage/>;
        default: 
            throw new Error('Unexpected process state');

    }
}

const CharList = (props) => {
    const [char, setChar] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {getAllCharacters, process, setProcess} = useMarvelService();

    useEffect(() => {
        onUpdateChars(offset, true);
    }, [])

    const onUpdateChars = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharsLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharsLoaded = (newChar) => {
        let ended = false;
        if(newChar.length < 9) {
            ended = true;
        }

        setChar(char => [...char, ...newChar]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended)
    }

    const itemsRef = useRef([]);

    const setActiveRef = (id) => {
        itemsRef.current.forEach(item => item.classList.remove('char__item_selected'));
        itemsRef.current[id].classList.add('char__item_selected');
        itemsRef.current[id].focus();
    }

    function renderItems(arr) {
        const items = arr.map(({name, thumbnail, id}, i) => {
            let imgStyles = thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ? {objectFit: 'unset'} : null;

            return (
                <CSSTransition key={id} timeout={500} classNames="char__item">
                    <li
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemsRef.current[i] = el}
                    key={id}
                    onKeyDown={(e) => {
                        if(e.key === ' ' || e.key === 'Enter'){
                            props.onCharSelected(id);
                            setActiveRef(i)
                        }
                    }

                    }
                    onClick={() => {
                        props.onCharSelected(id);
                        setActiveRef(i)
                    
                    }}>
                        <img src={thumbnail}  style={imgStyles} alt={name}/>
                        <div className="char__name">{name}</div>
                    </li>
                </CSSTransition>
            )
            
        })

        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

    const elements = useMemo(() => {
        return setContent(process, () => renderItems(char), newItemLoading);
    }, [process])

    return (
        <div className="char__list">
            {elements}
            <button className="button button__main button__long" 
            disabled={newItemLoading}
            style={{'display': charEnded ? 'none' : 'block'}}>
                <div className="inner" onClick={() => onUpdateChars(offset)}>load more</div>
            </button>
        </div>
    )
}


CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;