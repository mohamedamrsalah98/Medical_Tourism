import { useEffect, useRef, useState } from 'react';
import jwtDecode from 'jwt-decode';
import axios from "axios";
import Paypal from '../components/Paypal/Paypal';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './profile.css';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





function Profile({ setData }) {


  // ############################# get data from token ########################################

  const [photo, setPhoto] = useState([]);
  const [newPhoto, setNewPhoto] = useState([]);
  const [medicalreservationData, setMedicalReservationData] = useState([]);
  const [tourismreservationData, setTourismReservationData] = useState([]);
  const [getPayment, setGetPayment] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reservationId, setReservationId] = useState(false);
  const [reservations, setReservations] = useState([])
  const userIdRef = useRef("");
  const [inputvalue, setValue] = useState({
    emailValue: "",
    nameValue: "",
    ageValue: "",
    passwordValue: "",
    role: "",
    id: "",
  })
  const GetUserData = jwtDecode(localStorage.getItem('token'));
  const [userRole, setuserRole] = useState("")

  useEffect(() => {
    const GetUserData = jwtDecode(localStorage.getItem('token'));
    setuserRole(GetUserData.role)
    AOS.init();
    setValue({
      emailValue: GetUserData.email,
      nameValue: GetUserData.first_name,
      ageValue: GetUserData.age,
      passwordValue: GetUserData.Password,
      rolevalue: GetUserData.role,
      id: GetUserData.user_id,
    }
    )

    // ################################# get profile photo from api  ######################################

    axios.get(`http://127.0.0.1:8000/one_user_api/${GetUserData.user_id}`)

      .then(response => {
        setPhoto(response.data.picture);
      })
      .catch(error => {
        console.log(error);
      });

    // ################################ medical reservationData ################################


    if (GetUserData.role === "Patient") {
      axios.post("http://127.0.0.1:8000/medical_reservation_data", { 'user': GetUserData.user_id }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          const data = response.data;
          setMedicalReservationData(data);

        })
        .catch(error => {
          console.log(error);
        });
    }


    // ################################ tourism reservationData ################################

    if (GetUserData.role === "Tourist") {
      axios.post("http://127.0.0.1:8000/tourism_reservation_data", { 'user': GetUserData.user_id }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          const data = response.data;
          setTourismReservationData(data);

        })
        .catch(error => {
          console.log(error);
        });
    }

  }, [photo])

  // ######################### update image and send to api #########################

  const handlePhotoChange = (e) => {
    setNewPhoto(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('picture', newPhoto);
    axios.put(`http://127.0.0.1:8000/one_user_api/${GetUserData.user_id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        setPhoto(response.data.picture);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleDeleteReservation = (id) => {
    setReservationId(id);
    setShowModal(true);
  };
  const Render_Reseravtions = (userId) => {
    if (GetUserData.role === "Patient") {
      axios.post("http://127.0.0.1:8000/medical_reservation_data", { 'user': GetUserData.user_id }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          const data = response.data;
          setMedicalReservationData(data);

        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  // ################################## render reservations #################################
  const Render_Tourism_Reseravtions = (userId) => {
    if (GetUserData.role === "Tourist") {
      axios.post("http://127.0.0.1:8000/tourism_reservation_data", { 'user': GetUserData.user_id }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          const data = response.data;
          setTourismReservationData(data);

        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  // ##################################### Cancel reservation ################################
  async function cancelReservation() {
    try {
      const response = await fetch(`http://127.0.0.1:8000/one_medical_reservation/${reservationId}`, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        toast.success('This reservation deleted successfully.');
      }
      setShowModal(false)
    } catch (error) {
      toast.error('An error occurred while deleting the doctor.');
    }
    Render_Reseravtions(GetUserData.user_id)

  }
  // ##################################### Cancel Tourism reservation ################################

  async function cancelToursimReservation() {
    try {
      const response = await fetch(`http://127.0.0.1:8000/one_tourism_reservation/${reservationId}`, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        toast.success('This reservation deleted successfully.');
      }
      setShowModal(false)
    } catch (error) {
      toast.error('An error occurred while deleting the doctor.');
    }
    Render_Tourism_Reseravtions(GetUserData.user_id)

  }

  // ############################# edit data and store data in Api ########################################
  const [info, setInfo] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
  })
  const [dis, setDisabled] = useState(false)

  const EditData = async (e) => {
    if (e.target.innerHTML === 'Update') {
      e.target.innerHTML = 'Save'
      setDisabled(true)
    } else {
      if (error.passwordErr.trim().length !== 0 || error.nameErr.trim().length !== 0 || error.ageErr.trim().length !== 0) {
        e.preventDefault()
      } else {
        e.target.innerHTML = 'Update'
        setDisabled(false)
        const UserData = {
          FullName: info.name || inputvalue.nameValue,
          age: info.age || inputvalue.ageValue,
          Email: inputvalue.emailValue,
          role: inputvalue.rolevalue,
          Password: info.password || inputvalue.passwordValue,
          RepeatPassword: info.password || inputvalue.passwordValue
        }
        const response = await axios.put(`http://127.0.0.1:8000/one_user_api/${inputvalue.id}`, UserData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        localStorage.setItem("token", response.data.token);
        setData();

      }
    }
  }

  // #########################################  validation #########################################

  const [error, setErr] = useState({
    passwordErr: " ",
    nameErr: " ",
    ageErr: " ",
  })

  const ValidateData = (e) => {
    if (e.target.name === "password") {
      if (inputvalue.passwordValue.length === "0") {
        setErr({
          ...error,
          passwordErr: "Password is required"
        })
        e.target.style.border = "2px solid red"
        e.target.style.outline = "none"
      } else if (inputvalue.passwordValue.length < 8) {
        setErr({
          ...error,
          passwordErr: "Password must be at least 8 characters"
        })
        e.target.style.border = "2px solid red"
        e.target.style.outline = "none"
      } else if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i.test(inputvalue.passwordValue)) {
        setErr({
          ...error,
          passwordErr: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
        })
        e.target.style.border = "2px solid red"
        e.target.style.outline = "none"
      } else {
        setInfo({
          ...info,
          password: inputvalue.passwordValue
        })
        setErr({
          ...error,
          passwordErr: ""
        })
        e.target.style.border = "2px solid green"
      }

    } else if (e.target.name === 'age') {
      if (inputvalue.ageValue > 80) {
        setErr({
          ...error,
          ageErr: "Age can't be more than 80"
        })
        e.target.style.border = "2px solid red"
        e.target.style.outline = "none"
      } else if (inputvalue.ageValue < 18) {
        setErr({
          ...error,
          ageErr: "Age can't be less than 18"
        })
        e.target.style.border = "2px solid red"
        e.target.style.outline = "none"
      }
      else {
        setInfo({
          ...info,
          age: inputvalue.ageValue
        })
        setErr({
          ...error,
          ageErr: ""
        })
        e.target.style.border = "2px solid green"
      }
    }
    else {
      if (inputvalue.nameValue.length === "0") {
        setErr({
          ...error,
          nameErr: "Name is required"
        })
        e.target.style.border = "2px solid red"
        e.target.style.outline = "none"
      } else if (!/([a-zA-Z])\w+/i.test(inputvalue.nameValue)) {
        setErr({
          ...error,
          nameErr: "Please enter character only"
        })
        e.target.style.border = "2px solid red"
        e.target.style.outline = "none"
      } else {
        setInfo({
          ...info,
          name: inputvalue.nameValue
        })
        setErr({
          ...error,
          ...error,
          nameErr: ""
        })
        e.target.style.border = "2px solid green"

      }
    }
  }

  const ChangeInfo = (e) => {
    if (e.target.name === "password") {
      setValue({
        ...inputvalue,
        passwordValue: e.target.value
      })

    }
    else if (e.target.name === 'name') {
      setValue({
        ...inputvalue,
        nameValue: e.target.value
      })

    }
    else if (e.target.name === 'age') {
      setValue({
        ...inputvalue,
        ageValue: e.target.value
      })
    }
  }

  useEffect(() => {
    medicalreservationData.forEach((reservation) => {
      axios
        .post("http://127.0.0.1:8000/get_payment", {
          treatment_center: reservation.treatment_center,
          user_id: GetUserData.user_id,
        })
        .then((response) => {
          setPaymentData(paymentData => [...paymentData, response.data]);
        })
        .catch((error) => {
          console.log("error", error.response.data);
        })
    });
    tourismreservationData.forEach((reservation) => {
      console.log(reservation)
      axios
        .post("http://127.0.0.1:8000/tourism_get_payment", {
          tourism_company: reservation.tourism_company,
          user_id: GetUserData.user_id,
        })
        .then((response) => {
          setPaymentData(paymentData => [...paymentData, response.data]);
        })
        .catch((error) => {
          console.log("error", error.response.data);
        })
    });

  }, []);


  return (
    <>
      <div style={{ height: "8.7vh", background: "rgba(174, 224, 219, 0.89)" }}></div>
      <div className="container-fluid">
        <div className="row">
          <div className="left col-lg-4 col-sm-12 overflow-hidden" style={{ height: "91.3vh", background: "#72d5ca8a" }}>
            <form onSubmit={handleSubmit}>
              <div className='rounded-circle d-flex justify-content-center align-items-center m-auto mt-5 shadow position-relative bg-light' style={{ width: "25vh", height: "25vh" }}>
                <div className='w-75 overflow-hidden m-auto text-center'>
                  <img src={`http://127.0.0.1:8000/${photo}`} className="card-img-top img-thumbnail img-fluid w-75" alt='amr' />
                </div>
                <div className='rounded-circle bg-primary m-auto d-flex justify-content-center p-3  hi' style={{ width: "fit-content" }}>
                  <label htmlFor="ChangeProfile" ><i class="fa-solid fa-camera fa-2x text-primary text-white"></i></label>
                  <input className='d-none' id="ChangeProfile" type="file" accept='image/png, image/jpg, image/jpeg' onChange={(e) => handlePhotoChange(e)} />
                </div>
              </div>
            </form>

            <div className='container mt-5'>
              <form className='w-75 m-auto text-center' onSubmit={handleSubmit}>
                <div className="text-start">
                  <label htmlFor="Name" className="form-label ms-3">Name</label>
                  <div className='row'>
                    <div className='col-sm-12'>
                      <input onChange={(e) => ChangeInfo(e)} onKeyUp={(e) => ValidateData(e)} type="text" className="form-control text-start" id="username" value={inputvalue.nameValue} disabled={!dis} name='name' />
                    </div>
                    <p className="text-danger fw-bold"> {error.nameErr}</p>
                  </div>
                </div>
                <div className=" text-start">
                  <label htmlFor="exampleInputEmail1 " className="form-label ms-3">Email</label>
                  <div className='row'>
                    <div className='col-sm-12 mb-3'>
                      <input type="email" name='email' className="form-control text-start" id="useremail" value={inputvalue.emailValue} disabled />
                    </div>
                  </div>
                </div>
                <div className="text-start">
                  <label htmlFor="exampleInputPassword1" className="form-label ms-3">Age</label>
                  <div className='row'>
                    <div
                      className='col-sm-12'>
                      <input onChange={(e) => ChangeInfo(e)} onKeyUp={(e) => ValidateData(e)} type="number" name='age' className="form-control text-start" id="age" value={inputvalue.ageValue} disabled={!dis} />
                    </div>
                    <p className="text-danger  fw-bold"> {error.ageErr}</p>
                  </div>
                </div>
                <div className="text-start">
                  <label htmlFor="exampleInputPassword1" className="form-label ms-3">Password</label>
                  <div className='row'>
                    <div className='col-sm-12'>
                      <input type="password" onChange={(e) => ChangeInfo(e)} onKeyUp={(e) => ValidateData(e)} className="form-control text-start" name='password' id="userpassword" value={inputvalue.passwordValue} disabled={!dis} />
                    </div>
                    <p className="text-danger fw-bold"> {error.passwordErr}</p>
                  </div>
                </div>
                <div className='row mt-5'>
                  <button onClick={(e) => { EditData(e) }} id="btn" type="button" className="btn btn-primary px-3 py-2 col-sm-7 m-auto" >Update</button>
                  <button type="submit" className="btn btn-primary px-3 py-2 mt-4 col-sm-7 m-auto" >save</button>
                </div>
              </form>
            </div>
          </div>

          {/* ######################  Rservation ######################## */}

          <div className="right col-lg-8 px-5 mt-5 col-sm-12" style={{ height: "86vh" }}>
            {userRole === "Patient" ? (<>    <div className='shadow mb-5 col-sm-12' style={{ height: "8.7vh", background: "#72d5ca8a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <h1 style={{ color: "rgb(46, 79, 122)", fontSize: "3rem" }}><i className="fa-solid fa-stethoscope"></i> Medical Reservation</h1>
            </div>
              <div className="table-responsive container">
                <table className="table table-Light">
                  <thead>
                    <tr className="font-bold fs-4">
                      <th className="py-3">Doctor Name</th>
                      <th className="py-3">Start Date</th>
                      <th className="py-3">End Data</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Payment</th>
                      <th className="py-3"></th>

                    </tr>
                  </thead>
                  <tbody>

                    {medicalreservationData.length > 0 ? (medicalreservationData.map((reservation, i) => (
                      <tr key={reservation.id}
                        data-aos="fade-up"
                        data-aos-delay={`${i + 7}00`}
                        duration='400'
                        easing='ease'
                        offset='120'
                        styte={`vertical-align: baseline !important`}  >


                        <td className="" style={{ verticalAlign: 'middle' }} >
                          <h3 className="h5">{reservation.doctor.name}</h3>
                        </td>
                        <td className="" style={{ verticalAlign: 'middle' }} >
                          <h3 className="h5">{reservation.start_time}</h3>
                        </td>
                        <td style={{ verticalAlign: 'middle' }} >
                          <p className="h5">{reservation.end_time} </p>
                        </td>

                        <td style={{ verticalAlign: 'middle' }} className={`status ${reservation.status === 'Accepted' ? 'text-success' : reservation.status === 'Rejected' ? 'text-danger' : 'text-muted'} h5`}>
                          {reservation.status}
                        </td>
                        <td style={{ verticalAlign: 'middle' }} >
                          <div className="h5">{reservation.status == "Accepted" ? <Paypal user={GetUserData.user_id} treatment={reservation.treatment_center} /> : reservation.status == "Rejected" ? "Your reservation is rejected" : "Wait for your reservation to be accepted"} </div>
                        </td>
                        {reservation.status == "Pending Aprroval" &&
                          <td style={{ verticalAlign: 'middle' }} >
                            <div className="h5"> <button className='btn btn-outline-danger' onClick={() => handleDeleteReservation(reservation.id)}>Cancel</button>  </div>
                          </td>}
                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                          <Modal.Header closeButton>
                            <Modal.Title>Cancel Reservation</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>


                            Are you sure you want to cancel this Reservation with <strong>Dr. {reservation.doctor.name}</strong> ?
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                              No
                            </Button>
                            <Button variant="danger" onClick={cancelReservation} >
                              Yes
                            </Button>
                          </Modal.Footer>
                        </Modal>


                      </tr>
                    ))) : (<tr>
                      <td colSpan="5" className="text-center">No reservations found.</td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            </>) : (<>     <div className='my-4 shadow' style={{ height: "8.7vh", background: "#72d5ca8a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <h1 style={{ color: "#fff", fontSize: "3rem" }}><i className="fa-solid fa-stethoscope  me-2 ms-4"></i> Tourism Reservation</h1>
            </div>
              <div className="table-responsive container">
                <table className="table table-Light">
                  <thead>
                    <tr className="fs-4 font-bold">
                      <th className="py-3">Tourism Place</th>
                      <th className="py-3">Start Date</th>
                      <th className="py-3">End Date</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Payment</th>
                      <th className="py-3"></th>

                    </tr>

                  </thead>


                  <tbody>
                    {tourismreservationData.length > 0 ? (tourismreservationData.map((reservation, i) => (
                      <tr key={reservation.id}
                        data-aos="fade-up"
                        data-aos-delay={`${i + 7}00`}
                        duration='400'
                        easing='ease'
                        offset='120'
                        styte={`vertical-align: baseline !important`}  >


                        <td className="" style={{ verticalAlign: 'middle' }} >
                          <h3 className="h5">{reservation.tourism_places.name}</h3>
                        </td>
                        <td className="" style={{ verticalAlign: 'middle' }} >
                          <h3 className="h5">{reservation.start_time}</h3>
                        </td>
                        <td style={{ verticalAlign: 'middle' }} >
                          <p className="h5">{reservation.end_time} </p>
                        </td>
                        <td style={{ verticalAlign: 'middle' }} className={`status ${reservation.status === 'Accepted' ? 'text-success' : reservation.status === 'Rejected' ? 'text-danger' : 'text-muted'} h5`}>
                          {reservation.status}
                        </td>
                        <td style={{ verticalAlign: 'middle' }} >
                          <div className="h5">{reservation.status == "Accepted" ? <Paypal start={reservation.start_time} end={reservation.end_time} user={GetUserData.user_id} tourism={reservation.tourism_company} /> : reservation.status == "Rejected" ? "Your reservation is rejected" : "Wait for your reservation to be accepted"}</div>
                        </td>

                        {reservation.status == "Pending Aprroval" &&
                          <td style={{ verticalAlign: 'middle' }} >
                            <div className="h5"> <button className='btn btn-outline-danger' onClick={() => handleDeleteReservation(reservation.id)}>Cancel</button>  </div>
                          </td>}
                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                          <Modal.Header closeButton>
                            <Modal.Title>Cancel Reservation</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>


                            Are you sure you want to cancel this Reservation in <strong>{reservation.tourism_places.name}</strong> ?
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                              No
                            </Button>
                            <Button variant="danger" onClick={cancelToursimReservation} >
                              Yes
                            </Button>
                          </Modal.Footer>
                        </Modal>


                      </tr>
                    ))) : (<tr>
                      <td colSpan="5" className="text-center">No reservations found.</td>
                    </tr>)}
                  </tbody>
                </table>
              </div></>)}



          </div>
        </div>
      </div>
    </>
  )
}
export default Profile;