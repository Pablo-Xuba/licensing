import React, { useState, useEffect } from 'react';
import licenseService from '../services/licenseService';
import { Link } from 'react-router-dom';

const LicenseList = () => {
    const [licenses, setLicenses] = useState([]);

    useEffect(() => {
        licenseService.getAll()
            .then(response => {
                setLicenses(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }, []);

    return (
        <div>
            <h3>Licenses</h3>
            <Link to="/add" className="btn btn-success">Add New License</Link>
            <table className="table">
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Type</th>
                        <th>Email</th>
                        <th>Issue Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {licenses && licenses.map((license, index) => (
                        <tr key={index}>
                            <td>{license.companyName}</td>
                            <td>{license.type}</td>
                            <td>{license.email}</td>
                            <td>{license.issueDate}</td>
                            <td>
                                <Link to={`/licenses/${license.id}`} className="btn btn-primary">Edit</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LicenseList;
