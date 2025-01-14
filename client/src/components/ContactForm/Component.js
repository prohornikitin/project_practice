import React, { useState } from 'react';
import s from './style.scss'


export default function ContactForm() {
    const [name, setName] = useState(undefined)
    const [email, setEmail] = useState(undefined)
    const [msg, setMsg] = useState(undefined)

    const successMsg = 'Successfuly sent!'
    const [inputErrors, setInputErrors] = useState([]);
    const [hasBeenSent, setSent] = useState(false)

    const getInputErrors = () => {
        const errors = []
        if(name == undefined) {
            errors.push('Name should not be empty')
        }
        if(email == undefined) {
            errors.push('Email should not be empty')
        }else if(!email.match('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')) {
            errors.push('Wrong Email Format')
        }
        if(msg == undefined) {
            errors.push('Message should not be empty')
        }
        return errors
    }

    const formatErrors = (errors) => {
        return (<ul style={{paddingLeft: '16px'}}>
                {
                    errors.map((err)=>(
                        <li key={err} className={s.error_item}>{err} </li>)
                    )
                }
            </ul>
        )
    }

    const onSubmit = (event) => {
        event.preventDefault()
        const errors = getInputErrors()
        setSent(true)
        if(errors.length != 0) {
            setInputErrors(errors)
            return;
        }
        fetch('./api/contact', {
            method: 'POST',
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify({
                name,
                email,
                msg,
            })
        }).then((response)=>{
            if (response.status == 200) {
                setInputErrors([])
            } else {
                setInputErrors(["Unknown Error. Try another ways."]);
            }
        }).catch(() => {
            setInputErrors(["Unknown Error. Try another ways."]);
        })
    }

    return (
        <div className={s.container}>
            { hasBeenSent && inputErrors.length == 0 ?
                <div className={s.success_msg}> {successMsg} </div>
                : ""
            }
            {
                hasBeenSent && inputErrors.length != 0 ?
                <div className={s.error_msg}> 
                    {formatErrors(inputErrors)}
                </div>
                : ""
            }
            <form href='#'>
                <input type='text' placeholder='Ваше имя' onChange={e =>{setName(e.target.value)}}/>
                <input type='email' placeholder='Email для ответа' onChange={e =>{setEmail(e.target.value)}}/>
                <textarea placeholder='Сообщение' onChange={e =>{setMsg(e.target.value)}}/>
                <input type='submit' value='Отправить' onClick={onSubmit}
                    style={{marginTop: "16px"}}/>
            </form>
        </div>
    )
}
