// Check if user  is logged in
// If not, redirect to login page.
export const checkAuth = (req, res, next) => {
    if(!req.session.user){
        return res.redirect('/login');
    }
    next();
} 

// Redirects the user to the homepage if user is already logged in.
export const checkExistingUser = (req, res, next) => {
    if(req.session.user){
        return res.redirect('/');
    }
    next();
}

// Middleware for handling roles
export const applyPolicies = (roles) => {
    return (req, res, next) => {
        if(roles[0].toUpperCase() === 'PUBLIC'){
            return next();
        }
        if(!req.user){
            return res.status(401).send({status: 'Error', message: 'Not authenticated'})
        }
        if(!roles.includes(req.user.role.toUpperCase())){
            return res.status(403).send({status: 'Error', message: 'Not authorized'})
        }
        return next()
    }
}
/* 
export const isAdmin = (req, res, next) =>{
    if(req.session?.user?.role !== "admin"){
        req.logger.warning()
        return res.status(403).json({error : 'Forbidden'})
    }else{
        next()
    }
}

export const isUser = (req, res, next) =>{
    if(req.session?.user?.role !== "user"){
        return res.status(403).json({error : 'Forbidden'})
    }else{
        next()
    }
}

export const isUserOrAdmin = (req, res, next) =>{
    if(req.session?.user?.role !== "user" && req.session?.user?.role !== "admin" && req.session?.user?.role !== "premium"){
        return res.status(403).json({error : 'Forbidden'})
    }else{
        next()
    }
}

export const isAdminOrPremium = (req, res, next) =>{
    if(req.session?.user?.role !== "admin" && req.session?.user?.role !== "premium"){
        return res.status(403).json({error : 'Forbidden'})
    }else{
        next()
    }
}

export const isPremium = (req, res, next) =>{
    if(req.session?.user?.role !== "premium"){
        return res.status(403).json({error : 'Forbidden'})
    }else{
        next()
    }
}
 */