import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import RateMovie from "./pages/RateMovie";
import Favourites from "./pages/Favourites";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddMovie from "./pages/AddMovie";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthContext } from "./context/authContext";
import { useContext } from "react";

function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <Router>
      <AppContent currentUser={currentUser} />
    </Router>
  );
}

function AppContent({ currentUser }) {
  const location = useLocation();

  // Hide Header on specific routes
  const hideHeaderRoutes = ["/login", "/register"];
  const shouldRenderHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {shouldRenderHeader && <Header />}
      <main className="main-content">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route
            path="/rate/:id"
            element={
              currentUser ? <RateMovie /> : <Navigate replace to={"/login"} />
            }
          />
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
