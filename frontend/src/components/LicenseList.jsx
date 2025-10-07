import React, { useState, useEffect } from 'react';
import licenseService from '../services/licenseService';
import { Link } from 'react-router-dom';

const LicenseList = () => {
    const [licenses, setLicenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLicenses();
    }, []);

    const loadLicenses = () => {
        licenseService.getAll()
            .then(response => {
                const licensesWithExpiry = response.data.map(async (license) => {
                    try {
                        const yearsToExpiry = await licenseService.getYearsBeforeExpiry(license.id);
                        return { ...license, yearsBeforeExpiry: yearsToExpiry };
                    } catch (error) {
                        console.error(`Error getting expiry for license ${license.id}:`, error);
                        return { ...license, yearsBeforeExpiry: null };
                    }
                });
                
                Promise.all(licensesWithExpiry).then(licensesWithExpiryData => {
                    setLicenses(licensesWithExpiryData);
                    setLoading(false);
                });
            })
            .catch(e => {
                console.error('Error loading licenses:', e);
                setLoading(false);
            });
    };

    if (loading) {
        return <div><h3>Loading...</h3></div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3>License Management</h3>
                <Link to="/add" className="btn btn-success">+ Add New License</Link>
            </div>
            
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Company Name</th>
                            <th>Type</th>
                            <th>Issue Date</th>
                            <th>Validity Period</th>
                            <th>Application Fee</th>
                            <th>License Fee</th>
                            <th>Years to Expiry</th>
                            <th>GPS Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {licenses.length === 0 ? (
                            <tr>
                                <td colSpan="10" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No licenses found. Click "Add New License" to get started.
                                </td>
                            </tr>
                        ) : (
                            licenses.map((license) => {
                                const getValidityPeriod = () => {
                                    if (license.type === 'CTL') return '15 years';
                                    return license.validityYears ? `${license.validityYears} years` : 'Not set';
                                };
                                
                                const getApplicationFee = () => {
                                    if (license.applicationFee) return license.applicationFee.toLocaleString();
                                    return license.type === 'CTL' ? '800.00' : '350.00';
                                };
                                
                                const getLicenseFee = () => {
                                    if (license.licenseFee) return license.licenseFee.toLocaleString();
                                    return license.type === 'CTL' ? '100,000,000.00' : '2,000,000.00';
                                };
                                
                                const getGpsLocation = () => {
                                    if (license.latitude && license.longitude) {
                                        return `${license.latitude.toFixed(4)}, ${license.longitude.toFixed(4)}`;
                                    }
                                    return 'Not set';
                                };
                                
                                return (
                                    <tr key={license.id}>
                                        <td>{license.id}</td>
                                        <td><strong>{license.companyName}</strong></td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '12px',
                                                fontSize: '0.85rem',
                                                fontWeight: '500',
                                                backgroundColor: license.type === 'CTL' ? '#e3f2fd' : '#fff3e0',
                                                color: license.type === 'CTL' ? '#1976d2' : '#f57c00'
                                            }}>
                                                {license.type}
                                            </span>
                                        </td>
                                        <td>{license.issueDate}</td>
                                        <td>{getValidityPeriod()}</td>
                                        <td>${getApplicationFee()}</td>
                                        <td>${getLicenseFee()}</td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '8px',
                                                fontSize: '0.85rem',
                                                fontWeight: '500',
                                                backgroundColor: license.yearsBeforeExpiry ? 
                                                    (license.yearsBeforeExpiry <= 1 ? '#ffebee' : '#e8f5e8') : '#f5f5f5',
                                                color: license.yearsBeforeExpiry ? 
                                                    (license.yearsBeforeExpiry <= 1 ? '#c62828' : '#2e7d32') : '#666'
                                            }}>
                                                {license.yearsBeforeExpiry !== undefined ? 
                                                    `${license.yearsBeforeExpiry} years` : 
                                                    'Calculating...'
                                                }
                                            </span>
                                        </td>
                                        <td>{getGpsLocation()}</td>
                                        <td>
                                            <Link to={`/licenses/${license.id}`} className="btn btn-primary">
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LicenseList;
