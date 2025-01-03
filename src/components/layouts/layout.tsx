import { AppRoutes } from "../../routes/approutes"
import Footer from "../ui/footer"
import Navbar from "../ui/navbar"

function Layout() {

    return (
      <main className="">
        <Navbar></Navbar>
        <AppRoutes></AppRoutes>
        {/* <Footer></Footer> */}
      </main>
    )
  }
  
  export default Layout;
  