import { Navigate, Outlet} from 'react-router-dom';
// import useAuth from '../auth/useAuth';
import {getToken} from '../utils/common';

const PublicRoute =()=>{
    // const {auth}= useAuth();
    return !getToken() ? <Outlet/> : <Navigate to="/"/>
}

export default PublicRoute
