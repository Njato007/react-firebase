import { Link, Outlet } from 'react-router-dom';
import { Navbar } from '../Navbar';

export const Users = () => {
  return (
    <div>
      <Navbar />
      <Outlet/>
    </div>
  )
}
