import React, { useEffect } from 'react'
import { removeUserSession } from '../../utils/common'
export default function Logout(props) {
    useEffect(() => {
        removeUserSession();
        props.history.push("/login");
    },[]);
    removeUserSession();
    window.location.href = "/login";
return (
<section className="wrapper">
    <div className="inner">
        <header className="special">
            <h5>Hasta Luego</h5>
        </header>
    </div>
</section>
);
}
