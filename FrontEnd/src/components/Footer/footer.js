import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useLocation, useParams } from 'react-router-dom';
import logo from '../../images/logo6.png';
import axios from 'axios';

function Footer() {

    // ######################## place details ########################

    const [Places, setPlaces] = useState([]);
    const [detail, setDetails] = useState({});
    const parm = useParams();
    const ID = parm.id;


    useEffect(() => {
                axios.post("http://127.0.0.1:8000/tourism_company_places", { 'id': ID }, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(response => {
                  setPlaces(response.data.places)
                }).catch(error => { console.log(error) })
    }, []);

    useEffect(() => {
      axios.get(`http://127.0.0.1:8000/treatment/${ID}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            setDetails(response.data)
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);
    

  const location = useLocation()
  if (location.pathname === '/signin' || location.pathname === '/signup' ||location.pathname === '/profile' ||location.pathname === '/AddNewDoctor' || location.pathname === '/AddTourismPlaces' || location.pathname === `/Updateplace/${ID}`|| location.pathname === `/updateDoctor/${ID}`) {
    return false
  }
  else {
    return (

          <div className='container-fluid text-white' style={{backgroundColor:"rgb(0,51,78)"}}>
            <div className='row'>
              <div className='col-lg-4 mt-5 text-center'>
                <img style={{width:"15%"}} className='' src={logo} alt='amr' />
                <p className='mt-5'>We see every service we provide as an art and we are determined to make you happy. You can safely entrust yourself to our artist doctors and our distinctive tourist places</p>
              </div>
              <div className='col-lg-4 mt-5 text-center'>
                <h2 className='mb-5' style={{ fontFamily: "Lucida Calligraphy" }}>Links</h2>
                <div>
                  <a className='text-white' href="/"><p>Home</p></a>
                  <a className='text-white'href="/Tourism"><p>Tourism</p></a>
                  <a className='text-white' href="/treatment"><p>Medical</p></a>
                </div>
              </div>
              <div className='col-lg-4 mt-5 text-center'>
                <h2 className='mb-5' style={{ fontFamily: "Lucida Calligraphy" }}>Connect</h2>
                <div>
                  <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"><i className="fab fa-facebook-f"></i></a>
                  <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"><i className="fab fa-twitter"></i></a>
                  <a className="btn btn-outline-light btn-floating m-1" href="finalprojectiti1gmail.com" role="button"><i className="fab fa-google"></i></a>
                  <a className="btn btn-outline-light btn-floating m-1" href="https://z-p15.www.instagram.com/medicaltourism3243/" role="button"><i className="fab fa-instagram"></i></a>
                </div>
                <div className='mt-2'>
                  <p className='me-5'><i class="fa-solid fa-phone me-3"></i>01010932571</p>
                  <p style={{marginLeft:"6%"}}><i class="fa-solid fa-message me-3"></i>finalprojectiti1gmail.com</p>
                  <p style={{marginLeft:"15%"}}><i class="fa-sharp fa-solid fa-location-dot me-3"></i>6-Octobar Al-Mutamayez District</p>
                </div>
              </div>
              <div className='col-lg-12'>
                <hr className='w-75 m-auto mt-3'/>
                <h6 style={{ fontFamily: "Lucida Calligraphy" }} className='text-center my-4'>©2023 Check up Medical Tourism. All rights reserved.</h6>
              </div>
            </div>

          </div>
    
    )
  }

}

export default Footer;



  //     <footer className=" text-center text-white"
      //     style={{ backgroundColor: "#456268" }}>
      //    <div className="container p-4">
      //     <section className="mb-4">
            
      //       <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"><i className="fab fa-facebook-f"></i></a>
      //       <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"><i className="fab fa-twitter"></i></a>
      //       <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"><i className="fab fa-google"></i></a>
      //       <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"><i className="fab fa-instagram"></i></a>
      //       <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"><i className="fab fa-linkedin-in"></i></a>
      //       <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"><i className="fab fa-github"></i></a>
      //     </section>

      //     <section className="">
      //       <form action="">
      //         <div className="row d-flex justify-content-center">
      //           <div className="col-auto">
      //             <p className="pt-2">
      //               <strong>Sign up for our newsletter</strong>
      //             </p>
      //           </div>

      //           <div className="col-md-5 col-12">
      //             <div className="form-outline form-white mb-4">
      //               <input type="email" id="form5Example21" className="form-control" />
      //               <label className="form-label">Email address</label>
      //             </div>
      //           </div>

      //           <div className="col-auto">
      //             <button type="submit" className="btn btn-outline-light mb-4">
      //               Subscribe
      //             </button>
      //           </div>
      //         </div>
      //       </form>
      //     </section>

      //     <section className="mb-4">
      //       <p>
      //       We see every service we provide as an art and we are determined to make you happy. You can safely entrust yourself to our artist doctors and our distinctive tourist places .
      //       </p>
      //     </section>

      //     <section className="">
      //       <div className="row">
      //         <div className="col-lg-12 col-md-12 col-sm-12 mb-4 mb-md-0">
      //           <h5 className="text-uppercase">Links</h5>

      //           <ul className="list-unstyled mb-0">
      //             <li>
      //               <a href="#!" className="text-white">Link 1</a>
      //             </li>
      //             <li>
      //               <a href="#!" className="text-white">Link 2</a>
      //             </li>
      //             <li>
      //               <a href="#!" className="text-white">Link 3</a>
      //             </li>
      //             <li>
      //               <a href="#!" className="text-white">Link 4</a>
      //             </li>
      //           </ul>
      //         </div>
      //       </div>
      //     </section>
      //   </div>
      //   <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}  >
      //     © 2023 Logo
      //   </div> 
      // </footer>