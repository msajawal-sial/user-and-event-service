export const jwtConfig = {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    signOptions: { expiresIn: '6000s' },
};

export const jwtConstants = {
    secret: process.env.JWT_SECRET || 'your-secret-key'
};