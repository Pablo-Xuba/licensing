import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import licenseService from '../services/licenseService';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different license types
const ctlIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const prslIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const LicenseMap = () => {
    const [licenses, setLicenses] = useState([]);
    const [selectedLicense, setSelectedLicense] = useState(null);

    useEffect(() => {
        retrieveLicenses();
    }, []);

    const retrieveLicenses = () => {
        licenseService.getAll()
            .then(response => {
                // Filter licenses that have GPS coordinates
                const licensesWithCoordinates = response.data.filter(
                    license => license.latitude && license.longitude
                );
                setLicenses(licensesWithCoordinates);
            })
            .catch(e => {
                console.error('Error retrieving licenses:', e);
            });
    };

    const downloadReport = (format) => {
        const url = `http://localhost:8081/api/reports/${format}`;
        window.open(url, '_blank');
    };

    return (
        <div className="container" style={{ padding: '20px' }}>
            <h4>License Geographical Distribution</h4>
            
            <div style={{ marginBottom: '20px' }}>
                <button 
                    className="btn btn-danger" 
                    onClick={() => downloadReport('pdf')}
                    style={{ marginRight: '10px' }}
                >
                    📄 Download PDF Report
                </button>
                <button 
                    className="btn btn-success" 
                    onClick={() => downloadReport('excel')}
                    style={{ marginRight: '10px' }}
                >
                    📊 Download Excel Report
                </button>
                <button 
                    className="btn btn-primary" 
                    onClick={() => downloadReport('csv')}
                >
                    📋 Download CSV Report
                </button>
            </div>

            <div style={{ 
                border: '2px solid #ddd', 
                borderRadius: '8px', 
                padding: '20px',
                backgroundColor: '#f8f9fa',
                minHeight: '600px'
            }}>
                <h5>Interactive Map</h5>
                <p style={{ color: '#666' }}>
                    Showing {licenses.length} licenses with GPS coordinates
                </p>

                {/* Embedded Leaflet Map */}
                {licenses.length > 0 ? (
                    <MapContainer 
                        center={[licenses[0].latitude, licenses[0].longitude]} 
                        zoom={6} 
                        style={{ 
                            width: '100%', 
                            height: '500px', 
                            borderRadius: '8px'
                        }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {licenses.map((license) => (
                            <Marker 
                                key={license.id}
                                position={[license.latitude, license.longitude]}
                                icon={license.type === 'CTL' ? ctlIcon : prslIcon}
                            >
                                <Popup>
                                    <div style={{ minWidth: '200px' }}>
                                        <h6 style={{ margin: '0 0 10px 0', color: '#007bff' }}>
                                            {license.companyName}
                                        </h6>
                                        <p style={{ margin: '5px 0', fontSize: '14px' }}>
                                            <strong>Type:</strong> {license.type}
                                        </p>
                                        <p style={{ margin: '5px 0', fontSize: '14px' }}>
                                            <strong>Email:</strong> {license.email}
                                        </p>
                                        <p style={{ margin: '5px 0', fontSize: '14px' }}>
                                            <strong>Issue Date:</strong> {license.issueDate}
                                        </p>
                                        <p style={{ margin: '5px 0', fontSize: '14px' }}>
                                            <strong>Expiry Date:</strong> {license.expiryDate}
                                        </p>
                                        <p style={{ 
                                            margin: '10px 0 0 0', 
                                            fontSize: '12px',
                                            fontFamily: 'monospace',
                                            backgroundColor: '#f8f9fa',
                                            padding: '5px',
                                            borderRadius: '4px'
                                        }}>
                                            📍 {license.latitude?.toFixed(6)}, {license.longitude?.toFixed(6)}
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                ) : (
                    <div 
                        style={{ 
                            width: '100%', 
                            height: '500px', 
                            backgroundColor: '#e0e0e0',
                            position: 'relative',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            padding: '20px',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <p style={{ margin: '0', color: '#666' }}>
                                🗺️ No licenses with GPS coordinates to display
                            </p>
                            <small>Add GPS coordinates to licenses to see them on the map</small>
                        </div>
                    </div>
                )}

                {/* License List */}
                <div style={{ marginTop: '30px' }}>
                    <h5>Licensed Companies with GPS Coordinates</h5>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '15px',
                        marginTop: '15px'
                    }}>
                        {licenses.map((license) => (
                            <div 
                                key={license.id}
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: selectedLicense?.id === license.id 
                                        ? '0 4px 12px rgba(0,123,255,0.3)' 
                                        : '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                                onClick={() => setSelectedLicense(license)}
                            >
                                <h6 style={{ 
                                    margin: '0 0 10px 0',
                                    color: '#007bff',
                                    fontSize: '16px'
                                }}>
                                    {license.companyName}
                                </h6>
                                <div style={{ fontSize: '14px', color: '#666' }}>
                                    <p style={{ margin: '5px 0' }}>
                                        <strong>Type:</strong> {license.type}
                                    </p>
                                    <p style={{ margin: '5px 0' }}>
                                        <strong>📍 Location:</strong>
                                    </p>
                                    <p style={{ 
                                        margin: '5px 0 5px 20px',
                                        fontSize: '12px',
                                        fontFamily: 'monospace',
                                        backgroundColor: '#f8f9fa',
                                        padding: '5px',
                                        borderRadius: '4px'
                                    }}>
                                        Lat: {license.latitude?.toFixed(6)}<br/>
                                        Lng: {license.longitude?.toFixed(6)}
                                    </p>
                                    <p style={{ margin: '5px 0' }}>
                                        <strong>Issue Date:</strong> {license.issueDate}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {licenses.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#999'
                        }}>
                            <p>No licenses with GPS coordinates found.</p>
                            <p>Add GPS coordinates to licenses to see them on the map.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LicenseMap;
