import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already authenticated on app load
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const credentials = localStorage.getItem('authCredentials');
            if (!credentials) {
                setUser(null);
                setLoading(false);
                return;
            }

            // Try to access a protected endpoint to check if user is authenticated
            const { username, password } = JSON.parse(credentials);
            const response = await axios.get('http://localhost:8081/api/licenses', {
                auth: {
                    username: username,
                    password: password
                }
            });
            
            // If successful, user is authenticated
            // We'll need to get user info from the backend
            const userInfo = await getUserInfo();
            setUser(userInfo);
        } catch (error) {
            // User is not authenticated
            setUser(null);
            localStorage.removeItem('authCredentials');
        } finally {
            setLoading(false);
        }
    };

    const getUserInfo = async () => {
        try {
            // Make a request to get current user info
            const credentials = localStorage.getItem('authCredentials');
            if (!credentials) {
                throw new Error('No credentials found');
            }
            
            const { username, password } = JSON.parse(credentials);
            const response = await axios.get('http://localhost:8081/api/user/current', {
                auth: {
                    username: username,
                    password: password
                }
            });
            return response.data;
        } catch (error) {
            // If we can't get user info, try to determine from successful requests
            // For now, we'll return a basic user object
            return {
                username: 'authenticated',
                roles: ['USER']
            };
        }
    };

    const login = async (username, password) => {
        try {
            // Test authentication by making a request to a protected endpoint
            const response = await axios.get('http://localhost:8081/api/licenses', {
                auth: {
                    username: username,
                    password: password
                }
            });

            // If successful, store credentials and user info
            const adminUsers = ['taku', 'briel', 'ethel', 'charity', 'leon'];
            const userInfo = {
                username: username,
                roles: adminUsers.includes(username) ? ['ADMIN', 'MANAGER'] : ['VIEWER']
            };

            setUser(userInfo);
            
            // Store credentials for future requests
            localStorage.setItem('authCredentials', JSON.stringify({
                username: username,
                password: password
            }));

            return userInfo;
        } catch (error) {
            throw new Error('Authentication failed');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authCredentials');
    };

    const getAuthHeaders = () => {
        const credentials = localStorage.getItem('authCredentials');
        if (credentials) {
            const { username, password } = JSON.parse(credentials);
            return {
                auth: {
                    username: username,
                    password: password
                }
            };
        }
        return {};
    };

    const hasRole = (role) => {
        return user && user.roles && user.roles.includes(role);
    };

    const hasAnyRole = (roles) => {
        return user && user.roles && roles.some(role => user.roles.includes(role));
    };

    const value = {
        user,
        login,
        logout,
        loading,
        getAuthHeaders,
        hasRole,
        hasAnyRole,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
