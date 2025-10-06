import React, { useState } from 'react';
import licenseService from '../services/licenseService';

const AddLicense = () => {
    const initialLicenseState = {
        id: null,
        companyName: "",
        type: "CTL",
        email: "",
        issueDate: ""
    };
    const [license, setLicense] = useState(initialLicenseState);
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setLicense({ ...license, [name]: value });
    };

    const saveLicense = () => {
        const data = {
            companyName: license.companyName,
            email: license.email,
            issueDate: license.issueDate,
            type: license.type
        };

        licenseService.create(data)
            .then(response => {
                setLicense({
                    id: response.data.id,
                    companyName: response.data.companyName,
                    email: response.data.email,
                    issueDate: response.data.issueDate,
                    type: response.data.type
                });
                setSubmitted(true);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const newLicense = () => {
        setLicense(initialLicenseState);
        setSubmitted(false);
    };

    return (
        <div className="submit-form">
            {submitted ? (
                <div>
                    <h4>You submitted successfully!</h4>
                    <button className="btn btn-success" onClick={newLicense}>
                        Add
                    </button>
                </div>
            ) : (
                <div>
                    <div className="form-group">
                        <label htmlFor="companyName">Company Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="companyName"
                            required
                            value={license.companyName}
                            onChange={handleInputChange}
                            name="companyName"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            required
                            value={license.email}
                            onChange={handleInputChange}
                            name="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="issueDate">Issue Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="issueDate"
                            required
                            value={license.issueDate}
                            onChange={handleInputChange}
                            name="issueDate"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <select className="form-control" id="type" name="type" value={license.type} onChange={handleInputChange}>
                            <option value="CTL">Cellular Telecommunications</option>
                            <option value="PRSL">Public Radio Station</option>
                        </select>
                    </div>

                    <button onClick={saveLicense} className="btn btn-success">
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddLicense;
