import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
    state = {
        char: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false,
    }

    componentDidMount() {
        this.onUpdateChars();
    }

    marvelService = new MarvelService();

    onUpdateChars = (offset) => {
        this.onCharsLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharsLoaded)
            .catch(this.onError);
    }

    onCharsLoading = () => {
        this.setState ({
            newItemLoading: true
        })
    }

    onCharsLoaded = (newChar) => {
        let ended = false;
        if(newChar.length < 9) {
            ended = true;
        }


        this.setState(({offset, char}) => ({
            char: [...char, ...newChar],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    itemsRef = [];

    setRefs = (ref) => {
        this.itemsRef.push(ref)
    }

    setActiveRef = (id) => {
        this.itemsRef.forEach(item => item.classList.remove('char__item_selected'));
        this.itemsRef[id].classList.add('char__item_selected');
        this.itemsRef[id].focus();
    }

    renderItems(arr) {
        const items = arr.map(({name, thumbnail, id}, i) => {
            let imgStyles = thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ? {objectFit: 'unset'} : null;

            return (
                <li
                className="char__item"
                tabIndex={0}
                ref={this.setRefs}
                key={id}
                onKeyDown={(e) => {
                    if(e.key === ' ' || e.key === 'Enter'){
                        this.props.onCharSelected(id);
                        this.setActiveRef(i)
                    }
                }

                }
                onClick={() => {
                    this.props.onCharSelected(id);
                    this.setActiveRef(i)
                   
                }}>
                    <img src={thumbnail}  style={imgStyles} alt="abyss"/>
                    <div className="char__name">{name}</div>
                </li>
            )
            
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const {char, loading, error, offset, newItemLoading,charEnded} = this.state;

        const items = this.renderItems(char);
        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long" 
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}>
                    <div className="inner" onClick={() => this.onUpdateChars(offset)}>load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;