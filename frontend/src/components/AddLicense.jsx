import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import licenseService from '../services/licenseService';

const AddLicense = () => {
    const navigate = useNavigate();
    const initialLicenseState = {
        companyName: "",
        type: "CTL",
        email: "",
        issueDate: "",
        validityYears: null,
        applicationFee: null,
        licenseFee: null,  
        annualFrequencyFee: null,
        annualUniversalServiceContribution: null,
        latitude: null,
        longitude: null
    };
    const [license, setLicense] = useState(initialLicenseState);
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setLicense({ ...license, [name]: value });
    };

    const saveLicense = (e) => {
        e.preventDefault();
        
        // Set default fees based on license type
        const defaultApplicationFee = license.type === 'CTL' ? 800.00 : 350.00;
        const defaultLicenseFee = license.type === 'CTL' ? 100000000.00 : 2000000.00;
        const defaultAnnualFrequencyFee = license.type === 'PRSL' ? 2000.00 : null;
        const defaultUniversalServiceFund = license.type === 'CTL' ? 3000.00 : null;
        
        const data = {
            companyName: license.companyName,
            email: license.email,
            issueDate: license.issueDate,
            type: license.type,
            validityYears: license.type === 'PRSL' ? (license.validityYears || null) : null,
            applicationFee: license.applicationFee || defaultApplicationFee,
            licenseFee: license.licenseFee || defaultLicenseFee,
            annualFrequencyFee: license.annualFrequencyFee || defaultAnnualFrequencyFee,
            annualUniversalServiceContribution: license.annualUniversalServiceContribution || defaultUniversalServiceFund,
            latitude: license.latitude || null,
            longitude: license.longitude || null
        };

        licenseService.create(data)
            .then(response => {
                setSubmitted(true);
                setTimeout(() => {
                    navigate('/licenses');
                }, 2000);
            })
            .catch(e => {
                console.error('Error creating license:', e);
            });
    };

    if (submitted) {
        return (
            <div className="success-container">
                <h4>✓ License created successfully!</h4>
                <p>Redirecting to license list...</p>
            </div>
        );
    }

    return (
        <div className="form-container">
            <h4>Add New License</h4>
            <form onSubmit={saveLicense}>
                <div className="form-group">
                    <label htmlFor="companyName">Company Name *</label>
                    <input
                        type="text"
                        className="form-control"
                        id="companyName"
                        required
                        value={license.companyName}
                        onChange={handleInputChange}
                        name="companyName"
                        placeholder="Enter company name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="type">License Type *</label>
                    <select 
                        className="form-control" 
                        id="type" 
                        name="type" 
                        value={license.type} 
                        onChange={handleInputChange}
                    >
                        <option value="CTL">CTL - Cellular Telecommunications License</option>
                        <option value="PRSL">PRSL - Public Radio Station License</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        required
                        value={license.email}
                        onChange={handleInputChange}
                        name="email"
                        placeholder="company@example.com"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="issueDate">Issue Date *</label>
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

                {license.type === 'PRSL' && (
                    <div className="form-group">
                        <label htmlFor="validityYears">Validity Period (Years) *</label>
                        <input
                            type="number"
                            className="form-control"
                            id="validityYears"
                            required={license.type === 'PRSL'}
                            value={license.validityYears || ''}
                            onChange={handleInputChange}
                            name="validityYears"
                            placeholder="Enter validity period in years"
                            min="1"
                        />
                        <small>PRSL validity period is variable and must be specified. CTL licenses have a fixed 15-year validity period.</small>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="applicationFee">Application Fee (USD) - Predefined</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="applicationFee"
                        value={license.applicationFee || (license.type === 'CTL' ? '800.00' : '350.00')}
                        onChange={handleInputChange}
                        name="applicationFee"
                        style={{ backgroundColor: '#f8f9fa' }}
                    />
                    <small>
                        {license.type === 'CTL' ? 'CTL Application Fee: $800.00' : 'PRSL Application Fee: $350.00'}
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="licenseFee">License Fee (USD) - Predefined</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="licenseFee"
                        value={license.licenseFee || (license.type === 'CTL' ? '100000000.00' : '2000000.00')}
                        onChange={handleInputChange}
                        name="licenseFee"
                        style={{ backgroundColor: '#f8f9fa' }}
                    />
                    <small>
                        {license.type === 'CTL' ? 'CTL License Fee: $100,000,000.00' : 'PRSL License Fee: $2,000,000.00'}
                    </small>
                </div>

                {license.type === 'PRSL' && (
                    <div className="form-group">
                        <label htmlFor="annualFrequencyFee">Annual Frequency Fee (USD)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            id="annualFrequencyFee"
                            value={license.annualFrequencyFee || '2000.00'}
                            onChange={handleInputChange}
                            name="annualFrequencyFee"
                            placeholder="Default: $2,000.00 (PRSL only)"
                        />
                        <small>PRSL companies pay an annual frequency fee of $2,000</small>
                    </div>
                )}

                {license.type === 'CTL' && (
                    <div className="form-group">
                        <label htmlFor="annualUniversalServiceContribution">Annual Universal Service Fund Contribution (USD)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            id="annualUniversalServiceContribution"
                            value={license.annualUniversalServiceContribution || '3000.00'}
                            onChange={handleInputChange}
                            name="annualUniversalServiceContribution"
                            placeholder="Default: $3,000.00 (CTL only)"
                        />
                        <small>CTL companies pay an annual contribution to Universal Services Fund of $3,000</small>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label htmlFor="latitude">Latitude (GPS)</label>
                        <input
                            type="number"
                            step="any"
                            className="form-control"
                            id="latitude"
                            value={license.latitude || ''}
                            onChange={handleInputChange}
                            name="latitude"
                            placeholder="e.g., -17.8292"
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label htmlFor="longitude">Longitude (GPS)</label>
                        <input
                            type="number"
                            step="any"
                            className="form-control"
                            id="longitude"
                            value={license.longitude || ''}
                            onChange={handleInputChange}
                            name="longitude"
                            placeholder="e.g., 31.0522"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-success">
                        Create License
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-danger"
                        onClick={() => navigate('/licenses')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddLicense;
