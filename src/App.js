import "./App.css";
import { Routes, Route } from "react-router-dom";

import { useState } from "react";

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
import Success from "./pages/Success/Success";
import Cancel from "./pages/Cancel/Cancel";
import EditProductPage from "./pages/EditProductPage/EditProductPage";

import "@stripe/stripe-js";

function App() {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <div className={`App-${theme}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <Routes>
        {/* Home Route */}
        <Route path='/' element={<HomePage theme={theme} />} />

        {/* Signup Route */}
        <Route
          path='/signup'
          element={
            <IsAnon>
              <SignupPage theme={theme} />
            </IsAnon>
          }
        />

        {/* Login Route */}
        <Route
          path='/login'
          element={
            <IsAnon>
              <LoginPage theme={theme} />
            </IsAnon>
          }
        />

        {/* Profile Route */}
        <Route
          path='/user'
          element={
            <IsPrivate>
              <ProfilePage theme={theme} />
            </IsPrivate>
          }
        />

        {/* Edit Profile Route */}
        <Route
          path='/user/edit'
          element={
            <IsPrivate>
              <EditProfile theme={theme} />
            </IsPrivate>
          }
        />

        {/* Product Details Route */}
        <Route
          path='/:productId'
          element={
            <IsPrivate>
              <ProductDetailsPage theme={theme} />
            </IsPrivate>
          }
        />

        {/* Success after purchase Route */}
        <Route
          path='/success'
          element={
            <IsPrivate>
              <Success theme={theme} />
            </IsPrivate>
          }
        />

        {/* Purchase canceled Route */}
        <Route
          path='/cancel'
          element={
            <IsPrivate>
              <Cancel theme={theme} />
            </IsPrivate>
          }
        />

        {/* Upload new Product Route */}
        <Route
          path='/products/new'
          element={
            <IsPrivate>
              <UploadProduct theme={theme} />
            </IsPrivate>
          }
        />

        {/* Edit Product Route */}
        <Route
          path='/:productId/edit'
          element={
            <IsPrivate>
              <EditProductPage theme={theme} />
            </IsPrivate>
          }
        />

        {/* Error Route */}
        <Route path='*' element={<ErrorPage theme={theme} />} />
      </Routes>
    </div>
  );
}

export default App;
