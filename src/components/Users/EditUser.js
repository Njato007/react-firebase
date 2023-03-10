import { doc, getDoc, updateDoc } from 'firebase/firestore';
import md5 from 'md5';
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase-config';
import { ProfileBox } from './ProfileBox';

export const EditUser = () => {
  
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [filePath, setFilePath] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const updatedName = useRef();
  const updatedPassword = useRef();
  const updatedType = useRef();
  const params = useParams();

  useEffect(() => {
    const getUser = async () => {
      const docRef = doc(db, "users", params.userId);
      const docData = await getDoc(docRef);
      const userData = docData.data();
      // if user is found
      if (userData) {
        setUser(userData);
        setFilePath(userData.img.path);
        setFileUrl(userData.img.url);
      } else {
        // redirect back
        navigate(-1);
      }
    }
    getUser();
  }, []);

  // update user
  const updateUser = async (e) => {
    e.preventDefault();
    
    const docRef = doc(db, "users", params.userId);
    const updatedUser = {
      name: updatedName.current.value,
      type: updatedType.current.value,
      password: updatedPassword.current.value,
      img: {
        url: fileUrl,
        path: filePath
      }
    }
    
    if (updatedUser.name) {
      // change to old password if its value null
      if (!updatedUser.password) {
        const oldPassword = user.password;
        updatedUser.password = oldPassword;
      } else {
        // md5 password
        updatedUser.password = md5(updatedUser.password);
      }
      // update user in firebase
      await updateDoc(docRef, updatedUser).then(() => {
        console.log("User updated successfully");
        return navigate(-1);
      });
    }
  }
  
  const onProfileDataChange = (data) => {
    setFilePath(data.path);
    setFileUrl(data.url);
  }

  return (
    <div className="container pt-4">
      {user && 
        <div className='card text-white bg-secondary mb-3'>
            <div className='card-header'>Update an user <Link className="btn btn-sm btn-success float-end" to='/users'>List of users</Link></div>
            <div className="card-body">
              <form onSubmit={updateUser}>
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="form-group">
                          <label htmlFor="Image">Photo</label>
                          <ProfileBox onDataChange={onProfileDataChange} imgUrl={fileUrl} />
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label mt-1">Name</label>
                        <input type="text" className="form-control" placeholder="New name" ref={updatedName} defaultValue={user.name} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleSelect1" className="form-label mt-1">Type of user</label>
                        <select className="form-select" id="exampleSelect1" ref={updatedType} defaultValue={user.type}>
                          <option value="customer">Customer</option>
                          <option value="administrator">Administrator</option>
                          <option value="developer">Developer</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="password" className="form-label mt-1">New password</label>
                        <input type="password" className="form-control" id="password" ref={updatedPassword} placeholder="Password" />
                      </div>
                      <div className="form-group">
                        <button type="submit" className="btn btn-success mt-2 me-1">Save change</button>
                        <button type="button" className="btn btn-secondary mt-2 ms-1" onClick={() => navigate(-1)}>Cancel</button>
                      </div>
                    </div>
                  </div>
              </form>
            </div>
        </div> }
    </div> 
  )
}
