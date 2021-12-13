import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import fileService from "../../services/file.service";

const API_URL = "http://localhost:5005";

const EditProfile = () => {
  const [username, setUsername] = useState("");
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/api/user`, { headers: { Authorization: `Bearer ${authToken}` } });

      setUsername(response.data.username);
    };
    fetchData();
  }, []);

  const handleUsername = async (e) => setUsername(e.target.value);

  const handleFileUpload = async (e) => {
    try {
      const uploadData = new FormData();

      uploadData.append("profilePictureURL", e.target.files[0]); // <-- Set the file in the form

      const response = await fileService.uploadImage(uploadData);
      setProfilePictureURL(response.data.secure_url);
    } catch (error) {
      setErrorMessage("Failed to upload the file");
    }
  };

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      // Create an object representing the request body
      const requestBody = { username, profilePictureURL };

      const authToken = localStorage.getItem("authToken");
      await axios.put(`${API_URL}/api/user`, requestBody, { headers: { Authorization: `Bearer ${authToken}` } });

      // If the request is successful navigate to login page
      navigate("/user");
    } catch (error) {
      // If the request resolves with an error, set the error message in the state
      setErrorMessage("Something went wrong");
    }
  };

  const deleteAccount = async () => {
    // try {
    //   const response = await authService.delete(user);
    //   console.log(response);
    // } catch (error) {
    //   setErrorMessage("Something went wrong!");
    // }
  };

  return (
    <div className='EditProfile'>
      <h1>Edit Profile</h1>

      <form onSubmit={handleFormSubmit}>
        <label>Username:</label>
        <input type='text' name='username' value={username} onChange={handleUsername} />

        <label>Profile Picture:</label>
        <input type='file' name='imageURL' onChange={handleFileUpload} />

        <button type='submit'>Submit Changes</button>
      </form>

      <button type='submit' onSubmit={deleteAccount}>
        Delete Account
      </button>

      {errorMessage && <p className='error-message'>{errorMessage}</p>}
    </div>
  );
};

export default EditProfile;
