import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../App.css';
import { UserAuth } from '../contexts/AuthContext';

export const Navbar = () => {

    const { user, signout } = UserAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signout();
            return navigate('/signin');
        } catch (error) {
            alert(error.message)
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">React CRUD Firebase</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/users">List of users</NavLink>
                        </li>
                    </ul>
                    <form className="d-flex">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <a className="nav-link" href='#'><b>User:</b> { user && user.email }</a>
                            </li>
                        </ul>
                        <button className="btn btn-secondary my-2 my-sm-0" type="">
                            <Link to="/logout" className='text-decoration-none' onClick={handleLogout}>Logout</Link>
                        </button>
                    </form>
                </div>
            </div>
        </nav>
  )
}
