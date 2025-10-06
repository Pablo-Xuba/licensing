import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import licenseService from '../services/licenseService';

const License = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const initialLicenseState = {
        id: null,
        companyName: "",
        type: "CTL",
        email: "",
        issueDate: ""
    };
    const [currentLicense, setCurrentLicense] = useState(initialLicenseState);
    const [message, setMessage] = useState("");

    const getLicense = id => {
        licenseService.get(id)
            .then(response => {
                setCurrentLicense(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    useEffect(() => {
        if (id) {
            getLicense(id);
        }
    }, [id]);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentLicense({ ...currentLicense, [name]: value });
    };

    const updateLicense = () => {
        licenseService.update(currentLicense.id, currentLicense)
            .then(response => {
                setMessage("The license was updated successfully!");
            })
            .catch(e => {
                console.log(e);
            });
    };

    const deleteLicense = () => {
        licenseService.remove(currentLicense.id)
            .then(response => {
                navigate("/licenses");
            })
            .catch(e => {
                console.log(e);
            });
    };

    return (
        <div>
            {currentLicense ? (
                <div className="edit-form">
                    <h4>License</h4>
                    <form>
                        <div className="form-group">
                            <label htmlFor="companyName">Company Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="companyName"
                                name="companyName"
                        value={currentLicense.companyName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                className="form-control"
                                id="email"
                                name="email"
                                value={currentLicense.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="issueDate">Issue Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="issueDate"
                                name="issueDate"
                                value={currentLicense.issueDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </form>

                    <button className="btn btn-danger" onClick={deleteLicense}>
                        Delete
                    </button>

                    <button
                        type="submit"
                        className="btn btn-success"
                        onClick={updateLicense}
                    >
                        Update
                    </button>
                    <p>{message}</p>
                </div>
            ) : (
                <div>
                    <br />
                    <p>Please click on a License...</p>
                </div>
            )}
        </div>
    );
};

export default License;
