
const errorMiddleware = (err, req, res, next) => {
    try{
        let error = {...err , statusCode : err.statusCode};

        error.message = err.message

        console.log(err)

        //mongoose bad object
        if(err.name === 'CastError'){
            const message = 'Resource not found';
            error = new Error(message);
            error.statusCode = 404;
        }

        //mongoose duplicate key
        if(err.code === 11000){
            const message = 'Duplicate value found';
            error = new Error(message);
            error.statusCode = 400;
        }

        if(err.name === "ValidationError"){
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(','));
            error.statusCode = 400;
        }

        res.status(error.statusCode).json({
            success:false,
            message : error.message || 'server error ',
        })

    }catch(internalError){
        console.error("Error inside middleware",internalError)

        if(res.headersSent){
            return next(internalError);
        }

        res.status(500).json({
            sucess:false,
            message : 'error while preocessing error'
        })
    }
}

export default errorMiddleware