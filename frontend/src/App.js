import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { AuthContext } from "./context/authContext";
import { useContext } from "react";
import Header from "./components/Header/Header";
import AddMovie from "./pages/AddMovie/AddMovie";
import Favourites from "./pages/Favourites/Favourites";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import RateMovie from "./pages/RateMovie/RateMovie";

function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <Router>
      <AppContent currentUser={currentUser} />
    </Router>
  );
}

function AppContent({ currentUser }) {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/rate/:id" element={<RateMovie />} />
          <Route
            exact
            path="/add"
            element={
              currentUser && currentUser.role === "admin" ? (
                <AddMovie />
              ) : (
                <Navigate replace to={"/login"} />
              )
            }
          />
          <Route
            exact
            path="/favourites"
            element={
              currentUser ? <Favourites /> : <Navigate replace to={"/login"} />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
