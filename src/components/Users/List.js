import { doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db, storage } from '../../firebase-config';

export const List = () => {
  
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  
  useEffect(() => {
    
    const usersCollection = collection(db, "users");
    const getUsers = async () => {
      const data = await getDocs(usersCollection);
      setUsers(data.docs.map(doc => ({...doc.data(), id: doc.id})));
    }
    getUsers();
  }, []);

  const searchKeys = ['name', 'type']
  const search = (data = []) => {
    return data.filter(item => searchKeys.some(key => item[key].toLowerCase().includes(query)));
  }

  // delete user
  const deleteUser = async (userId) => {
    const user = users.find(user => user.id === userId);
    // delete img
    const storageRef = ref(storage, user.img.path);
    await deleteObject(storageRef).then(() => {
      console.log("User's image deleted successfully");
    });
    // delete user
    const docRef = doc(db, "users", userId);
    await deleteDoc(docRef).then(() => {
      console.log("User deleted successfully");
      // erase user from list
      const newUsers = users.filter(user => user.id !== userId);
      setUsers(newUsers);
      // dismiss modal
      setIsModalOpened(false);
    });
  }
  
  // const handleRemoveAll = () => {
  //   users.forEach(async user => {
  //     const docRef = doc(db, "users", user.id);
  //     await deleteDoc(docRef).then(e => {
  //       const newUsers = users.filter(u => u.id !== user.id);
  //       setUsers(newUsers);
  //     });
  //   })
  // }
  // handle open modal
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [modalUserId, setModalUserId] = useState("");
  const [modalUserType, setModalUserType] = useState("");
  // open modal form
  const openModalForm = (userData) => {
    setModalUserId(userData.id);
    setModalUserType(userData.type);
    setIsModalOpened(true);
  }

  const Modal = ({userid, usertype}) => {
    return (
      <div className="modal modal-md fade show">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">User deletion</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setIsModalOpened(false)}>
                <span aria-hidden="true"></span>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure to delete this user of id <code>{userid}</code> of type <strong className='text-danger'>{usertype}</strong>?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => deleteUser(userid) }>Yes, delete</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={e => setIsModalOpened(false)}>No, cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container pt-4">
        <div className='card text-white bg-secondary mb-3'>
          <div className='card-header'>List of users 
          <div className='float-end'>
            {/* <button className="btn btn-sm btn-primary me-2" onClick={handleRemoveAll}>Remove All</button> */}
            <Link className="btn btn-sm btn-success " to='add'>Add a new user</Link>
          </div>
          </div>
          <div className='card-body'>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <input type="search" className='form-control' placeholder='Search users' onChange={e => setQuery(e.target.value.toLowerCase())} />
                </div>
              </div>
            </div>
            <table className='table table-striped table-hover'>
              <thead>
                <tr>
                  <th style={{width: '100px'}}>Photo</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th className='text-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                {search(users).map(user => (
                  <tr key={user.id}>
                    <td className='align-middle'>
                      <img src={user.img.url} className="rounded img-thumbnail" width='40' height='40' alt='img...' />
                    </td>
                    <td className='align-middle'>{user.name}</td>
                    <td className='align-middle'>{user.type}</td>
                    <td className='text-center align-middle'>
                      <Link className='btn btn-info btn-sm mx-1' to={`edit/${user.id}`}>EDIT</Link>
                      <button className='btn btn-danger btn-sm mx-1' onClick={() => openModalForm(user)}>DELETE</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {isModalOpened && <Modal userid={modalUserId} usertype={modalUserType} />}
      </div>
    </div>
  )
}