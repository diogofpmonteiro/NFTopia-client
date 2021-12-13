import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";

import IsPrivate from "./components/IsPrivate/IsPrivate";
import IsAnon from "./components/IsAnon/IsAnon";

import EditProfile from "./pages/EditProfilePage/EditProfile";
import UploadProduct from "./pages/UploadProduct/UploadProduct";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ProductDetailsPage from "./pages/ProductDetailsPage/ProductDetailsPage";

import { ThemeContext } from "./context/theme.context";
import { useContext } from "react";

function App() {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`App-${theme}`}>
      <Navbar />

      <Routes>
        {/* Home Route */}
        <Route path='/' element={<HomePage />} />

        {/* Signup Route */}
        <Route
          path='/signup'
          element={
            <IsAnon>
              <SignupPage />
            </IsAnon>
          }
        />

        {/* Login Route */}
        <Route
          path='/login'
          element={
            <IsAnon>
              <LoginPage />
            </IsAnon>
          }
        />

        {/* Profile Route */}
        <Route
          path='/user'
          element={
            <IsPrivate>
              <ProfilePage />
            </IsPrivate>
          }
        />

        {/* Edit Profile Route */}
        <Route
          path='/user/edit'
          element={
            <IsPrivate>
              <EditProfile />
            </IsPrivate>
          }
        />

        {/* Product Details Route */}
        <Route
          path='/:productId'
          element={
            <IsPrivate>
              <ProductDetailsPage />
            </IsPrivate>
          }
        />

        {/* Upload new Product Route */}
        <Route
          path='/products/new'
          element={
            <IsPrivate>
              <UploadProduct />
            </IsPrivate>
          }
        />

        {/* Error Route */}
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
