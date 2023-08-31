import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

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

const ComicsList = (props) => {
    const [comics, setComics] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {getAllComics, process, setProcess} = useMarvelService();

    useEffect(() => {
        onUpdateComics(offset, true);
    }, [])


    const onUpdateComics = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onComicsLoaded = (newComics) => {
        let ended = false;
        if(newComics.length < 8) {
            ended = true;
        }

        setComics(comics => [...comics, ...newComics]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setComicsEnded(comicsEnded => ended)
    }
    
    function renderItems(arr) {
        const items = arr.map(({title, thumbnail, price, id}) => {
            return (
                <li className="comics__item" key={id}>
                    <Link to={`/comics/${id}`}>
                        <img src={thumbnail} alt="ultimate war" className="comics__item-img"/>
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}</div>
                    </Link>
                </li>
            )
            
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }


    return (
        <div className="comics__list">
            {setContent(process, () => renderItems(comics), newItemLoading)}
            <button className="button button__main button__long" 
            disabled={newItemLoading}
            style={{'display': comicsEnded ? 'none' : 'block'}}>
                <div className="inner" onClick={() => onUpdateComics(offset)}>load more</div>
            </button>
        </div>
    )
    
}

export default ComicsList;