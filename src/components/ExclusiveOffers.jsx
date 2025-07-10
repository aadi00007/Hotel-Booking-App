import React from "react";
import Title from "./Title";
import assets from "../assets/assets";

const ExclusiveOffers = ()=>{
    return(
<div>
    <div>
        <Title  title='Exclusive Offers' subtitle='These are the limited-time offers. Grab them before its too late!' />
        <button className="group flex items-center gap-2 font-medium cursor-pointer max-md:mt-12">View all offers
            <img src={assets.arrowIcon} alt=""  className='group-hover:translate-x-1 transition-all'/>
        </button>
    </div>
    <div>

    </div>
</div>
    )
}
export default ExclusiveOffers