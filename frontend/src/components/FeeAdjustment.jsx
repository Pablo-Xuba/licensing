import React, { useState } from 'react';
import licenseService from '../services/licenseService';

const FeeAdjustment = ({ license, onUpdate }) => {
    const [percentage, setPercentage] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!percentage || isNaN(percentage)) {
            setMessage('Please enter a valid percentage');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const updatedLicense = await licenseService.adjustApplicationFee(license.id, parseFloat(percentage));
            onUpdate(updatedLicense);
            setMessage(`Fee adjusted successfully! New fee: $${updatedLicense.applicationFee.toFixed(2)}`);
            setPercentage('');
        } catch (error) {
            setMessage('Error adjusting fee. Please check your permissions.');
            console.error('Fee adjustment error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fee-adjustment">
            <h4>Adjust Application Fee</h4>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="percentage">Adjustment Percentage (%)</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="percentage"
                        value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                        placeholder="e.g., 10 for 10% increase, -5 for 5% decrease"
                        required
                    />
                    <small>Current fee: ${license.applicationFee?.toFixed(2) || '0.00'}</small>
                </div>
                <button 
                    type="submit" 
                    className="btn btn-warning"
                    disabled={loading}
                >
                    {loading ? 'Adjusting...' : 'Adjust Fee'}
                </button>
            </form>
            {message && (
                <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} mt-2`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default FeeAdjustment;
