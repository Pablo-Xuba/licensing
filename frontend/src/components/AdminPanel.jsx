import React, { useState, useEffect } from 'react';
import FeeAdjustment from './FeeAdjustment';
import LicenseComparison from './LicenseComparison';
import licenseService from '../services/licenseService';

const AdminPanel = () => {
    const [licenses, setLicenses] = useState([]);
    const [selectedLicense, setSelectedLicense] = useState(null);
    const [activeTab, setActiveTab] = useState('fee-adjustment');

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

    const handleLicenseUpdate = (updatedLicense) => {
        setLicenses(licenses.map(license => 
            license.id === updatedLicense.id ? updatedLicense : license
        ));
        setSelectedLicense(updatedLicense);
    };

    return (
        <div className="admin-panel">
            <div className="row">
                <div className="col-12">
                    <h2>Admin Tools</h2>
                    <p className="text-muted">Administrative functions for license management</p>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === 'fee-adjustment' ? 'active' : ''}`}
                                onClick={() => setActiveTab('fee-adjustment')}
                            >
                                Fee Adjustment
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === 'license-comparison' ? 'active' : ''}`}
                                onClick={() => setActiveTab('license-comparison')}
                            >
                                License Comparison
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    {activeTab === 'fee-adjustment' && (
                        <div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="licenseSelect">Select License to Adjust Fee</label>
                                        <select
                                            className="form-control"
                                            id="licenseSelect"
                                            value={selectedLicense?.id || ''}
                                            onChange={(e) => {
                                                const license = licenses.find(l => l.id === parseInt(e.target.value));
                                                setSelectedLicense(license);
                                            }}
                                        >
                                            <option value="">Choose a license...</option>
                                            {licenses.map(license => (
                                                <option key={license.id} value={license.id}>
                                                    {license.companyName} ({license.type}) - ${license.applicationFee?.toFixed(2)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            {selectedLicense && (
                                <div className="mt-4">
                                    <FeeAdjustment 
                                        license={selectedLicense} 
                                        onUpdate={handleLicenseUpdate}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'license-comparison' && (
                        <LicenseComparison />
                    )}
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <div className="alert alert-info">
                        <h5>Access Control Information</h5>
                        <p><strong>Admin Users (taku):</strong> Can adjust fees, compare licenses, generate reports, and manage all licenses</p>
                        <p><strong>Guest Users (guest):</strong> Can view licenses and generate reports</p>
                        <hr />
                        <p><strong>User Credentials:</strong></p>
                        <ul>
                            <li>Admin: <code>taku / password</code></li>
                            <li>Guest: <code>guest / guest</code></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
