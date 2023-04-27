import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import Search from "../components/Search/Search";
import AOS from 'aos';
import 'aos/dist/aos.css';
import jwtDecode from 'jwt-decode';
import { Modal, Button, Form } from 'react-bootstrap';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";


function TourismCompany() {

    const [Places, setPlaces] = useState([]);
    const [reservations, setReservations] = useState([])
    const [feedbacks, setFeedbacks] = useState([])

    const userIdRef = useRef("");
    ///////////////////////// pagination places /////////////
    const [Doctorpage, setDoctorPage] = useState("1");
    const DoctorpageSize = 4;
    const dcotorstart = (Doctorpage - 1) * DoctorpageSize;
    const doctorend = dcotorstart + DoctorpageSize;
    const currentPagedoctor = Places.slice(dcotorstart, doctorend);
    const doctortotalPages = Math.ceil(Places.length / DoctorpageSize);

    const Render_feedbacks = (userId) => {
        console.log(userId)
        axios.post('http://127.0.0.1:8000/tourism_company_feedbacks', { 'tourism_company_id': userId }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            setFeedbacks(response.data.feedbacks);
        })


    }


    function handlePreviousDoctorPage() {
        setDoctorPage((prevPage) => Math.max(prevPage - 1, 1));
    }
    function handleNextDoctorPage() {
        setDoctorPage((prevPage) => Math.min(prevPage + 1, doctortotalPages));
    }
    /////////////////////////////////////////////////////////
    //////////////////pagination reservations //////////////////
    const [page, setPage] = useState("1");

    const pageSize = 5;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const currentPageFeedback = reservations.slice(start, end);
    const totalPages = Math.ceil(reservations.length / pageSize);

    function handlePreviousPage() {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
    }
    function handleNextPage() {
        setPage((prevPage) => Math.min(prevPage + 1, totalPages));
    }
    ///////////////////////////

    ///////////////////////////////////////////////
    const Render_Places = (userId) => {

        axios.post("http://127.0.0.1:8000/tourism_company_places", { 'id': userId }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            setPlaces(response.data.places)
        }).catch(error => { console.log(error) })
    }

    const Render_Reseravtions = (userId) => {

        axios.post("http://127.0.0.1:8000/tourism_company_reservations", { 'id': userId }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            setReservations(response.data.reservations)

        }).catch(error => { console.log(error) })
    }
    ///////////////// feedbacks
    const [showModalreply, setShowModalReply] = useState(false)
    const [feedback_id, setFeedbackId] = useState(null)



    const sendfeedbackemail = (id) => {
        setShowModalReply(true)
        setFeedbackId(id)
    }
    const [replyBody, setreplyBody] = useState("")
    const emailreplyinfo = async (e) => {
        setreplyBody(e.target.value)
    }

    const sendemailreply = async (id) => {
        const UserData = {
            feedback_id: feedback_id

        }
        try {
            const response = await axios.post(`http://127.0.0.1:8000/one_tourism_feedback`, UserData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (replyBody.length === 0) {
                    toast.error("please dont forget to enter your response")
                } else {

                    const EmailData = {
                        body: replyBody,
                        user_email: response.data.user.Email,
                        feedback: response.data.feedback,
                        tourism_company_id: response.data.tourism_company,
                        feedback_user: response.data.user.FullName,
                        user_id: response.data.user.id
                    }

                    const { feedback_email } = axios.post('http://127.0.0.1:8000/reply_tourism_feedback', EmailData, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })

                    Render_feedbacks(userIdRef.current);
                    toast.success("Reply sent successfully")
                    setShowModalReply(false)
                }

            });
        } catch (error) {
            toast.error('An error occurred while sending the email.');
        }
    }
    ///////////////// feedback pagination////////
    const [feedbackpage, setfeedbackPage] = useState("1");

    const feedbackpageSize = 2;
    const feedbackstart = (feedbackpage - 1) * feedbackpageSize;
    const feedbackend = feedbackstart + feedbackpageSize;
    const currentPagefeedback = feedbacks.slice(feedbackstart, feedbackend);
    const feedbacktotalPages = Math.ceil(reservations.length / feedbackpageSize);

    function handlePreviousfeedbackPage() {
        setfeedbackPage((prevPage) => Math.max(prevPage - 1, 1));
    }
    function handleNextfeedbackPage() {
        setfeedbackPage((prevPage) => Math.min(prevPage + 1, feedbacktotalPages));
    }

    //////////////////////////// First render 
    useEffect(() => {
        AOS.init();
        const GetUserData = jwtDecode(localStorage.getItem('token'));

        axios.get(`http://127.0.0.1:8000/tourism/${GetUserData.email}`)
            .then(response => {
                const userId = response.data.id;
                userIdRef.current = userId;
                Render_Places(userId)
                Render_Reseravtions(userId)
                Render_feedbacks(userId)

            })
            .catch(error => {
                console.log(error);
            });

    }, []);
    /////////////////////////////////////////// delete 
    const [palcetoDelete, setPlaceToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModalres, setShowModalRes] = useState(false);
    const [showModalrej, setShowModalRej] = useState(false);
    const [reservationId, setReservationId] = useState(null)

    const handleDelete = (id) => {
        setPlaceToDelete(id);
        setShowModal(true);
    };
    const handleApproveClick = (id) => {
        setShowModalRes(true);
        setReservationId(id);
    }

    // define a separate function to handle the onClick event of the Cancel button
    const handleCancelClick = (id) => {
        setShowModalRej(true);
        setReservationId(id);
    }
    const deletePlaces = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/delete_place/${palcetoDelete}`, {
                method: 'DELETE'
            });
            if (response.status === 200) {
                toast.success('Place deleted successfully.');
            } else {
                toast.error('Place has reservations and cannot be deleted.');
            }
            setShowModal(false);
        } catch (error) {
            toast.error('An error occurred while deleting the doctor.');
            console.error(error);
        }
        Render_Places(userIdRef.current)

        Render_Reseravtions(userIdRef.current)


    };
    ///////////////////////////////////////////////////////////////////////////////////////
    const [body, setBody] = useState("")


    const ApproveReserv = async () => {
        const UserData = {
            status: 'Accepted',
        }
        try {
            const response = await axios.put(`http://127.0.0.1:8000/one_tourism_reservation/${reservationId}`, UserData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            axios.get(`http://127.0.0.1:8000/one_tourism_reservation/${reservationId}`).then(response => {
                const Email_Data = {
                    user_email: response.data.user.Email,
                    status: "Accepted",
                    start_date: response.data.start_time,
                    end_date: response.data.end_time,
                    body: body
                }
                try {
                    const { email } = axios.post('http://127.0.0.1:8000/accept_email', Email_Data, {
                        headers: { 'Content-Type': 'application/json' }
                    })
                    toast.success("Email sent successfully")
                }
                catch (e) {
                    console.log(e)
                }
            }
            )
            Render_Reseravtions(userIdRef.current);
            setShowModalRes(false);

            toast.success('Reservation Accepted successfully.');
        } catch (error) {
            toast.error('An error occurred while approving the reservation.');
        }
    }
    const RejectReserv = async () => {
        const UserData = {
            status: 'Rejected',
        }
        try {
            const response = await axios.put(`http://127.0.0.1:8000/one_tourism_reservation/${reservationId}`, UserData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            axios.get(`http://127.0.0.1:8000/one_tourism_reservation/${reservationId}`).then(response => {
                const Email_Data = {
                    user_email: response.data.user.Email,
                    status: "Rejected",
                    start_date: response.data.start_time,
                    end_date: response.data.end_time,
                    body: body
                }
                try {
                    const { email } = axios.post('http://127.0.0.1:8000/reject_email', Email_Data, {
                        headers: { 'Content-Type': 'application/json' }
                    })
                    toast.success("Email sent successfully")
                }
                catch (e) {
                    console.log(e)
                }
            }
            )

            Render_Reseravtions(userIdRef.current);
            setShowModalRej(false);
            toast.warning('Reservation rejected successfully.');
        } catch (error) {
            toast.error('An error occurred while rejecting the reservation.');
        }
    }
    const emailinfo = async (e) => {
        setBody(e.target.value)
    }

    const ChangeInfo = async (e) => {
        const GetUserData = jwtDecode(localStorage.getItem('token'));

        if (e.target.value) {

            axios.get(`http://127.0.0.1:8000/tourism/${GetUserData.email}`).then(data => {
                const userId = data.data.id
                const info = {
                    name: e.target.value,
                    id: userId
                }
                axios.post("http://127.0.0.1:8000/searchPlaces", info, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    setPlaces(response.data.places)


                }).catch(error => { console.log(error) })
            }
            )
        } else {
            axios.get(`http://127.0.0.1:8000/tourism/${GetUserData.email}`).then(data => {
                const userId = data.data.id
                Render_Places(userId)
            }).catch(error => { console.log(error) })
        }
    }

    return (
        <>
            <div className="" style={{ height: "12vh" }}></div>
            <form role="search" className="mt-3 mb-5">
                <input
                    style={{ width: "35vw" }}
                    className="mx-auto  p-2 form-control rounded-pill"
                    type="search"
                    placeholder={`      Search About Doctors Availble Now`}
                    aria-label="Search"
                    onChange={(e) => ChangeInfo(e)}
                />
            </form>            <div className="container">
                <div className="mb-2">
                    <h2 className="mb-4 float-start "><i class="fa-solid fa-gear me-2"></i> List of Places</h2>
                    <div className="float-end  mb-4">
                        <Link
                            type="button"
                            className="btn btn-outline-info"
                            to="/AddTourismPlaces"
                        >
                            Add New Place
                        </Link>
                        <button onClick={() => window.print()} className="btn btn-outline-info mx-3" title="Print"><i class="fa-solid fa-print fa-fade"></i></button>

                    </div>
                </div>
                <div className="clearfix"></div>

                <div className="table-responsive container">
                    <table className="table table-Light">
                        <thead>
                            <tr className="p-3">
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Rating</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Places.length > 0 ? (currentPagedoctor.map((place, i) => (
                                <tr key={place.id}
                                    data-aos="fade-up"
                                    data-aos-delay={`${i + 7}00`}
                                    duration='400'
                                    easing='ease'
                                    offset='120'
                                    styte={`vertical-align: baseline !important`}  >
                                    <td>
                                        <div
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                                borderRadius: "50%",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <img
                                                src={`http://127.0.0.1:8000/${place.image}`}
                                                alt={place.name}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "contain",
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="" style={{ verticalAlign: 'middle' }} >
                                        <h3 className="h5">{place.name}</h3>
                                    </td>
                                    <td style={{ verticalAlign: 'middle' }} >
                                        <p>{place.rating} </p>
                                    </td>
                                    <td style={{ verticalAlign: 'middle' }}>

                                        <Link
                                            className="btn btn-outline-secondary shadow"

                                            to={`/Updateplace/${place.id}`}
                                        >
                                            Update
                                        </Link>
                                    </td>

                                    <td style={{ verticalAlign: 'middle' }}>
                                        <button
                                            className="btn btn-outline-danger shadow"
                                            onClick={() => handleDelete(place.id)}
                                        >
                                            Delete
                                        </button>
                                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Delete Place</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                Are you sure you want to delete this <strong>place</strong> and all the reservations for this doctor?
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={() => setShowModal(false)}>
                                                    Cancel
                                                </Button>
                                                <Button variant="danger" onClick={deletePlaces}>
                                                    Delete
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>

                                    </td>

                                </tr>
                            ))) : (<tr>
                                <td colSpan="5" className="text-center">No Places found.</td>
                            </tr>)}
                            <div className="d-flex justify-content-center mt-5 align-items-center pb-4">
                                <BsChevronLeft className="me-3 fw-bold" size={30} onClick={handlePreviousDoctorPage} style={{ cursor: "pointer" }} />
                                <span className="me-2">
                                    Page {Doctorpage} of {doctortotalPages}
                                </span>
                                <BsChevronRight className="ms-3" size={30} onClick={handleNextDoctorPage} style={{ cursor: "pointer" }} />
                            </div>
                        </tbody>
                    </table>
                </div>

                <h2 className="mt-5 mb-4 float-start "><i class="fa-solid fa-gear me-2"></i> Reservations</h2>

                <div style={{ marginBottom: "10%" }} className="table-responsive container">
                    <table className="table table-Light">
                        <thead>
                            <tr className="py-5 fs-bolder ">
                                <th>Place Name</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Price</th>
                                <th>Accept</th>
                                <th>Reject</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.length > 0 ? (currentPageFeedback.map((place, i) => (
                                <tr key={place.id}
                                    data-aos="fade-up"
                                    data-aos-delay={`${i + 7}00`}
                                    duration='400'
                                    easing='ease'
                                    offset='120'
                                    styte={`vertical-align: baseline !important`}
                                    className="p-5"
                                >

                                    <td className="" style={{ verticalAlign: 'middle' }} >
                                        <h3 className="h6">{place.tourism_places.name}</h3>
                                    </td>
                                    <td style={{ verticalAlign: 'middle' }} >
                                        <p>{place.start_time.split("T")[0]} </p>
                                    </td>
                                    <td style={{ verticalAlign: 'middle' }} >
                                        <p>{place.end_time.split("T")[0]} </p>
                                    </td>
                                    <td style={{ verticalAlign: 'middle' }} >
                                        <p>{place.status} </p>
                                    </td>
                                    <td style={{ verticalAlign: 'middle' }} >
                                        <p>{place.price} </p>
                                    </td>
                                    {place.status === "Pending Aprroval" ? (
                                        <>
                                            <td>
                                                <button type="button" onClick={() => handleApproveClick(place.id)} className={`btn btn-outline-info shadow`}>
                                                    Approve
                                                </button>

                                            </td>
                                            <td>
                                                <button type="button" onClick={() => handleCancelClick(place.id)} className={`btn btn-outline-danger shadow`}>
                                                    Cancel
                                                </button>                                           </td>
                                        </>

                                    ) : place.status === "Accepted" ?
                                        <>
                                            <td>
                                                <i class="fa-solid fa-check fa-beat fa-2x" style={{ color: "#0fbd12" }}></i>                                                                              </td>
                                            <td>
                                                <i class="fa-solid fa-xmark fa-beat fa-2x" style={{ color: "#e62b0a" }}></i>                                                                                         </td>
                                        </> : <>
                                            <td>
                                                <i class="fa-solid fa-xmark fa-beat fa-2x" style={{ color: "#e62b0a" }}></i>                                                                                         </td>

                                            <td>
                                                <i class="fa-solid fa-check fa-beat fa-2x" style={{ color: "#0fbd12" }}></i>                                                                                         </td>
                                        </>}
                                    <Modal show={showModalres} onHide={() => setShowModalRes(false)}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Confirm Action</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <p> Are you sure you want to approve this reservation?
                                            </p>
                                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                                <Form.Label>Add any notes or comments:</Form.Label>
                                                <Form.Control name="acceptemail" onChange={(e) => emailinfo(e)} as="textarea" rows={3} />
                                            </Form.Group>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => setShowModalRes(false)}>
                                                No
                                            </Button>
                                            <Button variant="danger" onClick={() => ApproveReserv(place.id)}>
                                                Yes
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>

                                    <Modal show={showModalrej} onHide={() => setShowModalRej(false)}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Confirm Action</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <p>Are you sure you want to reject this reservation?</p>
                                            <Form.Group controlId="exampleForm.ControlTextarea2">
                                                <Form.Label>Add any notes or comments:</Form.Label>
                                                <Form.Control name="emailbody" onChange={(e) => emailinfo(e)} as="textarea" rows={3} />
                                            </Form.Group>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => setShowModalRej(false)}>
                                                No
                                            </Button>
                                            <Button variant="danger" onClick={() => RejectReserv(place.id)}>
                                                Yes
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>

                                </tr>



                            ))) : (<tr>
                                <td colSpan="7" className="text-center">No Reservations found.</td>
                            </tr>)}
                            <div className="d-flex justify-content-center mt-5 align-items-center pb-4">
                                <BsChevronLeft className="me-3 fw-bold" size={30} onClick={handlePreviousPage} style={{ cursor: "pointer" }} />
                                <span className="me-2">
                                    Page {page} of {totalPages}
                                </span>
                                <BsChevronRight className="ms-3" size={30} onClick={handleNextPage} style={{ cursor: "pointer" }} />
                            </div>


                        </tbody>
                    </table>

                </div>
                <h2 className="my-5 float-start "><i class="fa-solid fa-gear me-2"></i> Feedbacks</h2>


                <div className="table-responsive container">
                    <table className="table table-Light">
                        <thead>
                            <tr className="p-3">
                                <th>Photo</th>
                                <th>Patient</th>
                                <th>Feedback</th>
                                <th>Reply</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbacks.length > 0 ? (currentPagefeedback.map((place, i) => (
                                <tr key={place.id}
                                    data-aos="fade-up"
                                    data-aos-delay={`${i + 7}00`}
                                    duration='400'
                                    easing='ease'
                                    offset='120'
                                    styte={`vertical-align: baseline !important`}  >

                                    <td>
                                        <div
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                                borderRadius: "50%",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <img
                                                src={`http://127.0.0.1:8000/${place.user.picture}`}
                                                alt={place.name}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "contain",
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="" style={{ verticalAlign: 'middle' }} >
                                        <h3 className="h5">{place.user.FullName}</h3>
                                    </td>
                                    <td style={{ verticalAlign: 'middle' }} >
                                        <p>{place.feedback} </p>
                                    </td>
                                    <td style={{ verticalAlign: 'middle' }}>
                                        {place.isreplied === false ? (<button type="button" onClick={() => sendfeedbackemail(place.id)} className={`btn btn-outline-info shadow`}>
                                            Reply
                                        </button>) : (<span>replied</span>)}


                                    </td>

                                    <Modal show={showModalreply} onHide={() => setShowModalReply(false)}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Send  Reply</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <p>Please enter your reply</p>
                                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                                <Form.Label>Add your reply:</Form.Label>
                                                <Form.Control name="replyemail" onChange={(e) => emailreplyinfo(e)} as="textarea" rows={4} />
                                            </Form.Group>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => setShowModalReply(false)}>
                                                No
                                            </Button>
                                            <Button variant="danger" onClick={() => sendemailreply(place.id)}>
                                                Yes
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>

                                </tr>
                            ))) : (<tr>
                                <td colSpan="5" className="text-center">No feedbacks found.</td>
                            </tr>)}
                            <div className="d-flex justify-content-center mt-5 align-items-center pb-4">
                                <BsChevronLeft className="me-3 fw-bold" size={30} onClick={handlePreviousfeedbackPage} style={{ cursor: "pointer" }} />
                                <span className="me-2">
                                    Page {feedbackpage} of {feedbacktotalPages}
                                </span>
                                <BsChevronRight className="ms-3" size={30} onClick={handleNextfeedbackPage} style={{ cursor: "pointer" }} />
                            </div>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
export default TourismCompany;