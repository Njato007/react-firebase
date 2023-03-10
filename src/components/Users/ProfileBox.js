import React from 'react'
import { useRef, useState } from "react";
import { storage } from "../../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import { v4 } from "uuid";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faSpinner } from '@fortawesome/free-solid-svg-icons';

export const ProfileBox = ({onDataChange, onProgress, imgUrl}) => {

    const fileRef = useRef();
    const [isProgressing, setIsProgressing] = useState(false);
    
    const handleOnUploadFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const storageRef = ref(storage, `users/${v4()}${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        uploadTask.on('state_changed', (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            setIsProgressing(progress !== null && progress < 100);
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                break;
                case 'running':
                    console.log('Upload is running');
                break;
            }
        }, (error) => {
            // Handle unsuccessful uploads
            console.log(error)
        }, () => {
                // Handle successful uploads on complete
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    onDataChange({
                        url: downloadURL,
                        path: uploadTask.snapshot.ref.fullPath
                    });
                });
            }
        );
    }

    return (
        <div className='d-flex align-items-center justify-content-center flex-column pt-2'>
            <img src={imgUrl} style={{height: '200px', width: '200px'}} alt="" className="border border-3 border-light rounded-circle" />
            <button type='button' className="btn btn-secondary my-2" onClick={e => fileRef.current.click()}>
                { !isProgressing && <span><FontAwesomeIcon icon={faCamera} size='lg'/> Change</span>}
                { isProgressing && <span><FontAwesomeIcon icon={faSpinner} size='lg' className='spinner-sm border-0'/> Uploading</span>}
                
            </button>
            <input className="form-control" hidden type="file" id="formFile" accept="image/*" onChange={handleOnUploadFile} ref={fileRef} />
        </div>
    )
}
