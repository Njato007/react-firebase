import { addDoc, collection } from "firebase/firestore";
import md5 from "md5";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../firebase-config";
import { ProfileBox } from "./ProfileBox";

export const Adduser = () => {
    const name = useRef();
    const type = useRef();
    const password = useRef();
    const [percent, setPercent] = useState(0);
    const [filePath, setFilePath] = useState('');
    const [fileUrl, setFileUrl] = useState("https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg");
    const navigate = useNavigate();



    // add user
    const addUser = async (e) => {
        e.preventDefault();
        if (password.current.value && name.current.value && type.current.value) {
            const newUser = {
                name: name.current.value,
                type: type.current.value,
                img: {
                    path: filePath,
                    url: fileUrl
                },
                password: md5(password.current.value)
            };

            const usersCollection = collection(db, "users");
            await addDoc(usersCollection, newUser).then(e => {
                console.log("User added successfully");
                return navigate("/users");
            }).catch(e => {
                alert("error");
            });
        }
    }

    const onProfileDataChange = (data) => {
        setFilePath(data.path);
        setFileUrl(data.url);
    }

    return (
        <div className="container pt-4">
            <div className='card text-white bg-secondary mb-3'>
                <div className='card-header'>Add a new user <Link className="btn btn-sm btn-success float-end" to='/users'>List of users</Link></div>
                <div className="card-body">
                    <form className='' onSubmit={addUser}>
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
                                    <button type="submit" className="btn btn-secondary mt-2 ms-1" onClick={() => navigate(-1)}>Back</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
