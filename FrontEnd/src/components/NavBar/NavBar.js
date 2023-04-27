import React, { useEffect, useState, useRef } from 'react';
import './NavBar.css';
import 'animate.css';
import { Link, useLocation, useParams } from 'react-router-dom';
import logo from '../../images/logo6.png';
import { useDispatch, useSelector } from "react-redux"
import { changeLanguage } from "../../Store/Actions/LangAction"
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { Button } from 'react-bootstrap';
import axios from 'axios';



function NavBar({ realData, logOut }) {


  // ######################## place details ########################

  const [Places, setPlaces] = useState([]);


  useEffect(() => {
              axios.post("http://127.0.0.1:8000/tourism_company_places", { 'id': ID }, {
                  headers: {
                      'Content-Type': 'multipart/form-data'
                  }
              }).then(response => {
                setPlaces(response.data.places)
              }).catch(error => { console.log(error) })
  }, []);

  // ######################## bookplace ########################

  const [detail, setDetails] = useState({});
  const parm = useParams();
  const ID = parm.id;

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api_tourism_places/${ID}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setDetails(response.data);

      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // ######################## list of doctors ########################
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

  // ######################## doctors Details ########################

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/doctor/${ID}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setDetails(response.data)
      })
      .catch(error => {
        console.log(error)
      });

  }, []);

  const myLang = useSelector((state) => state.Rlang.lang)
  const [navbar, setNavbar] = useState(false)
  const [lang, setlang] = useState(myLang)
  const navigate = useNavigate(); // create navigate function





  const navigate_pages = () => {
    const GetUserData = jwtDecode(localStorage.getItem('token'));
    if (GetUserData) {
      if (GetUserData.role === "Treatment Center") {
        navigate("/TreatmentCenter");
      } else if (GetUserData.role === "Patient" || GetUserData.role === "Tourist") {
        navigate("/profile")

      } else {
        navigate("/tourismCompany");

      }
    }


  }
  // ####################### navbar scroll function #######################

  const changeBackground = () => {
    if (window.scrollY > 200) {
      setNavbar(true)
    } else {
      setNavbar(false)
    }
  }
  //  ###################### adding the event when scroll ######################

  useEffect(() => {
    window.addEventListener("scroll", changeBackground)

  }, [navbar])
  const dispatch = useDispatch()
  const handlelang = (e) => {
    setlang(e.target.value)
  }
  useEffect(() => {
    dispatch(changeLanguage(lang))
  }, [lang])

  //  ###################### change navbar ######################


  const location = useLocation()
  if (location.pathname === "/") {
    return (
      <nav style={{ backgroundColor: navbar ? '#72d5cae1' : 'transparent', transition: navbar ? '0.7s' : '0.3' , color: navbar ? 'white' : 'white'}} className="navbar navbar-expand-lg fixed-top">  <div className="container-fluid">
        <Link className="navbar-brand  animate__animated animate__bounce ms-5 text-start" style={{ width: "45%" }} to="/">
          <span className="fw-bold fs-4" style={{ color: navbar ? 'white' : 'rgb(0, 51, 78)',}}><img src={logo} className="me-4 " alt="david" style={{ width: "10%" }} />Medical Tourism</span></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"> </span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mt-3 d-flex justify-content-end" style={{ width: "40vw"}}>
            {localStorage.getItem("token") &&<>
            {(jwtDecode(localStorage.getItem('token')).role === "Patient" || jwtDecode(localStorage.getItem('token')).role === "Tourist") &&
            <>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/Tourism" style={{ color: navbar ? 'white' : 'rgb(0, 51, 78)',}}>Tourism </Link></li>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/treatment" style={{ color: navbar ? 'white' : 'rgb(0, 51, 78)',}}>Medical</Link></li>
            </>}
            </>}
            {/* <li className="nav-item dropdown fs-4 fw-bold" >
              <select className="form-select" value={lang} onChange={(e) => handlelang(e)}>
                <option value="EN">EN</option>
                <option value="AR">AR</option>
              </select>
            </li> */}
            {realData ? <> <li className="nav-item fs-4 fw-bold">
              <Link className="nav-link active fs-4" aria-current="page" to="/signin" onClick={logOut} style={{ color: navbar ? 'white' : 'rgb(0, 51, 78)',}}>LogOut</Link>
            </li>             <li className="nav-item fs-4 fw-bold">
                <Button className="navbar-brand  animate__animated animate__bounce ms-5 text-start" style={{ width: "45%", background: "transparent", color: "white", border: "none" }} onClick={(e) => navigate_pages(e)}>
                  <span className="fw-bold fs-4 " style={{ color: navbar ? 'white' : 'rgb(0, 51, 78)',}}><i class="fa-solid fa-user me-3"></i> Welcome {realData.first_name}</span></Button>
              </li></> : <>
              <li className="nav-item fs-4 fw-bold"  >
                <Link className="nav-link active fs-5 " aria-current="page" to="/signin" style={{ color: navbar ? 'white' : 'rgb(0, 51, 78)',}}>SignIn</Link>
              </li>
              <li className="nav-item fs-4 fw-bold">
                <Link className="nav-link active fs-5" aria-current="page" to="/signup" style={{ color: navbar ? 'white' : 'rgb(0, 51, 78)',}}>SignUp</Link>
              </li>
            </>}
          </ul>
        </div>
      </div>
      </nav>
    );
  }
  else if (location.pathname === '/Tourism' || location.pathname === `/place_detail/${ID}`){
    return (
      <nav style={{ backgroundColor: navbar ? 'rgb(180 220 239)' : 'transparent', transition: navbar ? '0.7s' : '0.3' , color: navbar ? 'white' : 'white'}} className="navbar navbar-expand-lg fixed-top">  <div className="container-fluid">
        <Link className="navbar-brand  animate__animated animate__bounce ms-5 text-start" style={{ width: "45%" }} to="/">
          <span className="fw-bold fs-4" style={{ color: navbar ? 'white' : 'white',}}><img src={logo} className="me-4 " alt="david" style={{ width: "10%" }} />Medical Tourism</span></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"> </span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mt-3 d-flex justify-content-around" style={{ width: "40vw"}}>
            {localStorage.getItem("token") &&<>
            {(jwtDecode(localStorage.getItem('token')).role === "Patient" || jwtDecode(localStorage.getItem('token')).role === "Tourist") &&
            <>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/Tourism" style={{ color: navbar ? 'white' : 'white',}}>Tourism </Link></li>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/treatment" style={{ color: navbar ? 'white' : 'white',}}>Medical</Link></li>
            </>}
            </>}
            {/* <li className="nav-item dropdown fs-4 fw-bold" >
              <select className="form-select" value={lang} onChange={(e) => handlelang(e)}>
                <option value="EN">EN</option>
                <option value="AR">AR</option>
              </select>
            </li> */}
            {realData ? <> <li className="nav-item fs-4 fw-bold">
              <Link className="nav-link active fs-4" aria-current="page" to="/signin" onClick={logOut} style={{ color: navbar ? 'white' : 'white',}}>LogOut</Link>
            </li>             <li className="nav-item fs-4 fw-bold">
                <Button className="navbar-brand  animate__animated animate__bounce ms-5 text-start" style={{ width: "45%", background: "transparent", color: "white", border: "none" }} onClick={(e) => navigate_pages(e)}>
                  <span className="fw-bold fs-4 " style={{ color: navbar ? 'white' : 'white',}}><i class="fa-solid fa-user me-3"></i> Welcome {realData.first_name}</span></Button>
              </li></> : <>
              <li className="nav-item fs-4 fw-bold"  >
                <Link className="nav-link active fs-5 " aria-current="page" to="/signin" style={{ color: navbar ? 'white' : 'white',}}>SignIn</Link>
              </li>
              <li className="nav-item fs-4 fw-bold">
                <Link className="nav-link active fs-5" aria-current="page" to="/signup" style={{ color: navbar ? 'white' : 'white',}}>SignUp</Link>
              </li>
            </>}
          </ul>
        </div>
      </div>
      </nav>
    );

  }
  else if (location.pathname === `/bookplace/${ID}`){
    return (
      <nav style={{ backgroundColor: navbar ? 'rgb(180 220 239)' : 'rgb(180 220 239)', transition: navbar ? '0.7s' : '0.3' , color: navbar ? 'white' : 'white'}} className="navbar navbar-expand-lg fixed-top">  <div className="container-fluid">
        <Link className="navbar-brand  animate__animated animate__bounce ms-5 text-start" style={{ width: "45%" }} to="/">
          <span className="fw-bold fs-4" style={{ color: navbar ? 'white' : 'white',}}><img src={logo} className="me-4 " alt="david" style={{ width: "10%" }} />Medical Tourism</span></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"> </span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mt-3 d-flex justify-content-around" style={{ width: "40vw"}}>
            {localStorage.getItem("token") &&<>
            {(jwtDecode(localStorage.getItem('token')).role === "Patient" || jwtDecode(localStorage.getItem('token')).role === "Tourist") &&
            <>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/Tourism" style={{ color: navbar ? 'white' : 'white',}}>Tourism </Link></li>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/treatment" style={{ color: navbar ? 'white' : 'white',}}>Medical</Link></li>
            </>}
            </>}
            {/* <li className="nav-item dropdown fs-4 fw-bold" >
              <select className="form-select" value={lang} onChange={(e) => handlelang(e)}>
                <option value="EN">EN</option>
                <option value="AR">AR</option>
              </select>
            </li> */}
            {realData ? <> <li className="nav-item fs-4 fw-bold">
              <Link className="nav-link active fs-4" aria-current="page" to="/signin" onClick={logOut} style={{ color: navbar ? 'white' : 'white',}}>LogOut</Link>
            </li>             <li className="nav-item fs-4 fw-bold">
                <Button className="navbar-brand  animate__animated animate__bounce ms-5 text-start" style={{ width: "45%", background: "transparent", color: "white", border: "none" }} onClick={(e) => navigate_pages(e)}>
                  <span className="fw-bold fs-4 " style={{ color: navbar ? 'white' : 'white',}}><i class="fa-solid fa-user me-3"></i>Welcome {realData.first_name}</span></Button>
              </li></> : <>
              <li className="nav-item fs-4 fw-bold"  >
                <Link className="nav-link active fs-5 " aria-current="page" to="/signin" style={{ color: navbar ? 'white' : 'white',}}>SignIn</Link>
              </li>
              <li className="nav-item fs-4 fw-bold">
                <Link className="nav-link active fs-5" aria-current="page" to="/signup" style={{ color: navbar ? 'white' : 'white',}}>SignUp</Link>
              </li>
            </>}
          </ul>
        </div>
      </div>
      </nav>
    );

  }
  else if (location.pathname === '/treatment'){
    return (
      <nav style={{ backgroundColor: navbar ? '#72d5cae3' : 'transparent', transition: navbar ? '0.7s' : '0.3' , color: navbar ? 'white' : 'white'}} className="navbar navbar-expand-lg fixed-top">  <div className="container-fluid">
        <Link className="navbar-brand  animate__animated animate__bounce ms-5 text-start" style={{ width: "45%" }} to="/">
          <span className="fw-bold fs-4" style={{ color: navbar ? 'white' : 'white',}}><img src={logo} className="me-4 " alt="david" style={{ width: "10%" }} />Medical Tourism</span></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"> </span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mt-3 d-flex justify-content-around" style={{ width: "40vw"}}>
            {localStorage.getItem("token") &&<>
            {(jwtDecode(localStorage.getItem('token')).role === "Patient" || jwtDecode(localStorage.getItem('token')).role === "Tourist") &&
            <>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/Tourism" style={{ color: navbar ? 'white' : 'white',}}>Tourism </Link></li>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/treatment" style={{ color: navbar ? 'white' : 'white',}}>Medical</Link></li>
            </>}
            </>}
            {/* <li className="nav-item dropdown fs-4 fw-bold" >
              <select className="form-select" value={lang} onChange={(e) => handlelang(e)}>
                <option value="EN">EN</option>
                <option value="AR">AR</option>
              </select>
            </li> */}
            {realData ? <> <li className="nav-item fs-4 fw-bold">
              <Link className="nav-link active fs-4" aria-current="page" to="/signin" onClick={logOut} style={{ color: navbar ? 'white' : 'white',}}>LogOut</Link>
            </li>             <li className="nav-item fs-4 fw-bold">
                <Button className="navbar-brand  animate__animated animate__bounce ms-5 text-start" style={{ width: "45%", background: "transparent", color: "white", border: "none" }} onClick={(e) => navigate_pages(e)}>
                  <span className="fw-bold fs-4 " style={{ color: navbar ? 'white' : 'white',}}><i class="fa-solid fa-user me-3"></i>Welcome {realData.first_name}</span></Button>
              </li></> : <>
              <li className="nav-item fs-4 fw-bold"  >
                <Link className="nav-link active fs-5 " aria-current="page" to="/signin" style={{ color: navbar ? 'white' : 'white',}}>SignIn</Link>
              </li>
              <li className="nav-item fs-4 fw-bold">
                <Link className="nav-link active fs-5" aria-current="page" to="/signup" style={{ color: navbar ? 'white' : 'white',}}>SignUp</Link>
              </li>
            </>}
          </ul>
        </div>
      </div>
      </nav>
    );

  }
  else if (location.pathname === `/detail/${ID}`){
    return (
      <nav style={{ backgroundColor: navbar ? 'rgba(174, 224, 219, 0.89)' : 'transparent', transition: navbar ? '0.7s' : '0.3'}} className="navbar navbar-expand-lg fixed-top">  <div className="container-fluid">
        <Link className="navbar-brand  animate__animated animate__bounce ms-5 text-start" style={{ width: "45%" }} to="/">
          <span className="fw-bold fs-4" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}><img src={logo} className="me-4 " alt="david" style={{ width: "10%" }} />Medical Tourism</span></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"> </span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mt-3 d-flex justify-content-around" style={{ width: "40vw"}}>
            {localStorage.getItem("token") &&<>
            {(jwtDecode(localStorage.getItem('token')).role === "Patient" || jwtDecode(localStorage.getItem('token')).role === "Tourist") &&
            <>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/Tourism" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>Tourism</Link></li>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/treatment" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>Medical</Link></li>
            </>}
            </>}
            {/* <li className="nav-item dropdown fs-4 fw-bold" >
              <select className="form-select" value={lang} onChange={(e) => handlelang(e)}>
                <option value="EN">EN</option>
                <option value="AR">AR</option>
              </select>
            </li> */}
            {realData ? <> <li className="nav-item fs-4 fw-bold">
              <Link className="nav-link active fs-4 " aria-current="page" to="/signin" onClick={logOut} style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>LogOut</Link>
            </li>             <li className="nav-item fs-4 fw-bold">
                <Button className="navbar-brand  animate__animated animate__bounce ms-5 text-start" style={{ width: "45%", background: "transparent", color: "rgb(46, 79, 122)", border: "none" }} onClick={(e) => navigate_pages(e)}>
                  <span className="fw-bold fs-4 " style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}><i class="fa-solid fa-user me-3"></i>Welcome {realData.first_name}</span></Button>
              </li></> : <>
              <li className="nav-item fs-4 fw-bold"  >
                <Link className="nav-link active fs-5 " aria-current="page" to="/signin" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>SignIn</Link>
              </li>
              <li className="nav-item fs-4 fw-bold">
                <Link className="nav-link active fs-5" aria-current="page" to="/signup" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>SignUp</Link>
              </li>
            </>}
          </ul>
        </div>
      </div>
      </nav>
    );

  }
  else if (location.pathname === `/doctorDetail/${ID}`){
    return (
      <nav style={{ backgroundColor: navbar ? 'rgba(174, 224, 219, 0.89)' : 'rgba(174, 224, 219, 0.89)', transition: navbar ? '0.7s' : '0.3'}} className="navbar navbar-expand-lg fixed-top">  <div className="container-fluid">
        <Link className="navbar-brand  animate__animated animate__bounce ms-5 text-start" style={{ width: "45%" }} to="/">
          <span className="fw-bold fs-4" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}><img src={logo} className="me-4 " alt="david" style={{ width: "10%" }} />Medical Tourism</span></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"> </span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mt-3 d-flex justify-content-around" style={{ width: "40vw"}}>
            {localStorage.getItem("token") &&<>
            {(jwtDecode(localStorage.getItem('token')).role === "Patient" || jwtDecode(localStorage.getItem('token')).role === "Tourist") &&
            <>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/Tourism" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>Tourism</Link></li>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/treatment" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>Medical</Link></li>
            </>}
            </>}
            {/* <li className="nav-item dropdown fs-4 fw-bold" >
              <select className="form-select" value={lang} onChange={(e) => handlelang(e)}>
                <option value="EN">EN</option>
                <option value="AR">AR</option>
              </select>
            </li> */}
            {realData ? <> <li className="nav-item fs-4 fw-bold">
              <Link className="nav-link active fs-4 " aria-current="page" to="/signin" onClick={logOut} style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>LogOut</Link>
            </li>             <li className="nav-item fs-4 fw-bold">
                <Button className="navbar-brand  animate__animated animate__bounce ms-5 text-start" style={{ width: "45%", background: "transparent", color: "rgb(46, 79, 122)", border: "none" }} onClick={(e) => navigate_pages(e)}>
                  <span className="fw-bold fs-4 " style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}><i class="fa-solid fa-user me-3"></i>Welcome {realData.first_name}</span></Button>
              </li></> : <>
              <li className="nav-item fs-4 fw-bold"  >
                <Link className="nav-link active fs-5 " aria-current="page" to="/signin" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>SignIn</Link>
              </li>
              <li className="nav-item fs-4 fw-bold">
                <Link className="nav-link active fs-5" aria-current="page" to="/signup" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>SignUp</Link>
              </li>
            </>}
          </ul>
        </div>
      </div>
      </nav>
    );

  }
  else if (location.pathname === '/TreatmentCenter' || location.pathname === '/tourismCompany'){
    return (
      <nav style={{ backgroundColor: navbar ? 'rgba(174, 224, 219, 0.89)' : 'rgba(174, 224, 219, 0.89)', transition: navbar ? '0.7s' : '0.3'}} className="navbar navbar-expand-lg fixed-top">  <div className="container-fluid">
        <Link className="navbar-brand  animate__animated animate__bounce ms-5 text-start" style={{ width: "45%" }} to="/">
          <span className="fw-bold fs-4" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}><img src={logo} className="me-4 " alt="david" style={{ width: "10%" }} />Medical Tourism</span></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"> </span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav d-flex justify-content-end" style={{ width: "40vw"}}>
            {localStorage.getItem("token") &&<>
            {(jwtDecode(localStorage.getItem('token')).role === "Patient" || jwtDecode(localStorage.getItem('token')).role === "Tourist") &&
            <>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/Tourism" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>Tourism</Link></li>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/treatment" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>Medical</Link></li>
            </>}
            </>}
            {/* <li className="nav-item dropdown fs-4 fw-bold" >
              <select className="form-select" value={lang} onChange={(e) => handlelang(e)}>
                <option value="EN">EN</option>
                <option value="AR">AR</option>
              </select>
            </li> */}
            {realData ? <> <li className="nav-item fs-4 fw-bold">
              <Link className="nav-link active fs-4 ms-5" aria-current="page" to="/signin" onClick={logOut} style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>LogOut</Link>
            </li>             <li className="nav-item fs-4 fw-bold">
                <Button className="navbar-brand  animate__animated animate__bounce ms-5 text-start" style={{ width: "45%", background: "transparent", color: "rgb(46, 79, 122)", border: "none" }} onClick={(e) => navigate_pages(e)}>
                  <span className="fw-bold fs-4 " style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}><i class="fa-solid fa-user me-3"></i>Welcome {realData.first_name}</span></Button>
              </li></> : <>
              <li className="nav-item fs-4 fw-bold"  >
                <Link className="nav-link active fs-5 " aria-current="page" to="/signin" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>SignIn</Link>
              </li>
              <li className="nav-item fs-4 fw-bold">
                <Link className="nav-link active fs-5" aria-current="page" to="/signup" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>SignUp</Link>
              </li>
            </>}
          </ul>
        </div>
      </div>
      </nav>
    );

  }
  else if (location.pathname === '/signin' || location.pathname === '/signup'){
    return (
      <nav style={{ backgroundColor: navbar ? 'rgba(174, 224, 219, 0.89)' : 'rgba(174, 224, 219, 0.89)', transition: navbar ? '0.7s' : '0.3'}} className="navbar navbar-expand-lg fixed-top">  <div className="container-fluid">
        <Link className="navbar-brand  animate__animated animate__bounce ms-5 text-center " style={{ width: "45%" }} to="/">
          <span className="fw-bold fs-4" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}><img src={logo} className="me-4 " alt="david" style={{ width: "10%" }} />Medical Tourism</span></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"> </span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav d-flex justify-content-center" style={{ width: "40vw"}}>
            {localStorage.getItem("token") &&<>
            {(jwtDecode(localStorage.getItem('token')).role === "Patient" || jwtDecode(localStorage.getItem('token')).role === "Tourist") &&
            <>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/Tourism" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>Tourism</Link></li>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/treatment" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>Medical</Link></li>
            </>}
            </>}
            {/* <li className="nav-item dropdown fs-4 fw-bold" >
              <select className="form-select" value={lang} onChange={(e) => handlelang(e)}>
                <option value="EN">EN</option>
                <option value="AR">AR</option>
              </select>
            </li> */}
            {realData ? <> <li className="nav-item fs-4 fw-bold">
              <Link className="nav-link active fs-4 ms-5" aria-current="page" to="/signin" onClick={logOut} style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>LogOut</Link>
            </li>             <li className="nav-item fs-4 fw-bold">
                <Button className="navbar-brand  animate__animated animate__bounce ms-5 text-start" style={{ width: "45%", background: "transparent", color: "rgb(46, 79, 122)", border: "none" }} onClick={(e) => navigate_pages(e)}>
                  <span className="fw-bold fs-4 " style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}><i class="fa-solid fa-user me-3"></i>Welcome {realData.first_name}</span></Button>
              </li></> : <>
              <li className="nav-item fs-4 fw-bold"  >
                <Link className="nav-link active fs-5 me-5" aria-current="page" to="/signin" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>SignIn</Link>
              </li>
              <li className="nav-item fs-4 fw-bold">
                <Link className="nav-link active fs-5" aria-current="page" to="/signup" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>SignUp</Link>
              </li>
            </>}
          </ul>
        </div>
      </div>
      </nav>
    );

  }
  else if (location.pathname === '/profile'){
    return (
      <nav style={{ backgroundColor: navbar ? 'rgba(174, 224, 219, 0.89)' : 'rgba(174, 224, 219, 0.89)', transition: navbar ? '0.7s' : '0.3'}} className="navbar navbar-expand-lg fixed-top">  <div className="container-fluid">
        <Link className="navbar-brand  animate__animated animate__bounce ms-5 text-start" style={{ width: "45%" }} to="/">
          <span className="fw-bold fs-4" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}><img src={logo} className="me-4 " alt="david" style={{ width: "10%" }} />Medical Tourism</span></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"> </span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav d-flex justify-content-around" style={{ width: "40vw"}}>
            {localStorage.getItem("token") &&<>
            {(jwtDecode(localStorage.getItem('token')).role === "Patient" || jwtDecode(localStorage.getItem('token')).role === "Tourist") &&
            <>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/Tourism" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>Tourism</Link></li>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/treatment" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>Medical</Link></li>
            </>}
            </>}
            {realData ? <> <li className="nav-item fs-4 fw-bold">
              <Link className="nav-link active fs-4" aria-current="page" to="/signin" onClick={logOut} style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>LogOut</Link>
            </li>             <li className="nav-item fs-4 fw-bold">
                <Button className="navbar-brand  animate__animated animate__bounce ms-5 text-start mt-1" style={{ width: "45%", background: "transparent", color: "rgb(46, 79, 122)", border: "none" }} onClick={(e) => navigate_pages(e)}>
                  <span className="fw-bold fs-4" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}><i class="fa-solid fa-user me-3"></i>Welcome {realData.first_name}</span></Button>
              </li></> : <>
              <li className="nav-item fs-4 fw-bold"  >
                <Link className="nav-link active fs-5 me-5" aria-current="page" to="/signin" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>SignIn</Link>
              </li>
              <li className="nav-item fs-4 fw-bold">
                <Link className="nav-link active fs-5" aria-current="page" to="/signup" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>SignUp</Link>
              </li>
            </>}
          </ul>
        </div>
      </div>
      </nav>
    );

  }
  else if (location.pathname === '/AddNewDoctor' || location.pathname === '/AddTourismPlaces' || location.pathname === `/Updateplace/${ID}`|| location.pathname === `/updateDoctor/${ID}`){
    return (
      <nav style={{ backgroundColor: navbar ? 'rgba(174, 224, 219, 0.89)' : 'rgba(174, 224, 219, 0.89)', transition: navbar ? '0.7s' : '0.3'}} className="navbar navbar-expand-lg fixed-top">  <div className="container-fluid">
        <Link className="navbar-brand  animate__animated animate__bounce ms-5 text-start" style={{ width: "45%" }} to="/">
          <span className="fw-bold fs-4" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}><img src={logo} className="me-4 " alt="david" style={{ width: "10%" }} />Medical Tourism</span></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"> </span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav d-flex justify-content-center" style={{ width: "40vw"}}>
            {localStorage.getItem("token") &&<>
            {(jwtDecode(localStorage.getItem('token')).role === "Patient" || jwtDecode(localStorage.getItem('token')).role === "Tourist") &&
            <>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/Tourism" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>Tourism</Link></li>
            <li className="nav-item"><Link className="nav-link active fs-4 fw-bold" aria-current="page" to="/treatment" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>Medical</Link></li>
            </>}
            </>}
            {realData ? <> <li className="nav-item fs-4 fw-bold">
              <Link className="nav-link active fs-4" aria-current="page" to="/signin" onClick={logOut} style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>LogOut</Link>
            </li>             <li className="nav-item fs-4 fw-bold">
                <Button className="navbar-brand  animate__animated animate__bounce ms-5 text-start mt-1" style={{ width: "45%", background: "transparent", color: "rgb(46, 79, 122)", border: "none" }} onClick={(e) => navigate_pages(e)}>
                  <span className="fw-bold fs-4" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}><i class="fa-solid fa-user me-3"></i>Welcome {realData.first_name}</span></Button>
              </li></> : <>
              <li className="nav-item fs-4 fw-bold"  >
                <Link className="nav-link active fs-5 me-5" aria-current="page" to="/signin" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>SignIn</Link>
              </li>
              <li className="nav-item fs-4 fw-bold">
                <Link className="nav-link active fs-5" aria-current="page" to="/signup" style={{ color: navbar ? 'rgb(46, 79, 122)' : 'rgb(46, 79, 122)',}}>SignUp</Link>
              </li>
            </>}
          </ul>
        </div>
      </div>
      </nav>
    );

  }

}

export default NavBar;