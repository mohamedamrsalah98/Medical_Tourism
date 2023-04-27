import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import Search from "../Search/Search";
import jwtDecode from "jwt-decode";
import { toast } from 'react-toastify';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "../../images/7.png";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import './ListOfPlaces.css';
import { FcRatings } from 'react-icons/fc';
import { motion } from "framer-motion";
import emoji1 from '../../images/emoji-1.png'
import emoji2 from '../../images/emoji-2.png'
import emoji3 from '../../images/emoji-3.png'
import emoji4 from '../../images/emoji-4.png'
import emoji5 from '../../images/emoji-5.png'
import { useNavigate } from 'react-router-dom';






function ListOfPlaces() {
    const [Places, setPlaces] = useState([]);
    const [page, setPage] = useState("1");
    const parm = useParams();
    const navigate = useNavigate(); // create navigate function

    const ID = parm.id;
    const [role, setRole] = useState("");
    const [userid, setuserId] = useState("")
    const [ratebyuser, setRatedbyuser] = useState("");
    const [detail, setDetails] = useState({});
    const [feedback, setFeedback] = useState([]);
    const [allfeedback, setAllfeedback] = useState([]);
    ////////////////////// pagination places
    const [Doctorpage, setDoctorPage] = useState("1");
    const DoctorpageSize = 3;
    const dcotorstart = (Doctorpage - 1) * DoctorpageSize;
    const doctorend = dcotorstart + DoctorpageSize;
    const currentPagedoctor = Places.slice(dcotorstart, doctorend);
    const doctortotalPages = Math.ceil(Places.length / DoctorpageSize);


    function handlePreviousDoctorPage() {
        setDoctorPage((prevPage) => Math.max(prevPage - 1, 1));
    }
    function handleNextDoctorPage() {
        setDoctorPage((prevPage) => Math.min(prevPage + 1, doctortotalPages));
    }
    //////////////////////////////////////////////////

        const Render_feedback = () => {
        
        axios.post("http://127.0.0.1:8000/tourism_company_feedbacks", { 'tourism_company_id': ID }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            console.log(response.data.feedbacks)
            setAllfeedback(response.data.feedbacks)
        }).catch(error => { console.log(error) })
    }



    //////////////////Done Details////////////////////////////////////////////////////////////
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api_tourism_comapny/${ID}`, {
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
        
                axios.post("http://127.0.0.1:8000/tourism_company_places", { 'id': ID }, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(response => {
                    setPlaces(response.data.places)
                }).catch(error => { console.log(error) })
                const GetUserData = jwtDecode(localStorage.getItem("token"));
                setuserId(GetUserData.user_id)
                setRole(GetUserData.role)
        checking(GetUserData)
        checkingfeedback(GetUserData)
        Render_feedback()

        
    }, []);

/////////////////////////////// feedback ///////////////////
const [feedbackbyuser, setFeedbackbyuser] = useState("");

const checkingfeedback = async (GetUserData) => {
    axios.post('http://127.0.0.1:8000/checking_tourism_feedback', { 'user_id': GetUserData.user_id, 'tourism_company_id': ID })
        .then(response => { setFeedbackbyuser(response.data.status)})
        .catch(error => { console.log(error) })

}
    
const handlefeedback = async (event) => {
    event.preventDefault();
    const FeeddbackData = {
        user_id: userid,
        tourism_company_id: ID,
        feedback : feedback
    }
    try {
        const { NEW_FEEDBACK } = await axios.post("http://127.0.0.1:8000/feedback_tourism", FeeddbackData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        toast.success('Tourism Company feedback successfully.');
        Render_feedback()
        const GetUserData = jwtDecode(localStorage.getItem("token"));
        checkingfeedback(GetUserData)
    }
    catch (error) {
        toast.warning('An error occurred while feedback the tourism.');

    }
};

    //////////////// Search
    const [rate, setRate] = useState(0);

    const checking = async (GetUserData) => {
        axios.post('http://127.0.0.1:8000/checking_tourism_rating', { 'user_id': GetUserData.user_id, 'tourism_company_id': ID })
            .then(response => { setRatedbyuser(response.data.status) })
            .catch(error => { console.log(error) })

    }
    const [show, setShow] = useState(false)

    const [sear, setSear] = useState("");
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!show) {
            setShow(true);
            return;
        }

        const RatingData = {
            user_id: userid,
            tourism_company_id: ID,
            user_rate: rate
        }

        try {
            const { NEW_RATING } = await axios.post("http://127.0.0.1:8000/rating_tourism", RatingData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            toast.success('Treatment Center Rated successfully.');
            const GetUserData = jwtDecode(localStorage.getItem("token"));
            checking(GetUserData);
            setShow(false);
        }
        catch (error) {
            toast.warning('An error occurred while rating the treatment.');
        }
    };

    const [payment, setPayment] = useState("");

    useEffect(() => {
        const GetUserData = jwtDecode(localStorage.getItem("token"));

        const PaymentData = {
            tourism_company: ID,
            user_id: GetUserData.user_id
        }
        axios
            .post("http://127.0.0.1:8000/tourism_get_payment", PaymentData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                setPayment(response.data.isPaidTourism);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

//   ######################### pagination #########################################
    const pageSize = 2;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const currentPageFeedback = allfeedback.slice(start, end);
    const totalPages = Math.ceil(allfeedback.length / pageSize);

    function handlePreviousPage() {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
    }
    function handleNextPage() {
        setPage((prevPage) => Math.min(prevPage + 1, totalPages));
    }

    const directBook = (id) => {
        const GetUserData = jwtDecode(localStorage.getItem("token"));
        if (GetUserData.role === "Patient") {
            toast.warning("You must login as a tourist to book this place , please head to the login page")
       }
        else {
            navigate(`/bookplace/${id}`)
        }

    }
    return (
        <>
        {/* ################################# sec 1 ################################# */}

        <div style={{ backgroundColor: "rgb(180 220 239)", height: '80vh' }} className="container-fluid se">
            <div className="row" >
                <div className="col-md-6 col-sm-12 offset-md-1" style={{ marginTop: '11%' }}>
                    <h1 className="" style={{ color: 'rgb(0, 51, 78)' ,fontFamily:"Lucida Calligraphy"}}>Make your Tour Amazing  <span className="fw-bold">With {detail.name}</span> </h1>
                    <p className="fs-6 mt-5">Lorem ipsum dolor sit, amet consectetur adipisicing elit.Explicabo praesentium<br /> Explicabo praesentium, tenetur</p>
                    <a href="#doc"><button style={{ backgroundColor: '#2e4f7a' }} className=" text-white btn fs-5 px-5 py-2 mt-5">Contact Us <i class="fa-solid fa-arrow-right ms-4"></i></button></a>
                </div>
                <div className="col-md-4  d-none d-md-block">
                    <img src={Image} alt="Logo" style={{ marginTop: '20%', width: '110%' }} />
                </div>
                <div className="container fe" style={{marginTop:"4%",marginBottom:"5%"}}>
                    <div className="row m-auto text-center" >
                    <div className=" card shadow col-sm-8 col-md-5 col-lg-2 text-center mt-5 m-auto text-center overflow-hidden" style={{height:"33.5vh"}}>
                        <div className="mt-5" ><i class="fa-solid fa-money-bill-1-wave fa-3x text-success"></i></div>
                        <h3 className="mt-5 mb-3">Best Price<br/> Guarantee</h3>
                        <p className="w-75 m-auto mb-4 ">A small river named duden flows by their place and supplies.</p>
                    </div>
                    <div className=" card shadow col-sm-8 col-md-5 col-lg-2 text-center mt-5 m-auto text-center overflow-hidden" style={{height:"33.5vh"}}>
                        <div className="mt-5" ><i class="fa-regular fa-heart fa-3x text-danger"></i></div>
                        <h3 className="mt-5 mb-3">Travellers Love Us</h3>
                        <p className="w-75 m-auto mb-4 ">A small river named duden flows by their place and supplies.</p>
                    </div>
                    <div className=" card shadow col-sm-8 col-md-5 col-lg-2 text-center mt-5 m-auto text-center overflow-hidden" style={{height:"33.5vh"}}>
                        <div className="mt-5" ><i class="fa-solid fa-user-tie fa-3x text-danger"></i></div>
                        <h3 className="mt-5 mb-3">Best Travel Agent</h3>
                        <p className="w-75 m-auto mb-4">A small river named duden flows by their place and supplies.</p>
                    </div>
                    <div className=" card shadow col-sm-8 col-md-5 col-lg-2 text-center mt-5 m-auto text-center overflow-hidden" style={{height:"33.5vh"}}>
                        <div className="mt-5" ><i class="fa-solid fa-headset fa-3x text-success"></i></div>
                        <h3 className="mt-5 mb-3">Our Dedicated Support</h3>
                        <p className="w-75 m-auto mb-4">A small river named duden flows by their place and supplies.</p>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="he" style={{height:"30vh"}}></div>

        {/* ################################# sec 2 ################################# */}
        <div id='doc' className="container rounded-5 p-5 my-5 " style={{ backgroundColor: "rgb(180 220 239)"}}>
                <div className="row text-center m-auto">
                    <h1 style={{color:"#002c5d",fontFamily: "Lucida Calligraphy",fontSize:"200%"}} className="h3 text-center pb-5 pt-3 fw-bold col-sm-11">{detail.name} Have The Best Services About Tourism</h1>
                    {currentPagedoctor.map((place, i) => (
                        <div key={place.id} className="col-md-6 col-lg-4 mb-4 col-sm-12">
                            <div className="card shadow-lg p-3 mb-5 bg-body-tertiary rounded w-75 m-auto">
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div className="text-center">
                                    <div className="overflow-hidden m-auto mt-3 mb-4 rounded-5" style={{ width: "200px", height: "150px" }}>
                                            <img src={`http://127.0.0.1:8000/${place.image}`} alt={place.name} className="w-100 h-100 object-fit-cover" />
                                        </div>
                                        <h3 className="h5 my-3"><i class="fa-solid fa-location-dot me-2 text-primary"></i>{place.name}</h3>
                                        <p className="mb-3"><i class="fa-solid fa-star text-warning me-2"></i>{place.rating}</p>
                                    </div>

                                    <div className="text-center mb-1 mt-1">
                                        <button className="btn btn-outline-secondary" onClick={() => directBook(place.id)} > Book now </button>

                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                                        <div className="d-flex justify-content-center mt-5 align-items-center pb-4">
                        <BsChevronLeft className="me-3 fw-bold" size={30} onClick={handlePreviousDoctorPage} style={{ cursor: "pointer" }} />
                        <span className="me-2">
                            Page {Doctorpage} of {doctortotalPages}
                        </span>
                        <BsChevronRight className="ms-3" size={30} onClick={handleNextDoctorPage} style={{ cursor: "pointer" }} />
                    </div>
                </div>
            </div>
{/* ################################# Client Speak ################################# */}

    <div className="container rounded-5" style={{ backgroundColor: "rgb(200 226 239)",marginTop:"7%" }}>
    <h1 className="text-center m-auto fw-bold pt-5" style={{color:"#002c5d",fontFamily: "Lucida Calligraphy",fontSize:"300%"}}>Testimonials</h1>
            <h5 className="text-center m-auto mt-2" style={{color:"#002c5d",fontFamily: "Lucida Calligraphy"}}>Patient experience with our service</h5>
    <div className="row">
{currentPageFeedback.map((feed, i) => (
                    <div className="col-md-4 col-sm-8 card shadow rounded mt-5  m-auto" key={i}>
                    <img
                        style={{ width: "18%", height: "8vh" }}
                        className="img-fluid rounded-circle bg-dark m-auto mt-4"
                        src={`http://127.0.0.1:8000/${feed.user.picture}`}
                        alt="david"
                    />
                    <h3 className="col-sm-6 text-center m-auto mt-2 mb-2">{feed.user.FullName}</h3>
                    <hr className="w-50 m-auto text-center mb-4 mt-3"/>
                    <div className="m-auto">            
                    <i style={{color:"#e30a17"}}class="fa-solid fa-quote-right fa-2x"></i>
                    </div>
                    <div className="m-auto text-center mt-3 mb-3">
                    <p>{feed.feedback}</p>
                    </div>
                </div>
                    ))}
                </div>
                <div className="d-flex justify-content-center mt-5 align-items-center pb-4">
                    <BsChevronLeft className="me-3 fw-bold" size={30} onClick={handlePreviousPage} style={{ cursor: "pointer" }} />
                    <span className="me-2">
                        Page {page} of {totalPages}
                    </span>
                    <BsChevronRight className="ms-3" size={30} onClick={handleNextPage} style={{ cursor: "pointer" }} />
                </div>
            </div>

            {/* ################################# rating ################################# */}

            <h1 className="text-center m-auto fw-bold pt-5 mt-5" style={{color:"#002c5d",fontFamily: "Lucida Calligraphy",fontSize:"400%"}}>CONTACT</h1>
            <h3 className="text-center m-auto mt-2 mb-5" style={{color:"#002c5d",fontFamily: "Lucida Calligraphy"}}>Get in Touch</h3>
                <div className="container py-5 rounded-5"  style={{backgroundColor:"rgb(200 226 239)",marginBottom:"7%"}} >
                    <div className="row">
                    <div className="col-sm-12 text-center my-5">
                    {role === "Tourist" ? (
                        payment === "True" ? (
                            <div className="container mt-5">
                                {ratebyuser === "notrated" ? (
                            <form onSubmit={(e) => { e.preventDefault() }} className="row">
                            <div>
                            <button
                                type="button"
                                className="offset-sm-1 col-sm-2 btn btn-outline-primary m-auto text-center"
                                onClick={() => setShow(true)}
                            >
                                Rate us
                            </button>
                            {show !== false && (
                                <div className="RatPopup">
                                    <motion.div
                                        className="wrapper"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                    >
                                        {[1, 2, 3, 4, 5].map((n) => {
                                            return (
                                                <input
                                                    key={n}
                                                    type="radio"
                                                    value={n}
                                                    onChange={(e) => setRate(e.target.value)}
                                                    name="rate"
                                                    id={`star-${n}`}
                                                />
                                            );
                                        })}
                                        <div className="content">
                                            <div className="outer">
                                                <div className="emojis">
                                                    <li className="slideImg">
                                                        <img src={emoji1} alt="emoji1" />
                                                    </li>
                                                    <li>
                                                        <img src={emoji2} alt="emoji2" />
                                                    </li>
                                                    <li>
                                                        <img src={emoji3} alt="emoji3" />
                                                    </li>
                                                    <li>
                                                        <img src={emoji4} alt="emoji4" />
                                                    </li>
                                                    <li>
                                                        <img src={emoji5} alt="emoji5" />
                                                    </li>
                                                </div>
                                            </div>
                                            <div className="stars">
                                                <label htmlFor="star-1" className="star-1 fas fa-star"></label>
                                                <label htmlFor="star-2" className="star-2 fas fa-star"></label>
                                                <label htmlFor="star-3" className="star-3 fas fa-star"></label>
                                                <label htmlFor="star-4" className="star-4 fas fa-star"></label>
                                                <label htmlFor="star-5" className="star-5 fas fa-star"></label>
                                            </div>
                                        </div>
                                        <div className="footer">
                                            <span className="text"></span>
                                            <button
                                                type="submit"
                                                className="btn btn-secondary p-3 fs-4 m-2 pt-1 pb-1"
                                                onClick={handleSubmit}
                                            >
                                                Save
                                            </button>
                                            <span className="numb"></span>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </form>

                                ) : (
                                    <p>You already rated us before. Thank you!</p>
                                )}
                                {feedbackbyuser === "notfeedback" ? (
                                    <div className="container mt-5">
                                        <form onSubmit={handlefeedback} className="row">
                                        <label className="col-sm-2 fs-4" for="feedback"><i class="fa-regular fa-comment text-primary fa-2x"></i></label>
                                        <input 
                                        type="text" 
                                        className=" col-sm-8 form-control w-50" 
                                        id="feedback" 
                                        value={feedback} 
                                        onChange={(event) => setFeedback(event.target.value)} 
                                        required 
                                        placeholder="send your feedback"
                                        />
                                        <button type="submit" className="offset-sm-1 col-sm-2 btn btn-outline-primary">Send Feedback</button>
                                    </form>

                                    </div>
                                ) : (
                                    <p className="mt-5">You already gave us feedback. Thank you!</p>
                                )}
                            </div>
                        ) : (
                            <p className="mt-5">You must have a reservation first to rate and give feedback for us.</p>
                        )
                    ) : (
                        <p className="mt-5">You must be a Tourist.</p>
                    )}
                        
             
                        </div>
                
                        
                        </div>
                    </div>

        </>
    );
}
export default ListOfPlaces;


