import { Navigate, Outlet, useLocation} from 'react-router-dom';
// import useAuth from '../auth/useAuth';
import {getToken} from '../utils/common';

// const useAuth =()=>{
//     const user = {loggedIn: false};
//     return user && user.loggedIn;
// }

const PrivateRoute =()=>{
    const location = useLocation();
    // const {auth}= useAuth();
    return getToken() ? <Outlet/> : <Navigate to="/login" state={{from: location}} replace/>
}

export default PrivateRoute
