import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import Search from "../Search/Search";
import Image from "../../images/doc.png";
import Button from "react-bootstrap/Button";
import jwtDecode from "jwt-decode";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ListOfDoctors.css';
import { Form, Dropdown } from 'react-bootstrap';
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FcRatings } from 'react-icons/fc';
import { motion } from "framer-motion";
import emoji1 from '../../images/emoji-1.png'
import emoji2 from '../../images/emoji-2.png'
import emoji3 from '../../images/emoji-3.png'
import emoji4 from '../../images/emoji-4.png'
import emoji5 from '../../images/emoji-5.png'
import { useNavigate } from 'react-router-dom';




function ListOfDoctors() {
    const [doctors, setDoctors] = useState([]);
    const parm = useParams();
    const [feedbackbyuser, setFeedbackbyuser] = useState("");
    const [feedback, setFeedback] = useState([]);
    const [allfeedback, setAllfeedback] = useState([]);
    const ID = parm.id;
    const [detail, setDetails] = useState({});
    const [role, setRole] = useState("");
    const [userid, setuserId] = useState("")
    const [ratebyuser, setRatedbyuser] = useState("");
    const [payment, setPayment] = useState("");
    const navigate = useNavigate(); // create navigate function
    /////////////////////pagination doctors
    const [Doctorpage, setDoctorPage] = useState("1");
    const DoctorpageSize = 3;
    const dcotorstart = (Doctorpage - 1) * DoctorpageSize;
    const doctorend = dcotorstart + DoctorpageSize;
    const currentPagedoctor = doctors.slice(dcotorstart, doctorend);
    const doctortotalPages = Math.ceil(doctors.length / DoctorpageSize);


    function handlePreviousDoctorPage() {
        setDoctorPage((prevPage) => Math.max(prevPage - 1, 1));
    }
    function handleNextDoctorPage() {
        setDoctorPage((prevPage) => Math.min(prevPage + 1, doctortotalPages));
    }

    //////////////////Done Details////////////////////////////////////////////////////////////
    const GetUserData = jwtDecode(localStorage.getItem("token"));
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [specializationOptions, setSpecializationOptions] = useState([]);
    const [page, setPage] = useState("1");
    ///////////////////pagination feedbacks
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
    //////////////////////////
    useEffect(() => {

        axios.get(`http://127.0.0.1:8000/treatment/${ID}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setDetails(response.data)
                const hairFields = [
                    'All',
                    "Hair restoration surgery",
                    "Plastic surgery",
                    "Dermatology",
                    "Hair transplantation",
                    "Follicular unit transplantation (FUT)",
                    "Follicular unit extraction (FUE)",
                    "Robotic hair transplantation",
                    "Non-surgical hair restoration methods",
                    "Hair loss treatment",
                    "Scalp micropigmentation",
                    "Trichology",
                    "Hair biology",
                    "Hair research and development",
                    "Hair products and cosmetics",
                    "Hair styling and design"
                ];
                const dentalFields = [
                    'All',
                    'General dentistry',
                    'Pediatric dentistry',
                    'Orthodontics',
                    'Endodontics',
                    'Periodontics',
                    'Prosthodontics',
                    'Oral and maxillofacial surgery',
                    'Cosmetic dentistry',
                    'Implant dentistry',
                    'Dental radiology',
                    'Dental anesthesia',
                    'Oral medicine',
                    'Dental public health',
                    'Dental hygiene',
                    'Dental laboratory technology'
                ];
                const TourismFields = ["All",
                    "Electrical therapy",
                    "Mineral water therapy",
                    "Massage therapy",
                    "Natural therapy through oxygen inhalation",
                    "Paraffin therapy", "Anti-aging therapy",
                    "Treatment of digestive system diseases"]
                if (response.data.specialization === "Hair Implant") {
                    setSpecializationOptions(hairFields.map(field => ({
                        value: field,
                        label: field
                    })));
                }
                else if (response.data.specialization === "Dental") {
                    setSpecializationOptions(dentalFields.map(field => ({
                        value: field,
                        label: field
                    })));
                }
                else {
                    setSpecializationOptions(TourismFields.map(field => ({
                        value: field,
                        label: field
                    })));
                }
            })
            .catch(error => {
                console.log(error)
            });
        axios.post("http://127.0.0.1:8000/treatment_doctors", { 'id': ID }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            setDoctors(response.data.doctors)
        }).catch(error => { console.log(error) })
        const GetUserData = jwtDecode(localStorage.getItem("token"));
        setuserId(GetUserData.user_id)
        setRole(GetUserData.role)
        checking(GetUserData)
        Render_feedback()

        checkingfeedback(GetUserData)


    }, []);
    let formSubmit = (e) => {
        e.preventDefault();
    }

    const filter = async (option) => {
        const FilterData = {
            treatment_center: ID,
            specialization: option
        }
        try {
            const response = await axios.post('http://127.0.0.1:8000/filterdoctors', FilterData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (response) {
                setDoctors(response.data.doctors)

            }
        } catch (error) {
            toast.error("Error happened while filtering data")
        }
    }
    const checking = async (GetUserData) => {
        axios.post('http://127.0.0.1:8000/checking_treatment_rating', { 'user_id': GetUserData.user_id, 'treatment_center_id': ID })
            .then(response => { setRatedbyuser(response.data.status) })
            .catch(error => { console.log(error) })

    }
    ////////////////////////////////feedback ////////////
    const Render_feedback = () => {

        axios.post("http://127.0.0.1:8000/treatment_center_feedbacks", { 'user_id': ID }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            console.log(response.data.feedbacks)

            setAllfeedback(response.data.feedbacks)
        }).catch(error => { console.log(error) })
    }
    const checkingfeedback = async (GetUserData) => {
        axios.post('http://127.0.0.1:8000/checking_treatment_feedback', { 'user_id': GetUserData.user_id, 'treatment_center_id': ID })
            .then(response => { setFeedbackbyuser(response.data.status) })
            .catch(error => { console.log(error) })

    }

    const [show, setShow] = useState(false)


    const handlefeedback = async (event) => {
        event.preventDefault();

        const FeeddbackData = {
            user_id: userid,
            treatment_center_id: ID,
            feedback: feedback
        }
        try {
            const { NEW_FEEDBACK } = await axios.post("http://127.0.0.1:8000/feedback_treatment", FeeddbackData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            toast.success('Treatment Center feedback successfully.');
            Render_feedback()
            const GetUserData = jwtDecode(localStorage.getItem("token"));
            checkingfeedback(GetUserData)
        }
        catch (error) {
            toast.warning('An error occurred while feedback the treatment.');

        }
    };

    //////////////// Search

    const [rate, setRate] = useState(0);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!show) {
            setShow(true);
            return;
        }

        const RatingData = {
            user_id: userid,
            treatment_center_id: ID,
            user_rate: rate
        }

        try {
            const { NEW_RATING } = await axios.post("http://127.0.0.1:8000/rating_treatment", RatingData, {
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

    useEffect(() => {
        const PaymentData = {
            treatment_center: ID,
            user_id: GetUserData.user_id
        }
        console.log(PaymentData)
        axios
            .post("http://127.0.0.1:8000/get_payment", PaymentData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                setPayment(response.data.isPaid);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    const directBook = (id) => {
        const GetUserData = jwtDecode(localStorage.getItem("token"));
        if (GetUserData.role === "Tourist") {
            toast.warning("You must login as a patient to book this place , please head to the login page")
        }
        else {
            navigate(`/doctorDetail/${id}`)
        }

    }
    return (
        <>
            {/* ################################# sec 1 ################################# */}

            <div style={{ backgroundColor: "rgb(174 224 219 / 89%)", height: '80vh' }} className="container-fluid">
                <div className="row" >
                    <div className="col-md-6 col-sm-12 offset-md-1" style={{ marginTop: '13%' }}>
                        <h1 className="" style={{ color: 'rgb(0, 51, 78)' }}>{detail.name} Find <span className="fw-bold" style={{ color: '#2e4f7a' }}>Best Doctors</span> <br /> for your <span className="">Hair Transplant Surgery</span></h1>
                        <p className="fs-6 mt-5">Lorem ipsum dolor sit, amet consectetur adipisicing elit.Explicabo praesentium<br /> Explicabo praesentium, tenetur</p>
                        <a href="#doc"><button style={{ backgroundColor: '#2e4f7a' }} className=" text-white btn fs-5 px-5 py-2 mt-5">Contact Us <i class="fa-solid fa-arrow-right ms-4"></i></button></a>
                    </div>
                    <div className="col-md-4  d-none d-md-block">

                        <img src={Image} alt="Logo" style={{ marginTop: '20%', width: '110%' }} />
                    </div>
                </div>
            </div>
            {/* ################################# sec 2 ################################# */}

            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <p className="text-center" style={{ marginTop: '10%' }}>FASTEST SOLUTION</p>
                        <h1 className="text-center" style={{ color: '#2e4f7a', fontSize: '300%' }}>3 Easy Steps and Get Your Solution</h1>
                        <p className="text-center mt-4" >Get the {detail.specialization} solution you need in just 3 easy steps with our leading service  </p>
                    </div>
                    <div className="col-sm-12 col-md-4 text-center my-5">
                        <div className="my-5" ><i class="fa-solid fa-user-doctor fa-2x"></i></div>
                        <h3 className="mb-4">Check doctors profile</h3>
                        <p className="w-75 m-auto">Find the right doctor for your needs and preferences</p>
                    </div>
                    <div className="col-sm-12 col-md-4 text-center my-5">
                        <div className="my-5" ><i class="fa-solid fa-envelope fa-2x"></i></div>
                        <h3 className="mb-4">Contact Us</h3>
                        <p className="w-75 m-auto">{detail.email} </p>
                    </div>
                    <div className="col-sm-12 col-md-4 text-center my-5">
                        <div className="my-5" ><i class="fa-solid fa-square-check fa-2x"></i></div>
                        <h3 className="mb-4">Get your solution</h3>
                        <p className="w-75 m-auto">Get quick and effective solutions to your problems </p>
                    </div>
                </div>
            </div>
            {/* ################################# sec 3 ################################# */}
            <div id='doc' className="container rounded-5 p-5 my-5 " style={{ backgroundColor: 'rgba(174, 224, 219, 0.89)' }}>
                <div className="row text-center m-auto">
                    <div className="col-sm-1 mb-4">
                        <Form onSubmit={(e) => formSubmit(e)}>
                            <Form.Group controlId="specializationField">
                                {/* <Form.Label>Specialization Field</Form.Label> */}
                                <Dropdown>
                                    <Dropdown.Toggle className="bg-primary fs-2 p-0 px-2 mt-3" style={{ height: "3.7vh" }}>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {specializationOptions.map(option => (
                                            <Dropdown.Item key={option.value} onClick={() => filter(option.value)}>
                                                {option.label}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form.Group>
                        </Form>
                    </div>
                    <h1 style={{ color: "#002c5d", fontFamily: "Lucida Calligraphy", fontSize: "200%" }} className="h3 text-center pb-5 pt-3 fw-bold col-sm-11">{detail.name} have certificated and high qualified doctors</h1>
                    {currentPagedoctor.map((place, i) => (
                        <div key={place.id} className="col-md-6 col-lg-4 mb-4 col-sm-12">
                            <div className="card shadow-lg p-3 mb-5 bg-body-tertiary rounded w-75 m-auto">
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div className="text-center">
                                        <div className="overflow-hidden m-auto mt-3 mb-4 rounded-5" style={{ width: "200px", height: "150px" }}>
                                            <img src={`http://127.0.0.1:8000/${place.picture}`} alt={place.name} className="w-100 h-100 object-fit-cover" />
                                        </div>
                                        <h3 className="h5 my-3"><i class="fa-solid fa-user-nurse me-3 text-primary"></i>Dr.{place.name}</h3>
                                        <p className="mb-3"><i class="fa-solid fa-star text-warning me-3"></i>{place.rating}</p>
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
            <div className="container rounded-5 my-5 mt-5" style={{ backgroundColor: 'rgb(174 224 219 / 55%)' }}>
                <h1 className="text-center m-auto fw-bold pt-5" style={{ color: "#002c5d", fontFamily: "Lucida Calligraphy", fontSize: "300%" }}>Testimonials</h1>
                <h5 className="text-center m-auto mt-2" style={{ color: "#002c5d", fontFamily: "Lucida Calligraphy" }}>Patient experience with our service</h5>
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
                            <hr className="w-50 m-auto text-center mb-4 mt-3" />
                            <div className="m-auto">
                                <i style={{ color: "#e30a17" }} class="fa-solid fa-quote-right fa-2x"></i>
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
            <h1 className="text-center m-auto fw-bold pt-5" style={{ color: "#002c5d", fontFamily: "Lucida Calligraphy", fontSize: "400%" }}>CONTACT</h1>
            <h3 className="text-center m-auto mt-2" style={{ color: "#002c5d", fontFamily: "Lucida Calligraphy" }}>Get in Touch</h3>
            <div className="container my-5 py-5 rounded-5" style={{ backgroundColor: 'rgb(174 224 219 / 55%)' }} >
                <div className="row">
                    <div className="col-sm-12 text-center my-5">
                        {role === "Patient" ? (
                            payment === "True" ? (
                                <div className="container mt-5">
                                    {ratebyuser === "notrated" ? (
                                        <form onSubmit={(e) => { e.preventDefault() }} className="row">
                                            <div className=" m-sm-12 mb-5 row">
                                                <i class="fa-solid fa-star text-warning fa-3x col-lg-3 col-sm-6 text-center" style={{ cursor: "pointer" }}></i>
                                                <button
                                                    type="button"
                                                    className=" col-lg-2 col-sm-6 btn btn-outline-primary offset-lg-2"
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
                                                            <div className="content position-relative">
                                                                <button
                                                                    type="button"
                                                                    className="btn-close position-absolute top-0 end-0 mt-2 me-2 "
                                                                    aria-label="Close"
                                                                    onClick={() => setShow(false)}
                                                                ></button>
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
                                                    className=" col-sm-8 form-control w-50 m-auto text-center py-3"
                                                    id="feedback"
                                                    value={feedback}
                                                    onChange={(event) => setFeedback(event.target.value)}
                                                    required
                                                    placeholder="send your feedback"
                                                />
                                                <button type="submit" className="offset-sm-1 col-sm-2 btn btn-outline-primary"  >Send Feedback</button>
                                            </form>

                                        </div>
                                    ) : (
                                        <p>You already gave us feedback. Thank you!</p>
                                    )}
                                </div>
                            ) : (
                                <p>You must have a reservation first to rate and give feedback for us.</p>
                            )
                        ) : (
                            <p>You must be a Patient.</p>
                        )}


                    </div>


                </div>

            </div >

        </>
    );
}

export default ListOfDoctors;