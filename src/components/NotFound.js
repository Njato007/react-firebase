import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { Navbar } from './Navbar';

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div>
        <Navbar />
        <div className="container">
            <div className="card mt-4 p-4 text-center">
                <h3>404</h3>
                <p>Page not found</p>
                <button className="btn btn-primary" onClick={e => navigate(-1)}>Go Back</button>
            </div>
        </div>
    </div>
  )
}
