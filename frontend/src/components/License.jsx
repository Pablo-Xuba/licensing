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
    const [loading, setLoading] = useState(true);

    const getLicense = id => {
        licenseService.get(id)
            .then(response => {
                setCurrentLicense(response.data);
                setLoading(false);
            })
            .catch(e => {
                console.error('Error loading license:', e);
                setLoading(false);
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

    const updateLicense = (e) => {
        e.preventDefault();
        licenseService.update(currentLicense.id, currentLicense)
            .then(response => {
                setMessage("License updated successfully!");
                setTimeout(() => setMessage(""), 3000);
            })
            .catch(e => {
                console.error('Error updating license:', e);
                setMessage("Error updating license. Please try again.");
            });
    };

    const deleteLicense = () => {
        if (window.confirm('Are you sure you want to delete this license? This action cannot be undone.')) {
            licenseService.remove(currentLicense.id)
                .then(response => {
                    navigate("/licenses");
                })
                .catch(e => {
                    console.error('Error deleting license:', e);
                    setMessage("Error deleting license. Please try again.");
                });
        }
    };

    if (loading) {
        return <div><h3>Loading license...</h3></div>;
    }

    if (!currentLicense.id) {
        return (
            <div>
                <h3>License not found</h3>
                <button onClick={() => navigate("/licenses")} className="btn btn-primary">
                    Back to License List
                </button>
            </div>
        );
    }

    return (
        <div className="form-container">
            <h4>Edit License - {currentLicense.companyName}</h4>
            
            {message && (
                <div className={`message ${message.includes('Error') ? 'message-error' : 'message-success'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={updateLicense}>
                <div className="form-group">
                    <label htmlFor="companyName">Company Name *</label>
                    <input
                        type="text"
                        className="form-control"
                        id="companyName"
                        name="companyName"
                        value={currentLicense.companyName || ''}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter company name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="type">License Type *</label>
                    <select 
                        className="form-control" 
                        id="type" 
                        name="type" 
                        value={currentLicense.type || 'CTL'} 
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
                        name="email"
                        value={currentLicense.email || ''}
                        onChange={handleInputChange}
                        required
                        placeholder="company@example.com"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="issueDate">Issue Date *</label>
                    <input
                        type="date"
                        className="form-control"
                        id="issueDate"
                        name="issueDate"
                        value={currentLicense.issueDate || ''}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {currentLicense.type === 'PRSL' && (
                    <div className="form-group">
                        <label htmlFor="validityYears">Validity Period (Years) *</label>
                        <input
                            type="number"
                            className="form-control"
                            id="validityYears"
                            name="validityYears"
                            value={currentLicense.validityYears || ''}
                            onChange={handleInputChange}
                            required={currentLicense.type === 'PRSL'}
                            placeholder="Enter validity period in years"
                            min="1"
                        />
                        <small>CTL licenses have a fixed 15-year validity period</small>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="applicationFee">Application Fee (USD) - Predefined</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="applicationFee"
                        name="applicationFee"
                        value={currentLicense.applicationFee || (currentLicense.type === 'CTL' ? '800.00' : '350.00')}
                        onChange={handleInputChange}
                        style={{ backgroundColor: '#f8f9fa' }}
                    />
                    <small>
                        {currentLicense.type === 'CTL' ? 'CTL Application Fee: $800.00' : 'PRSL Application Fee: $350.00'}
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="licenseFee">License Fee (USD) - Predefined</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="licenseFee"
                        name="licenseFee"
                        value={currentLicense.licenseFee || (currentLicense.type === 'CTL' ? '100000000.00' : '2000000.00')}
                        onChange={handleInputChange}
                        style={{ backgroundColor: '#f8f9fa' }}
                    />
                    <small>
                        {currentLicense.type === 'CTL' ? 'CTL License Fee: $100,000,000.00' : 'PRSL License Fee: $2,000,000.00'}
                    </small>
                </div>

                {currentLicense.type === 'PRSL' && (
                    <div className="form-group">
                        <label htmlFor="annualFrequencyFee">Annual Frequency Fee (USD)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            id="annualFrequencyFee"
                            name="annualFrequencyFee"
                            value={currentLicense.annualFrequencyFee || '2000.00'}
                            onChange={handleInputChange}
                            placeholder="Default: $2,000.00 (PRSL only)"
                        />
                        <small>PRSL companies pay an annual frequency fee of $2,000</small>
                    </div>
                )}

                {currentLicense.type === 'CTL' && (
                    <div className="form-group">
                        <label htmlFor="annualUniversalServiceContribution">Annual Universal Service Fund Contribution (USD)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            id="annualUniversalServiceContribution"
                            name="annualUniversalServiceContribution"
                            value={currentLicense.annualUniversalServiceContribution || '3000.00'}
                            onChange={handleInputChange}
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
                            name="latitude"
                            value={currentLicense.latitude || ''}
                            onChange={handleInputChange}
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
                            name="longitude"
                            value={currentLicense.longitude || ''}
                            onChange={handleInputChange}
                            placeholder="e.g., 31.0522"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-success">
                        Update License
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-danger"
                        onClick={deleteLicense}
                    >
                        Delete License
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={() => navigate('/licenses')}
                    >
                        Back to List
                    </button>
                </div>
            </form>
        </div>
    );
};

export default License;
