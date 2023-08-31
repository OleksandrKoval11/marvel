import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

import useMarvelService from '../../services/MarvelService';
import './searchCharForm.scss';

const SearchCharForm = () => {
    const [char, setChar] = useState('');
    const [error, setError] = useState(false);

    const {getCharacterByName} = useMarvelService();

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const onCharError = () => {
        setError(true);
    }

    const searchChar = (name) => {
        setError(false);
        getCharacterByName(name)
            .then(onCharLoaded)
            .catch(onCharError)
    }

    const success = !char.name ? null : 
                    <div className='form__wrapper-success'>
                        <p className='success'>There is! Visit {char.name} page?</p>
                        <Link to={`/char/${char.id}`} className="form__btn button button__secondary">
                            <div className="inner">TO PAGE</div>
                        </Link>
                    </div>
    const fail = !char.name && error ? <p className='error'>The character was not found. Check the name and try again</p> : null;

    return (
        <Formik
        initialValues = {{
            name: ''
        }}
        validationSchema = {Yup.object({
            name: Yup.string().required('This field is required')
        })}
        onSubmit = { ({name}) => {
            searchChar(name);
        }}
        >
            <Form className='form'>
                <label htmlFor="text" className='form__title'>Or find a character by name:</label>
                <div className="form__wrapper">
                    <Field type="text" 
                            name='name' 
                            id='name' 
                            className='form__input' 
                            placeholder='Enter name'/>
                    <button type="submit" className="form__btn button button__main">
                            <div className="inner">FIND</div>
                    </button>
                </div>
                <ErrorMessage component="div" className="error" name="name" />
                {success}
                {fail}
            </Form>
        </Formik>
    )
}

export default SearchCharForm;
