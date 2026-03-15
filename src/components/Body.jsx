import { Outlet } from "react-router-dom";
import NavBar from "./Navbar";
import Footer from "./footer";

const Body = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
