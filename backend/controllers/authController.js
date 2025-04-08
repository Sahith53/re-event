const testapi = async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        res.status(200).json({
            success: true,
            message: `Hello ${name}`,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in testapi:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export default testapi;