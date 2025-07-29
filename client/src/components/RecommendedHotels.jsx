import React from "react";
import HotelCard from "./Hotelcard";
import Title from "./Title";
import {useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useState } from "react";
import { useEffect } from "react";


const RecommendedHotels =()=>{
    const {rooms, searchedCities } = useAppContext()
    const [recommended, setrecommended] = useState([]);
    const filterHotels = ()=>{
        const filteredHotels = rooms.slice().filter(room => searchedCities.includes(room.hotel.city))
        setrecommended(filterHotels) 
    }
    useEffect(()=>{
        filterHotels()

    },[rooms, searchedCities])
    return recommended.length> 0 &&(
        <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50">
            <Title title='Recommended Hotels' subtitle='Discover the best hotels, world class interiors and rooms with fascinating views.' />
            <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
                {recommended.slice(0,4).map((room,index)=>(
                    <HotelCard key={room._id} room={room} index={index}/>
                ))}
            </div>
           
        </div>
    )
}
export default RecommendedHotels