import React, { Fragment, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import { Dialog, Transition } from "@headlessui/react";
import { CameraIcon } from "@heroicons/react/24/outline";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import {
  getDownloadURL,
  ref,
  uploadString,
  uploadBytesResumable,
} from "firebase/storage";

const Modal = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const filePickerRef = useRef(null);
  const captionRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const uploadPost = async () => {
    if (loading) return;

    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      username: session.user.username,
      caption: captionRef.current.value,
      profileImg: session.user.image,
      timeStamp: serverTimestamp(),
    });

    console.log("now doc added with ID", docRef.id);

    const imageRef = ref(storage, `posts/${docRef.id}/image`);
    console.log(imageRef);
    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        console.log("uploadString");
        const downloadURL = await getDownloadURL(imageRef);
        console.log(downloadURL);

        // const poporef = doc(db, "posts", docRef.id);
        updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
        console.log("updatedDoc");
      }
    );
    console.log("complete");
    setOpen(false);
    setLoading(false);
    setSelectedFile(null);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);

      reader.onload = (readerEvent) => {
        setSelectedFile(readerEvent.target.result);
      };
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        id='modal1'
        onClick={(e) => {
          if (e.target.id === "modal1") setOpen(false);
        }}
        className='fixed inset-0 bg-black bg-opacity-70 backdrop:blur-sm flex items-center justify-center'
      >
        <div className='bg-white p-5 h-96 w-96 flex flex-col justify-center rounded-xl'>
          <div className=' flex flex-col justify-center items-center  align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:align-middle sm:max-w-sm sm:w-full'>
            {selectedFile ? (
              <img className=' h-64 w-96 ' src={selectedFile} alt='' />
            ) : (
              <>
                <div
                  onClick={() => filePickerRef.current.click()}
                  className=' bg-red-100 h-20 w-20 flex justify-center items-center rounded-full hover:cursor-pointer'
                >
                  <CameraIcon
                    className=' h-10 w-10 text-red-600'
                    aria-hidden='true'
                  />
                </div>
                <h1 className=' font-bold py-5'>Upload a photo</h1>
              </>
            )}
            <div>
              <input
                ref={filePickerRef}
                type='file'
                hidden
                onChange={addImageToPost}
              ></input>
            </div>
          </div>
          <input
            ref={captionRef}
            className='border-none focus:ring-0 w-full text-center'
            placeholder='Please enter a caption...'
            type='text'
          />
          <div className=' mt-5 sm:mt-6'>
            <button
              disabled={!selectedFile}
              onClick={uploadPost}
              className=' inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300'
              type='button'
            >
              {loading ? "Uploading..." : "Upload Post"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
