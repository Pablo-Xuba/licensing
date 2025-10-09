import React, { useState, useEffect } from 'react';
import licenseService from '../services/licenseService';

const ExpiryCalculator = () => {
    const [licenses, setLicenses] = useState([]);
    const [selectedLicense, setSelectedLicense] = useState('');
    const [yearsBeforeExpiry, setYearsBeforeExpiry] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLicenses();
    }, []);

    const fetchLicenses = async () => {
        try {
            const data = await licenseService.getAllLicenses();
            setLicenses(data);
        } catch (error) {
            console.error('Error fetching licenses:', error);
            setError('Error fetching licenses. Please check your permissions.');
        }
    };

    const calculateYearsBeforeExpiry = async () => {
        if (!selectedLicense) {
            setError('Please select a license');
            return;
        }

        setLoading(true);
        setError('');
        setYearsBeforeExpiry(null);

        try {
            const years = await licenseService.getYearsBeforeExpiry(selectedLicense);
            setYearsBeforeExpiry(years);
        } catch (error) {
            console.error('Error calculating years before expiry:', error);
            setError('Error calculating years before expiry. Please check your permissions.');
        } finally {
            setLoading(false);
        }
    };

    const selectedLicenseData = licenses.find(l => l.id === parseInt(selectedLicense));

    return (
        <div className="expiry-calculator">
            <h4>Calculate Years Before Expiry</h4>
            <div className="row">
                <div className="col-md-8">
                    <div className="form-group">
                        <label htmlFor="expiryLicenseSelect">Select License</label>
                        <select
                            className="form-control"
                            id="expiryLicenseSelect"
                            value={selectedLicense}
                            onChange={(e) => {
                                setSelectedLicense(e.target.value);
                                setYearsBeforeExpiry(null);
                                setError('');
                            }}
                        >
                            <option value="">Choose a license...</option>
                            {licenses.map(license => (
                                <option key={license.id} value={license.id}>
                                    {license.companyName} ({license.type}) - Issued: {license.issueDate}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-md-4 d-flex align-items-end">
                    <button 
                        className="btn btn-primary btn-block"
                        onClick={calculateYearsBeforeExpiry}
                        disabled={loading || !selectedLicense}
                    >
                        {loading ? 'Calculating...' : 'Calculate'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger mt-3">
                    {error}
                </div>
            )}

            {yearsBeforeExpiry !== null && selectedLicenseData && (
                <div className="calculation-result mt-4">
                    <div className="alert alert-info">
                        <h5>Calculation Result</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <h6>License Details:</h6>
                                <ul className="list-unstyled">
                                    <li><strong>Company:</strong> {selectedLicenseData.companyName}</li>
                                    <li><strong>Type:</strong> {selectedLicenseData.type}</li>
                                    <li><strong>Issue Date:</strong> {selectedLicenseData.issueDate}</li>
                                    <li><strong>Validity Years:</strong> {selectedLicenseData.validityYears || (selectedLicenseData.type === 'CTL' ? '15 (fixed)' : 'N/A')}</li>
                                </ul>
                            </div>
                            <div className="col-md-6">
                                <h6>Expiry Information:</h6>
                                <div className="result-highlight">
                                    <strong>Years Before Expiry:</strong> 
                                    <span className={`badge ${yearsBeforeExpiry > 0 ? 'badge-success' : 'badge-danger'} ms-2`}>
                                        {yearsBeforeExpiry > 0 ? `${yearsBeforeExpiry} years` : 'Expired'}
                                    </span>
                                </div>
                                {yearsBeforeExpiry > 0 && (
                                    <p className="text-muted mt-2">
                                        This license will expire in {yearsBeforeExpiry} year{yearsBeforeExpiry !== 1 ? 's' : ''}.
                                    </p>
                                )}
                                {yearsBeforeExpiry <= 0 && (
                                    <p className="text-danger mt-2">
                                        This license has already expired or will expire soon.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpiryCalculator;
