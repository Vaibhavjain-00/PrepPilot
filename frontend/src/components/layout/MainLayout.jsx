import { Outlet } from "react-router-dom";
import Header from "../Header";

function MainLayout() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;