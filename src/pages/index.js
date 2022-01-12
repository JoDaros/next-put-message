import PutMessage from "../components/PutMessage";
import {Fragment} from "react";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Head from 'next/head'

export default function Home() {
  return (
    <Fragment>
        <Head>
            <title>Next-PutMessage</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
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
