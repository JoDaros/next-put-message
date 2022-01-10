import PutMessage from "../components/PutMessage";
import {Fragment} from "react";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

export default function Home() {
  return (
    <Fragment>
      <Navbar />
      <main className="container">
        <div className="my-3 p-3 bg-body rounded shadow-sm">
          <PutMessage />
        </div>
        <Footer />
      </main>
    </Fragment>
  );
}
