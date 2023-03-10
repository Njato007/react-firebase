import React from 'react'
import '../App.css';
import { UserAuth } from '../contexts/AuthContext';
import { Navbar } from './Navbar';

export const Home = () => {
  const {user} = UserAuth();
  return (
    <div>
        <Navbar active="home" />
        <div className='container'>
          <h2 className='text-center mt-4'>Home</h2>
        </div>
    </div>
  )
}
