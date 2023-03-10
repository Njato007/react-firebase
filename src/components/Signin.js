import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../App.css';
import { UserAuth } from "../contexts/AuthContext";

export const Signin = () => {

    const email = useRef();
    const password = useRef();
    const [error, setError] = useState('');
    const { signin } = UserAuth();
    const navigate = useNavigate();

    const loginContentStyles = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px'

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const body = {
            email: email.current.value,
            password: password.current.value,
        }
        try {
            await signin(body.email, body.password);
            return navigate('/');
        } catch (error) {
            setError(error.message);
        }

    }
    return (
        <div className='container'>
            <div style={loginContentStyles}>
                <div className="card py-4 px-2">
                    <h2 className='text-center mb-2 text-muted'>React CRUD Firebase</h2>
                    <form className='p-2' onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input className='form-control mt-1' id="email" type="text" placeholder='Email' ref={email} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input className='form-control mt-1' id="password" type="password" placeholder='Password' ref={password}/>
                        </div>
                        <div className="form-group my-1">
                            <p className="text-primary text-center">{error}</p>
                        </div>
                        <div className="form-group text-center mt-3">
                            <button className='btn btn-info mx-1' type="submit">LOGIN</button>
                            <br />
                            <p className="mt-2">
                                Don't have an account? <Link className='mx-1' to="/signup">Sign up</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}