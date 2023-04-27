import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Image from "../../images/hair.svg"
import Pagination from 'react-bootstrap/Pagination';
import Search from "../Search/Search";

export default function Hair() {

  const [page, setPage] = useState("1")
  // useEffect(() => {
  //   axios.get("https://api.themoviedb.org/3/movie/popular", {
  //     params: {
  //       api_key: "9b743af1d4fde1d65af33c40dcccce87",
  //       page: page
  //     }
  //   })
  //     .then((mo) => setHair(mo.data.results))
  //     .catch((err) => console.log(err))
  // }, [page])
  const [Hair, setHair] = useState([]);
  const [users, SetUsers] = useState("")

  const Render_Treatments = () => {
    axios.get('http://127.0.0.1:8000/treatments?specilization=Hair Implant')
      .then(response => {
        const hairTreatments = response.data;
        setHair(hairTreatments);
      })
      .catch(err => { console.log(err) });;
  }

  useEffect(() => {
    Render_Treatments()
  }, [])

  const changePage = (e) => {

    setPage(e.target.text)
  }
  const Prev = (e) => {
    if (page <= '1') {
      setPage("1")
    } else {
      setPage(parseInt(page) - 1)

    }
  }
  const Next = (e) => {
    if (page >= "7") {
      setPage("7")

    } else {
      setPage(parseInt(page) + 1)

    }
  }



  //////////////// Search
  const ChangeInfo = async (e) => {
    if (e.target.value) {
      axios.post("http://localhost:8000/searchtreatments", { 'name': e.target.value, 'speicilization': 'Hair Implant' })
        .then(response => setHair(response.data.treatments)).catch(err => console.log(err))
    } else {
      Render_Treatments()
    }
  }


  return (
    <>
      <div className="container my-5">
        <div className='shadow mb-5' style={{ height: "8.7vh", background: "#72d5cae1", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <h1 style={{ color: "rgb(0, 51, 78)", fontSize: "3rem" }}><i class="fa-solid fa-stethoscope  me-2 ms-4"></i> Hair transplant
          </h1>
        </div>

        <div className="row">
          <i class="fa-solid fa-magnifying-glass fa-2x col-sm-3 text-end mt-1"></i>
          <form role="search" className="col-sm-6">
            <input
              style={{ width: "35vw" }}
              className="mx-auto  p-2 form-control rounded-pill border-5"
              type="search"
              placeholder={`    Search About  Hair treatments centers `}
              aria-label="Search"
              onChange={(e) => ChangeInfo(e)}
            />
          </form>
        </div>
        <div className="row g-4 my-4">
          <div className="col-lg-4 col-md-12 col-sm-12 text-center">
            <img src={Image} alt="Logo" />
            <p className="text-muted">We have the best doctors all over the world</p>
          </div>
          {Hair.length > 0 ? (
            Hair.map((item, index) => {
              return (
                <div className="col-lg-4 col-md-12 col-sm-12 text-center" key={index} movie={item}>
                  <Link className="btn btn-outline-light mb-2" to={`/detail/${item.id}`}>
                    <div className="position-relative overflow-hidden">
                      <div className="row mohamed overflow-hidden">
                        {item.picture ? (
                          <img
                            src={`http://127.0.0.1:8000/${item.picture}`}
                            alt="Movie"
                            className="w-100 overflow-hidden"
                            style={{ height: "330px" }}
                          />
                        ) : (
                          <img className="" src="https://image.tmdb.org/t/p/w500//sv1xJUazXeYqALzczSZ3O6nkH75.jpg" alt="Alternative" />
                        )}
                      </div>
                      <p className="position-absolute top-0 p-2 text-black" style={{ backgroundColor: "#D0E8F2" }}>
                        {parseFloat(item.rating).toFixed(1)}
                      </p>
                      <div></div>
                      <h3 style={{ backgroundColor: "#303e8e", }} className="shadow p-3 mb-5 py-3 text-white">{item.name}</h3>
                    </div>
                  </Link>
                </div>
              );
            })
          ) : (
            < div className="col-6 container d-flex justify-content-center align-items-center mt-5">
              <h2 style={{ color: "rgb(0, 44, 93)" }} className="animate__flash">No hair treatments  found</h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
