import React, { useState, useEffect } from 'react';
import licenseService from '../services/licenseService';

const LicenseComparison = () => {
    const [licenses, setLicenses] = useState([]);
    const [selectedLicense1, setSelectedLicense1] = useState('');
    const [selectedLicense2, setSelectedLicense2] = useState('');
    const [comparisonResult, setComparisonResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLicenses();
    }, []);

    const fetchLicenses = async () => {
        try {
            const data = await licenseService.getAllLicenses();
            setLicenses(data);
        } catch (error) {
            console.error('Error fetching licenses:', error);
        }
    };

    const compareLicenses = async () => {
        if (!selectedLicense1 || !selectedLicense2) {
            alert('Please select both licenses to compare');
            return;
        }

        if (selectedLicense1 === selectedLicense2) {
            alert('Please select different licenses to compare');
            return;
        }

        setLoading(true);
        try {
            const result = await licenseService.compareLicenses(selectedLicense1, selectedLicense2);
            setComparisonResult({
                areEqual: result,
                license1: licenses.find(l => l.id === parseInt(selectedLicense1)),
                license2: licenses.find(l => l.id === parseInt(selectedLicense2))
            });
        } catch (error) {
            console.error('Error comparing licenses:', error);
            alert('Error comparing licenses. Please check your permissions.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="license-comparison">
            <h4>Compare Licenses</h4>
            <div className="row">
                <div className="col-md-5">
                    <div className="form-group">
                        <label htmlFor="license1">Select First License</label>
                        <select
                            className="form-control"
                            id="license1"
                            value={selectedLicense1}
                            onChange={(e) => setSelectedLicense1(e.target.value)}
                        >
                            <option value="">Choose a license...</option>
                            {licenses.map(license => (
                                <option key={license.id} value={license.id}>
                                    {license.companyName} ({license.type})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-md-2 d-flex align-items-end">
                    <button 
                        className="btn btn-primary btn-block"
                        onClick={compareLicenses}
                        disabled={loading || !selectedLicense1 || !selectedLicense2}
                    >
                        {loading ? 'Comparing...' : 'Compare'}
                    </button>
                </div>
                <div className="col-md-5">
                    <div className="form-group">
                        <label htmlFor="license2">Select Second License</label>
                        <select
                            className="form-control"
                            id="license2"
                            value={selectedLicense2}
                            onChange={(e) => setSelectedLicense2(e.target.value)}
                        >
                            <option value="">Choose a license...</option>
                            {licenses.map(license => (
                                <option key={license.id} value={license.id}>
                                    {license.companyName} ({license.type})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {comparisonResult && (
                <div className="comparison-result mt-4">
                    <div className={`alert ${comparisonResult.areEqual ? 'alert-success' : 'alert-info'}`}>
                        <h5>
                            {comparisonResult.areEqual ? '✅ Licenses are EQUAL' : '❌ Licenses are DIFFERENT'}
                        </h5>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <h6>License 1: {comparisonResult.license1.companyName}</h6>
                            <ul className="list-unstyled">
                                <li><strong>Type:</strong> {comparisonResult.license1.type}</li>
                                <li><strong>Issue Date:</strong> {comparisonResult.license1.issueDate}</li>
                                <li><strong>Application Fee:</strong> ${comparisonResult.license1.applicationFee?.toFixed(2)}</li>
                                <li><strong>License Fee:</strong> ${comparisonResult.license1.licenseFee?.toFixed(2)}</li>
                                <li><strong>Validity Years:</strong> {comparisonResult.license1.validityYears || (comparisonResult.license1.type === 'CTL' ? '15 (fixed)' : 'N/A')}</li>
                            </ul>
                        </div>
                        <div className="col-md-6">
                            <h6>License 2: {comparisonResult.license2.companyName}</h6>
                            <ul className="list-unstyled">
                                <li><strong>Type:</strong> {comparisonResult.license2.type}</li>
                                <li><strong>Issue Date:</strong> {comparisonResult.license2.issueDate}</li>
                                <li><strong>Application Fee:</strong> ${comparisonResult.license2.applicationFee?.toFixed(2)}</li>
                                <li><strong>License Fee:</strong> ${comparisonResult.license2.licenseFee?.toFixed(2)}</li>
                                <li><strong>Validity Years:</strong> {comparisonResult.license2.validityYears || (comparisonResult.license2.type === 'CTL' ? '15 (fixed)' : 'N/A')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LicenseComparison;
