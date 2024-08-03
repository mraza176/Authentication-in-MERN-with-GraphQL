import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFoundPage";

import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/userQuery";

const App = () => {
  const { loading, error, data } = useQuery(GET_AUTHENTICATED_USER);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              data.authUser ? (
                <Home name={data.authUser.name} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/signup"
            element={!data.authUser ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!data.authUser ? <Login /> : <Navigate to="/" />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;
