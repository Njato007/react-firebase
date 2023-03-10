import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import md5 from 'md5';
import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { db } from "./firebase-config"

function App() {

  const [users, setUsers] = useState([]);
  const name = useRef();
  const type = useRef();
  const password = useRef();
  

  useEffect(() => {
    
    const usersCollection = collection(db, "users");
    const getUsers = async () => {
      const data = await getDocs(usersCollection);
      setUsers(data.docs.map(doc => ({...doc.data(), id: doc.id})));
    }
    getUsers();
  }, []);

  // delete user
  const deleteUser = async (userId) => {
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
  // update user
  const updateUser = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "users", userIdDefault);
    const updatedUser = {
      name: updatedName.current.value,
      type: updatedType.current.value,
      password: updatedPassword.current.value
    }
    console.log(updatedUser)
    if (updatedUser.name) {
      // change to old password if its value null
      if (!updatedUser.password) {
        const oldPassword = users.find(user => user.id === userIdDefault).password;
        updatedUser.password = oldPassword;
      } else {
        // md5 password
        updatedUser.password = md5(updatedUser.password);
      }
      // update user in firebase
      await updateDoc(docRef, updatedUser).then(() => {
        console.log("User updated successfully");
        // update users list
        const updatedUsers = users.map(user => user.id === userIdDefault ? 
          {...updatedUser, id: user.id} : user);
        setUsers(updatedUsers);
        // close edit form
        setIsEditFormOpened(false);
      });
    }
  }
  // add user
  const addUser = async (e) => {
    e.preventDefault();
    if (password.current.value && name.current.value && type.current.value) {
      const newUser = {
        name: name.current.value,
        type: type.current.value,
        password: md5(password.current.value)
      };

      const usersCollection = collection(db, "users");
      await addDoc(usersCollection, newUser).then(e => {
        console.log("User added successfully");
        // update list
        setUsers(users => ([...users, {...newUser, id: e.id}]))
        setIsAddFormOpened(false);
      }).catch(e => {
        alert("error");
      });
    }
  }

  // handle open add form
  const [isAddFormOpened, setIsAddFormOpened] = useState(false);

  const AddForm = () => {
    return (
      <form className='p-4' onSubmit={addUser}>
          <h6>Add a new user</h6>
          <div className="form-group">
            <label htmlFor="name" className="form-label mt-1">Name</label>
            <input type="text" className="form-control" placeholder="Name" ref={name} />
          </div>
          <div className="form-group">
            <label htmlFor="exampleSelect1" className="form-label mt-1">Type of user</label>
            <select className="form-select" id="exampleSelect1" ref={type}>
              <option value="customer">Customer</option>
              <option value="administrator">Administrator</option>
              <option value="developer">Developer</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label mt-1">Password</label>
            <input type="password" className="form-control" id="password" placeholder="Password" ref={password} />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary mt-2 me-1">Save user</button>
            <button type="submit" className="btn btn-secondary mt-2 ms-1" onClick={() => setIsAddFormOpened(false)}>Close</button>
          </div>
      </form>
    );
  }
  
  // handle edit add form
  const [isEditFormOpened, setIsEditFormOpened] = useState(false);
  const [userTypeDefault, setUserTypeDefault] = useState("");
  const [userNameDefault, setUserNameDefault] = useState("");
  const [userIdDefault, setUserIdDefault] = useState("");

  const updatedName = useRef();
  const updatedPassword = useRef();
  const updatedType = useRef();

  const openEditForm = (user) => {
    // set default value in edit form
    setUserTypeDefault(user.type);
    setUserNameDefault(user.name);
    setUserIdDefault(user.id);
    // open edit form
    setIsEditFormOpened(true);
  }
  const EditForm = () => {
    return (
      <form className='p-4' onSubmit={updateUser}>
          <h6>Update user</h6>
          <div className="form-group">
            <label htmlFor="name" className="form-label mt-1">Name</label>
            <input type="text" className="form-control" placeholder="New name" ref={updatedName} defaultValue={userNameDefault} />
          </div>
          <div className="form-group">
            <label htmlFor="exampleSelect1" className="form-label mt-1">Type of user</label>
            <select className="form-select" id="exampleSelect1" ref={updatedType} defaultValue={userTypeDefault}>
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
            <button type="submit" className="btn btn-secondary mt-2 ms-1" onClick={() => setIsEditFormOpened(false)}>Cancel</button>
          </div>
      </form>
    );
  }

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
    <div className="App">
      <div className="container pt-4">
        <div className='card text-white bg-secondary mb-3'>
          <div className='card-header'>List of users <button className="btn btn-sm btn-success float-end" onClick={() => setIsAddFormOpened(true)}>Add a new user</button></div>
          {isAddFormOpened && <AddForm />}
          {isEditFormOpened && <EditForm />}
          <div className='card-body'>
            <table className='table table-striped'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Password</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.type}</td>
                    <td>{user.password}</td>
                    <td>
                      <button className='btn btn-info btn-sm mx-1' onClick={() => openEditForm(user)}>EDIT</button>
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
  );
}

export default App;
