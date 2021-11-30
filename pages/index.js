import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import SignInForm from '../components/SignInForm';
import {auth, db} from '../firebaseApp';
import { getAuth } from "firebase/auth";
import {getDocs, query, where, collection} from "firebase/firestore";
import ReportedIssuesView from '../components/ReportedIssuesView';
import 'bootstrap-icons/font/bootstrap-icons.css';


export default function Home() {

  const [isLoading, setIsLoading] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [user, setUser] = useState(null);
  const [adminLoginError, setAdminLoginError] = useState(null);

  useEffect(() => {

    async function checkIfAdminUser(){

      if(!user || !user.uid){
        console.log("user is null");
        return;
      }

      const adminUsersRef = collection(db, "admin_users");

      const q = query(adminUsersRef, where("uid", "==", user.uid));

      try {
        const querySnapshot = await getDocs(q);
      
        if(!querySnapshot.empty){

          if(querySnapshot.size == 1){
            console.log("admin account found");
            setAdminLoginError(null);
            setAdminUser(user);
          } else if(querySnapshot.size < 1) {
            console.log("No matching admin user docs found");
            setAdminUser(null);
            setAdminLoginError("Admin account does not exist.");
          } else {
            console.log("there is an error somewhere. Expected one admin user doc but got: ", querySnapshot.size);
            setAdminUser(null);
            setAdminLoginError("Unexpected error");
          }
        } else {
          console.log("Admin user doc query was empty");
          setAdminUser(null);
          setAdminLoginError("Admin account does not exist.");
        }
      } catch (error) {
        console.log("error checking if admin user");
        setAdminUser(null);
      }
    }

    checkIfAdminUser();

  }, [user]);



  useEffect(() => {
    
    const unsubscribeAuth = auth.onAuthStateChanged(curUser => {

      setUser(curUser);

      if(curUser){
        console.log("user logged in!");
      } else {
        console.log("user is not logged in");
      }

    });

    return unsubscribeAuth;

  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>KnightLoo Admin Portal</title>
        <meta name="description" content="KnightLoo Admin Portal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="vh-100 d-flex justify-content-center align-items-center">
        {adminUser ? (<ReportedIssuesView />):
        <SignInForm setIsLoading={setIsLoading} setAdminLoginError={setAdminLoginError} adminLoginError={adminLoginError}/>
        }
        
      </main>


      <footer className={styles.footer}>
        {/* <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a> */}
      </footer>
    </div>
  )

  // return (
  //   <div className={styles.container}>
  //     <Head>
  //       <title>Create Next App</title>
  //       <meta name="description" content="Generated by create next app" />
  //       <link rel="icon" href="/favicon.ico" />
  //     </Head>

  //     {/* <main className={styles.main}> */}
  //     <main className="vh-100 d-flex justify-content-center align-items-center">

  //       {/* <div className="d-flex-1">
        
        
  //       <h2>
  //         KnightLoo Admin
  //       </h2> */}

  //     {/* <section className="w-100 d-flex-1 px-4 py-5 align-items-stretch"> */}
  //       <div className="row d-flex justify-content-center">
  //         <div className="col col-12">
  //         <div className="card shadow-2-strong">
  //           <div className="card-body p-5 text-center">
  //             <div className="">
  //                 <h3 className="mb-5">Sign in</h3>

  //                 <div className="form-outline mb-4">
  //                   <input type="email" id="typeEmailX-2" placeholder="Email" className="form-control form-control-lg" />
  //                   {/* <label className="form-label ml-0" placeholder="Email" htmlFor="typeEmailX-2">Email</label> */}
  //                   {/* <div className="form-notch">
  //                     <div className="form-notch-leading" style={{width: '9px'}}></div>
  //                     <div className="form-notch-middle" style={{width: '40px'}}></div>
  //                     <div className="form-notch-trailing"></div>
  //                   </div> */}
  //                 </div>

  //                 <div className="form-outline mb-4">
  //                   <input type="password" id="typePasswordX-2" placeholder="Password"  className="form-control form-control-lg" />
  //                   {/* <label className="form-label ml-0" htmlFor="typePasswordX-2">Password</label> */}
  //                   {/* <div className="form-notch">
  //                     <div className="form-notch-leading" style={{width: '9px'}}></div>
  //                     <div className="form-notch-middle" style={{width: '64px'}}></div>
  //                       <div className="form-notch-trailing"></div>
  //                   </div> */}
  //                 </div>

  //                 <button className="btn btn-primary btn-lg btn-block login-btn" type="submit">Login</button>
  //           </div>
  //         </div>
  //         </div>
  //         </div>
  //       </div>
        
  //       {/* </div> */}
  //     {/* </section> */}


  //     </main>


  //     <footer className={styles.footer}>
  //       {/* <a
  //         href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Powered by{' '}
  //         <span className={styles.logo}>
  //           <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
  //         </span>
  //       </a> */}
  //     </footer>
  //   </div>
  // )
}
