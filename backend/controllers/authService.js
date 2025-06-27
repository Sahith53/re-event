import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';

/**
 * Unified Authentication Service
 * Handles multiple authentication providers while preventing duplicate accounts
 */
class AuthService {
    
    /**
     * Find or create user with unified email-based approach
     * @param {Object} authData - Authentication data from provider
     * @param {string} authData.email - User's email
     * @param {string} authData.provider - Auth provider ('otp', 'google', etc.)
     * @param {string} authData.providerId - Provider-specific ID (optional)
     * @param {Object} authData.profile - Additional profile data (optional)
     * @returns {Object} - { user, isNewUser, token }
     */
    static async authenticateUser(authData) {
        const { email, provider, providerId, profile = {} } = authData;
        
        try {
            // STEP 1: Check if user already exists by email
            let existingUser = await UserModel.findOne({ email });
            let isNewUser = false;
            
            if (existingUser) {
                // User exists - add new auth provider if not already present
                await this.addAuthProviderToUser(existingUser, provider, providerId, profile);
                console.log(`User ${email} logged in via ${provider} (existing account)`);
            } else {
                // Create new user with the auth provider
                existingUser = await this.createUserWithAuthProvider(email, provider, providerId, profile);
                isNewUser = true;
                console.log(`New user ${email} created via ${provider}`);
            }
            
            // STEP 2: Update last login time
            existingUser.lastLogin = new Date();
            await existingUser.save();
            
            // STEP 3: Generate JWT token
            const token = this.generateToken(existingUser);
            
            return {
                user: existingUser,
                isNewUser,
                token,
                authProvider: provider
            };
            
        } catch (error) {
            console.error('Authentication error:', error);
            throw new Error(`Authentication failed: ${error.message}`);
        }
    }
    
    /**
     * Add authentication provider to existing user
     */
    static async addAuthProviderToUser(user, provider, providerId, profile) {
        // Add the new auth provider
        user.addAuthProvider(provider, providerId);
        
        // Update profile data if provided (without overwriting existing data)
        if (profile.displayName && !user.profile.displayName) {
            user.profile.displayName = profile.displayName;
        }
        if (profile.profilePicture && !user.profile.profilePicture) {
            user.profile.profilePicture = profile.profilePicture;
        }
        if (provider === 'google' && providerId) {
            user.profile.googleId = providerId;
        }
        
        // Mark email as verified if coming from trusted provider
        if (['google', 'facebook'].includes(provider)) {
            user.isEmailVerified = true;
        }
        
        await user.save();
        return user;
    }
    
    /**
     * Create new user with authentication provider
     */
    static async createUserWithAuthProvider(email, provider, providerId, profile) {
        const userData = {
            email,
            username: profile.displayName || `user_${Date.now()}`,
            primaryAuthProvider: provider,
            authProviders: [{
                provider,
                providerId,
                dateAdded: new Date()
            }],
            profile: {
                displayName: profile.displayName || '',
                profilePicture: profile.profilePicture || '',
            },
            isEmailVerified: ['google', 'facebook'].includes(provider),
            registeredEvents: [],
            createdEvents: []
        };
        
        // Add provider-specific data
        if (provider === 'google' && providerId) {
            userData.profile.googleId = providerId;
        }
        
        const newUser = new UserModel(userData);
        return await newUser.save();
    }
    
    /**
     * Generate JWT token for user
     */
    static generateToken(user) {
        return jwt.sign(
            { 
                userId: user._id, 
                email: user.email,
                authProviders: user.authProviders.map(p => p.provider)
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }
    
    /**
     * Check if user exists by email
     */
    static async findUserByEmail(email) {
        return await UserModel.findOne({ email });
    }
    
    /**
     * Check if user has specific authentication provider
     */
    static async userHasAuthProvider(email, provider) {
        const user = await UserModel.findOne({ email });
        return user ? user.hasAuthProvider(provider) : false;
    }
    
    /**
     * Get all authentication providers for user
     */
    static async getUserAuthProviders(email) {
        const user = await UserModel.findOne({ email });
        return user ? user.authProviders : [];
    }
    
    /**
     * Link new authentication provider to existing account
     */
    static async linkAuthProvider(email, provider, providerId, profile = {}) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        
        if (user.hasAuthProvider(provider)) {
            throw new Error(`User already has ${provider} authentication linked`);
        }
        
        return await this.addAuthProviderToUser(user, provider, providerId, profile);
    }
    
    /**
     * Unlink authentication provider (if user has multiple providers)
     */
    static async unlinkAuthProvider(email, provider) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        
        if (user.authProviders.length <= 1) {
            throw new Error('Cannot remove the only authentication method');
        }
        
        user.authProviders = user.authProviders.filter(p => p.provider !== provider);
        
        // Update primary provider if needed
        if (user.primaryAuthProvider === provider) {
            user.primaryAuthProvider = user.authProviders[0].provider;
        }
        
        await user.save();
        return user;
    }
}

export default AuthService; 